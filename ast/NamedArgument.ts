import { Value } from "./Value";
import { ASTNode } from "./ASTNode";
import { Visitor } from "../visitor";


/**
 * An argument that is passed into a component during instantiation. This argument name
 * and value are determined by the caller of the component.
 * 
 * Ex: Given `myText WITH t="Change picture dimensions"`, `t` is the `parameterName` and
 * `"Change picture dimensions"` is the `argumentValue`.
 */
export class NamedArgument extends ASTNode {
    private _parameterName: string;
    private _argumentValue: Value;

    constructor(name: string, value: Value) {
        super();
        this._parameterName = name;
        this._argumentValue = value;
    }

    get parameterName(): string {
        return this._parameterName;
    }

    get argumentValue(): Value {
        return this._argumentValue;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitNamedArgument(this, t);
    }
}