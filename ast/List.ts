import { Value } from "./Value";
import { Visitor } from "../visitor";
import { ListValue } from "./ListValue";

/**
 * A list of either component variables or function calls
 * 
 * Ex: `[hb, ab]`
 * 
 * Ex: `[set(obj.width, obj.width+100), set(obj.height, obj.height +100)]`
 */
export class List extends Value {

    private _values: ListValue[];

    constructor(values: ListValue[]) {
        super();
        this._values = values;
    }

    get values() {
        return this._values;
    }

    accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitList(this, t);
    }
}
