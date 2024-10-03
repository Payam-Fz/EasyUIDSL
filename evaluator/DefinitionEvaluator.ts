import {Writable} from "stream";
import cloneDeep from "lodash/cloneDeep";
import {
    BaseComponent,
    BooleanConstant,
    ComponentDefinition,
    ComponentEnum,
    Constant,
    DefProgram,
    FunctionCall,
    FunctionEnum,
    List,
    ObjectPropertyValue,
    Property,
    PropertyAssignment,
    PropertyType,
    StringConstant,
    Variable,
    VariableDefinition,
    ViewReference
} from "../ast";
import {ObjectPropertyExtractor} from "./ObjectPropertyExtractor";
import {BaseEvaluator} from "./BaseEvaluator";
import {VariableMap} from "./VariableMap";

interface StateHook {
    variableName: string;
    setterName: string;
    initialValue: Constant | null;
}
export class DefinitionEvaluator extends BaseEvaluator {

    private stateVariables: VariableMap = new VariableMap();
    private defaultContainerStyles: Record<string, string> = {
        "display": "grid",
        "justifyItems": "center",
        "alignItems": "center",
        "gap": "10px",
        "padding": "10px"
    }

    visitDefProgram(defProgram: DefProgram, t: Writable): void {
        // Deep Clone since this visitor needs to modify the AST
        const clonedDefProgram: DefProgram = cloneDeep(defProgram);
        this.getStateHooks(clonedDefProgram).forEach(state => this.visitStateHook(state, t));
        t.write("\n"); // extra newline to separate sections
        clonedDefProgram.componentDefinitions.forEach(cd => cd.accept(this, t));
        t.write("\n"); // extra newline to separate sections
        clonedDefProgram.variableDefinitions.forEach(vd => vd.accept(this, t));
        t.write("\n"); // extra newline to separate sections
    }

