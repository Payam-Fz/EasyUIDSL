import {BaseVisitor} from "../visitor";
import {
    ComponentDefinition,
    ComponentInstantiation,
    VariableDefinition,
    ViewProgram,
    MainProgram,
    Variable
} from "../ast";

/**
 * Checks to see if variable names and component names used in .view files have been defined
 * Checks to see if variable names and component names used in .def has already been used or not
 * checkProgram should be the only method called from outside this class
 */
export class VariableChecker extends BaseVisitor<Set<string>, string> {
    public checkProgram(mainProgram: MainProgram): string {
        const vars = new Set<string>();
        return mainProgram.accept(this, vars);
    }

    visitMainProgram(mainProgram: MainProgram, t: Set<string>): string {
        let errors: string = "";
        mainProgram.definition.componentDefinitions.forEach((compDef) => {
            errors += compDef.accept(this, t);
        });
        mainProgram.definition.variableDefinitions.forEach((varDef) => {
            errors += varDef.accept(this, t);
        });
        mainProgram.views.forEach((view) => {
            errors += view.accept(this, t);
        });
        return errors;
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: Set<string>): string {
        const name = componentDefinition.name;
        if (!t.has(name)) {
            t.add(name);
            return "";
        }
        return "Error: component name, " + name + ", is already in use. Please use another name\n";
    }

    visitVariableDefinition(variableDefinition: VariableDefinition, t: Set<string>): string {
        const name = variableDefinition.variable.name;
        if (!t.has(name)) {
            t.add(name);
            return variableDefinition.componentInstantiation.accept(this, t);
        }
        return "Error: variable name, " + name + ", is already in use. Please use another name\n";
    }

    visitViewProgram(viewProgram: ViewProgram, t: Set<string>): string {
        let errors = "";
        viewProgram.componentUsages.forEach((compUsg) => {
            errors += compUsg.accept(this, t);
        });
        return errors;
    }

    visitComponentInstantiation(componentInstantiation: ComponentInstantiation, t: Set<string>): string {
        const name = componentInstantiation.componentName;
        if (t.has(name)) {
            return "";
        }
        return "Error: " + name + " hasn't been defined\n";
    }

    visitVariable(variable: Variable, t: Set<string>): string {
        const name = variable.name;
        if (t.has(name)) {
            return "";
        }
        return "Error: " + name + " hasn't been defined\n";
    }
}