import {BaseVisitor} from "../visitor";
import {
    ComponentDefinition,
    FunctionCall,
    List,
    ListValue,
    PropertyAssignment,
    Value,
    ViewProgram,
    ViewReference,
    MainProgram
} from "../ast";


/**
 * Checks to see if any open() functions defined in Components.def reference a non-existent .view file
 * checkProgram should be the only method called from outside of this class
 */
export class FunctionChecker extends BaseVisitor<string[], string> {
    public checkProgram(mainProgram: MainProgram): string {
        const context: string[] = []
        return mainProgram.accept(this, context);
    }

    visitMainProgram(mainProgram: MainProgram, t: string[]): string {
        let errors: string = "";
        // collect view names in t
        mainProgram.views.forEach((view) => {
            view.accept(this, t);
        });
        // check if any open() functions reference undefined views
        mainProgram.definition.componentDefinitions.forEach((compDef) => {
            const error = compDef.accept(this, t);
            if (error) errors += error;
        });
        return errors;
    }

    visitViewProgram(viewProgram: ViewProgram, t: string[]): string {
        t.push(viewProgram.fileName)
        return "";
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: string[]): string {
        let errors: string = ""
        componentDefinition.propertyAssignList.forEach((propAssign) => {
            const error = propAssign.accept(this, t);
            if (error) errors += error;
        });
        return errors;
    }

    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: string[]): string {
        return propertyAssign.value.accept(this, t);
    }

    visitFunctionCall(func: FunctionCall, t: string[]): string {
        let errors: string = "";
        func.args.forEach((arg) => {
            const error = arg.accept(this, t);
            if (error) errors += error;
        });
        return errors;
    }

    visitValue(value: Value, t: string[]): string {
        return value.accept(this, t);
    }

    visitViewReference(viewRef: ViewReference, t: string[]): string {
        if (t.includes(viewRef.name)) {
            return "";
        }
        return "Error: " + viewRef.name + ".view doesn't exist\n";
    }
}