    visitBaseComponent(baseComponent: BaseComponent, t: Writable): void {
        t.write(baseComponent.htmlTag);
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: Writable): void {
        const variableNames : string[] = this.getComponentVariableNames(componentDefinition);

        // Add 'components' parameter internally for CONTAINER
        if (componentDefinition.baseComponent.component === ComponentEnum.Container) {
            variableNames.push('components');
        }

        // Start of opening tag
        t.write(
            "\tconst " + componentDefinition.name + " = ({" +
            variableNames.join(", ") + "}) => (\n" + "\t\t<"
        );
        componentDefinition.baseComponent.accept(this, t);
        t.write("\n");

        // Styling properties (e.g. color, border, height)
        t.write("\t\t\tstyle = {{\n");
        // default CONTAINER styles
        if (componentDefinition.baseComponent.component === ComponentEnum.Container) {
            Object.entries(this.defaultContainerStyles).forEach(([prop, value]) => {
                t.write("\t\t\t\t" + prop + ": \"" + value + "\",\n");
            });
        } else if (componentDefinition.baseComponent.component === ComponentEnum.Button) {
            t.write("\t\t\t\tcursor: \"pointer\",\n");
        }
        // other styles (default CONTAINER styles can be overridden here)
        componentDefinition.propertyAssignList
            .filter(assignment => assignment.property.type === PropertyType.Style)
            .forEach(assignment => {
                t.write("\t\t\t\t");
                assignment.accept(this, t);
        });
        t.write("\t\t\t}}\n");

        // Functional properties (e.g. onClick, url, alt, checked)
        if (componentDefinition.baseComponent.component === ComponentEnum.Checkbox) {
            t.write("\t\t\ttype=\"checkbox\"\n");
        } else if (componentDefinition.baseComponent.component === ComponentEnum.TextInput) {
            t.write("\t\t\ttype=\"text\"\n");
        }
        componentDefinition.propertyAssignList
            .filter(assignment => assignment.property.type === PropertyType.Functional)
            .forEach(assignment => {
                t.write("\t\t\t");
                assignment.accept(this, t);
            });

        // End of opening tag
        t.write("\t\t>\n");

        // Child properties (e.g. components, text)
        componentDefinition.propertyAssignList
            .filter(assignment => assignment.property.type === PropertyType.Child)
            .forEach(assignment => {
                t.write("\t\t\t");
                assignment.accept(this, t);
            });
        if (variableNames.includes('components')) {
            t.write("\t\t\t{components}\n")
        }

        // Closing tag
        t.write("\t\t</");
        componentDefinition.baseComponent.accept(this, t);
        t.write(">\n" + "\t);\n");
    }

    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: Writable): void {
        switch (propertyAssign.property.type) {
            case PropertyType.Style:
                propertyAssign.property.accept(this, t);
                t.write(": ");
                if (propertyAssign.property.name === "visible") {
                    t.write((propertyAssign.value as BooleanConstant).value ? "\"visible\"" : "\"hidden\"");
                } else if (propertyAssign.property.name === "direction") {
                    // direction is exact opposite of
                    t.write((propertyAssign.value as StringConstant).value === "row" ? "\"column\"" : "\"row\"");
                } else {
                    propertyAssign.value.accept(this, t);
                }
                t.write(",\n");
                break;
            case PropertyType.Functional:
                propertyAssign.property.accept(this, t);
                t.write(" = {");
                if (propertyAssign.property.name === "onclick") {
                    t.write("() => {");
                    propertyAssign.value.accept(this, t);
                    t.write("}");
                } else {
                    propertyAssign.value.accept(this, t);
                }
                t.write("}\n");
                break;
            case PropertyType.Child:
                t.write("{");
                propertyAssign.value.accept(this, t);
                t.write("}\n");
                break;
        }
    }

    visitProperty(property: Property, t: Writable): void {
        t.write(property.htmlProperty);
    }

    visitVariableDefinition(variableDefinition: VariableDefinition, t: Writable): void {
        t.write("\tconst ");
        variableDefinition.variable.accept(this, t);
        t.write(" = ");
        variableDefinition.componentInstantiation.accept(this, t);
        t.write(";\n");
    }

    visitFunctionCall(func: FunctionCall, t: Writable): void {

        switch (func.type) {
            case FunctionEnum.Set:
                if (func.args.length !== 2) {
                    throw new Error("Wrong number of arguments passed to the Set function.");
                }
                const target = func.args[0];
                if (!(target instanceof ObjectPropertyValue)) {
                    throw new Error("Invalid argument passed to the 'set' function. It must be a component property.")
                }
                t.write(this.getStateSetterName(target.toStateVariable()) + "(");
                func.args[1].accept(this, t);
                t.write(");")
                break;
            case FunctionEnum.Open:
                t.write("setCurrentView(\"");
                const destination = func.args[0];
                if (!(destination instanceof ViewReference)) {
                    throw new Error("Invalid argument passed to the 'open' function. It must be in the format 'Name.view'.")
                }
                destination.accept(this, t);
                t.write("\");");
                break;
        }
    }

    // replace 'obj.property' with 'objProperty' variable which
    // must be a useState variable and defined in the variableMap
    visitObjectPropertyValue(objPropertyVal: ObjectPropertyValue, t: Writable): void {
        const stateVariable = objPropertyVal.toStateVariable();
        if (!this.stateVariables.hasVariable(stateVariable.name)) {
            throw new Error(`Component property '${objPropertyVal.toString()}' is not defined as a useState variable.`);
        } else {
            stateVariable.accept(this, t);
        }
    }

    visitViewReference(viewRef: ViewReference, t: Writable): void {
        t.write(viewRef.name);
    }

    // List in .def consists of either functions or values
    visitList(list: List, t: Writable): void {

        // list separation depends on the type of items, so need to check item type
        // if list of values, it should write [A, B, C ...]
        // if list of functions, it should write one per line: A \n B \n C ...

        if (list.values[0] instanceof FunctionCall) {
            list.values.forEach((v, i) => {
                t.write("\n\t\t\t\t");
                v.accept(this, t);
            });
            t.write("\n\t\t\t");
        } else {
            super.visitList(list, t);
        }
    }

    //-------------- helpers -------------

    // Finds all set and view functions and creates useState hooks accordingly
    private getStateHooks(defProgram: DefProgram): StateHook[] {
        const pendingHooks: StateHook[] = [];

        // view useState (this is always added)
        pendingHooks.push({
            variableName: "currentView",
            setterName: "setCurrentView",
            initialValue: new StringConstant("Main")
        });

        // property useStates
        const objPropExtractor = new ObjectPropertyExtractor();
        const allObjProperties = defProgram.accept(objPropExtractor, null);
        allObjProperties.forEach(objectProperty => {
            // if not created already, add it to the list of hooks and variables
            const stateVariable = objectProperty.toStateVariable();
            if (!this.stateVariables.hasVariable(stateVariable.name)) {
                this.stateVariables.defineAndStoreVariable(stateVariable.name, objectProperty);
                const state = this.replaceStateProperties(defProgram, objectProperty);
                pendingHooks.push(state);
            }
        });

        return pendingHooks;
    }

    // picWidth -> setPicWidth
    private getStateSetterName(variable: Variable): string {
        const varName = variable.name;
        return ("set" + varName.charAt(0).toUpperCase() + varName.slice(1));
    }

    // Finds the PropertyAssignment nodes whose values are modified elsewhere in a set function, and
    // replaces that node with a variable name corresponding to the useState variable
    private replaceStateProperties(defProgram: DefProgram, objectProperty: ObjectPropertyValue): StateHook {
        const componentName = objectProperty.variable.name;
        const propertyName = objectProperty.property.name;
        const targetAssignment = defProgram.componentDefinitions
            .find(cd => cd.name === componentName)?.propertyAssignList
            .find(pa => pa.property.name === propertyName);

        if (!targetAssignment) {
            throw new Error(`The component property '${objectProperty.toString()}' is missing.`);
        }
        const stateVariable = objectProperty.toStateVariable();
        const initialValue = targetAssignment.value;
        targetAssignment.value = stateVariable;

        // Return the corresponding hook
        return {
            variableName: stateVariable.name,
            setterName: this.getStateSetterName(stateVariable),
            initialValue: initialValue
        }
    }

    // Returns all variable names used as value of parmeters.
    private getComponentVariableNames(componentDefinition: ComponentDefinition): string[] {
        return componentDefinition.propertyAssignList
            .filter(assignment =>
                assignment.value instanceof Variable
                && !this.stateVariables.hasVariable(assignment.value.name)  // exclude variables defines as states
            ).map(assignment => (assignment.value as Variable).name);
    }

    // Writes state hooks. This is not a typical method from Visitor but follows the same format.
    visitStateHook(stateHook: StateHook, t: Writable) {
        t.write("\tconst [" + stateHook.variableName + ", " + stateHook.setterName + "] = useState(");
        if (stateHook.initialValue) {
            stateHook.initialValue.accept(this, t);
        } else {
            console.error(`Missing initial value for state '${stateHook.variableName}'`);
        }
        t.write(");\n");
    }
}