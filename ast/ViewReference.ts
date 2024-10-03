import { Visitor } from "../visitor";
import { Value } from "./Value";

/**
 * A reference to a view. Currently, this is only supported in the `open()` function,
 * i.e. when calling `open(About.view)`.
 * 
 * In the example above, `ViewReference.name` returns `'About'`.
 */
export class ViewReference extends Value {
    private _name: string;

    constructor(name: string) {
        super();
        this._name = name;
    }

    get name() {
        return this._name;
    }

    accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitViewReference(this, t);
    }
}
