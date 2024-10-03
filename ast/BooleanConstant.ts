import { Visitor } from "../visitor";
import { Constant } from "./Constant";

/**
 * A boolean value, e.g. true or false
 */
export class BooleanConstant extends Constant {
    private _value: boolean;

    constructor(value: string) {
        super();
        this._value = value === 'true';
    }

    get value() {
        return this._value;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitBooleanConstant(this, t);
    }
}
