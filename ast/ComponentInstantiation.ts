import { Visitor } from "../visitor";
import { ASTNode } from "./ASTNode";
import { NamedArgument } from "./NamedArgument";
import {ComponentUsage} from "./ComponentUsage";

/**
 * Represents the instantiation of a component.
 * 
 * Ex: `myText WITH t = "Like"`
 */
export class ComponentInstantiation extends ComponentUsage {
    private _componentName: string;
    private _arguments: NamedArgument[];

    constructor(componentName: string, args: NamedArgument[]) {
        super();
        this._componentName = componentName;
        this._arguments = args;
    }

    get componentName() {
        return this._componentName;
    }

    get argumentList() {
        return this._arguments;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitComponentInstantiation(this, t);
    }
}