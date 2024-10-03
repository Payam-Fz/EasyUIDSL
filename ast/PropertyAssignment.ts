import { ASTNode } from "./ASTNode";
import { Property } from "./Property";
import { Value } from "./Value";
import { Visitor } from "../visitor";

/**
 * A property assignment within a component
 * 
 * ex: `text = 'About'`
 * 
 * ex: `onclick = [set(obj.width, obj.width+100), set(obj.height, obj.height +100)]`
 */
export class PropertyAssignment extends ASTNode {
    private _property: Property;
    private _value: Value;

    constructor(property: Property, value: Value) {
        super();
        this._property = property;
        this._value = value;
    }

    get property(): Property {
        return this._property;
    }

    get value(): Value {
        return this._value;
    }

    set value(newValue: Value) {
        this._value = newValue;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitPropertyAssignment(this, t);
    }
}