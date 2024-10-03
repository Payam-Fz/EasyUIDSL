import { Visitor } from "../visitor";
import { Variable } from "./";
import { ASTNode } from "./ASTNode";
import { ComponentInstantiation } from "./ComponentInstantiation";

/**
 * The assignment of a component instantiation to some variable name.
 * 
 * Ex:
 * `myText WITH t = "Like" AS likeButtonText`
 * 
 * where `myText WITH t = "Like"` is the component instantiation and `likeButtonText`
 * is the variable name.
 */
export class VariableDefinition extends ASTNode {
    private _variable: Variable;
    private _componentInstantiation: ComponentInstantiation;

    constructor(variable: Variable, componentInstantiation: ComponentInstantiation) {
        super();
        this._variable = variable;
        this._componentInstantiation = componentInstantiation;
    }

    get variable() {
        return this._variable;
    }

    get componentInstantiation() {
        return this._componentInstantiation;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitVariableDefinition(this, t);
    }
}