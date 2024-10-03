import { Visitor } from "../visitor";
import { Constant } from "./Constant";

/**
 * A constant numerical value
 */
export class NumberConstant extends Constant {

    private _number: number;
    constructor(numberStr: string) {
        super();
        this._number = parseInt(numberStr, 10);
    }

    get value(): number {
        return this._number;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitNumberConstant(this, t);
    }
}