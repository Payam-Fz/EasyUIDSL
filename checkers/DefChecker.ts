import {BaseVisitor} from "../visitor";
import {ComponentDefinition, Variable, MainProgram} from "../ast";

/**
 * Checks to see if any variables used in property assignments exist in Component's param list
 * checkProgram should be the only method called from outside this class
 */
export class DefChecker extends BaseVisitor<string[], string> {
    public checkProgram(mainProgram: MainProgram): string {
        const context: string[] = [];
        return mainProgram.accept(this, context);
    }

    visitMainProgram(mainProgram: MainProgram, t: string[]): string {
        let errors = "";
        mainProgram.definition.componentDefinitions.forEach((compDef) => {
            const error = compDef.accept(this, t);
            if (error) errors += error;
        });
        return errors;
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: string[]): string {
        let errors = "";
        t = [];
        // collect param names in t
        componentDefinition.paramList.params.forEach((param) => {
            t.push(param.name)
        });
        componentDefinition.propertyAssignList.forEach((propAssign) => {
            const error = propAssign.value.accept(this, t);
            if (error) errors += error;
        });
        return errors;
    }

    visitVariable(variable: Variable, t: string[]): string {
        if (t.includes(variable.name)) {
            return "";
        }
        return "Error: property assignment is referencing undefined parameter " + variable.name + "\n";
    }
}