import { Visitor } from "../visitor";
import {ASTNode} from "./ASTNode";
import { ComponentDefinition } from "./ComponentDefinition";
import { VariableDefinition } from "./VariableDefinition";

/**
 * Represents a full .def file
 */
export class DefProgram extends ASTNode{

    private _componentDefinitions: ComponentDefinition[] = [];
    private _variableDefinitions: VariableDefinition[];

    constructor(
        componentDefinitions: ComponentDefinition[], 
        variableDefinitions: VariableDefinition[]
    ) {
        super();
        this._componentDefinitions = componentDefinitions;
        this._variableDefinitions = variableDefinitions;
    }

    get componentDefinitions(): ComponentDefinition[] {
        return this._componentDefinitions;
    }

    get variableDefinitions() {
        return this._variableDefinitions;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitDefProgram(this, t);
    }
}
