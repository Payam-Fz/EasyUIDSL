import { Visitor } from "../visitor";
import { Property } from "./Property";
import { Value } from "./Value";
import { Variable } from "./Variable";

/**
 * Represents the access of a property on an object (component)
 * 
 * Ex: `pic.width` where `pic` is the variable for the object and `width` is the property
 * being accessed.
 * 
 * In a `set()` call like `set(pic.width, pic.width + 100)`, there would be 
 * 2 `ObjectPropertyValue`s.
 */
export class ObjectPropertyValue extends Value {
    private _variable: Variable;
    private _property: Property;

    constructor(variable: Variable, property: Property) {
        super();
        this._variable = variable;
        this._property = property;
    }

    get variable() {
        return this._variable;
    }

    get property() {
        return this._property;
    }

    // Returns a Variable object with name "variablePropery"
    toStateVariable() {
        let part1 = this._variable.name;
        part1 = part1.charAt(0).toLowerCase() + part1.slice(1);
        let part2 = this._property.name;
        part2 = part2.charAt(0).toUpperCase() + part2.slice(1);
        return new Variable(part1 + part2);
    }

    toString() {
        return this._variable.name + "." + this._property.name;
    }

    accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitObjectPropertyValue(this, t);
    }
}