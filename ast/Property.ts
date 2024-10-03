import { Visitor } from "../visitor";
import {ASTNode} from "./ASTNode";
import {ComponentEnum} from "./BaseComponent";

/**
 * A predefined property like width, color, fontsize, etc.
 */

export enum PropertyType {
    Style,
    Functional,
    Child
}

export class Property extends ASTNode {

    // List of properties that can go in the style={} property
    private _styleProperties = ["color", "backgroundcolor", "width", "height",
        "visible", "fontsize", "fontstyle", "direction", "alignment", "gap", "padding",
        "border", "borderstyle", "bordercolor", "borderwidth"];
    // List of properties that will be a child component
    private _childProperties = ["components", "text"];

    private _htmlPropertyMap: Record<string, string> = {
        "onclick" : "onClick",
        "direction": "gridAutoFlow",
        "alignment": "justifySelf",
        "fontsize": "fontSize",
        "fontstyle": "fontWeight",
        "backgroundcolor": "backgroundColor",
        "borderstyle": "borderStyle",
        "bordercolor": "borderColor",
        "borderwidth": "borderWidth",
        "visible": "visibility",
        "url": "src"
    }

    private _property: string;
    private _type: PropertyType;

    constructor(property: string) {
        super();
        this._property = property;
        if (this._styleProperties.includes(property)) {
            this._type = PropertyType.Style;
        } else if (this._childProperties.includes(property)) {
            this._type = PropertyType.Child;
        } else {
            this._type = PropertyType.Functional;
        }
    }

    get name(): string {
        return this._property;
    }
    get type(): PropertyType {
        return this._type;
    }

    get htmlProperty(): string {
        if (this._property in this._htmlPropertyMap) {
            return this._htmlPropertyMap[this._property];
        } else {
            return this._property;
        }

    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitProperty(this, t);
    }
}