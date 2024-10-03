import { Visitor } from "../visitor";
import {ComponentUsage} from "./ComponentUsage";

/**
 * A variable which represents an instantiated component or a parameter
 */
export class Variable extends ComponentUsage {

    private _name: string;
    constructor(name: string) {
        super();
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitVariable(this, t);
    }
}
