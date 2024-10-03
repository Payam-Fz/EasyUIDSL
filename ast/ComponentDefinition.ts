import {ASTNode} from "./ASTNode";
import {ParamList} from "./ParamList";
import {PropertyAssignment} from "./PropertyAssignment";
import {Variable} from "./Variable";
import {BaseComponent} from "./BaseComponent";
import { Visitor } from "../visitor";

/**
 * A component definition.
 * 
 * ex:
 * TEXT myText:
 *  text = t
 *  color = 'black'
 *  fontsize = 12
 *  fontstyle = 'bold'
 */
export class ComponentDefinition extends ASTNode {
    private _baseComponent: BaseComponent;
    private _name: string;
    private _paramList: ParamList;
    private _propertyAssignList: PropertyAssignment[];

    constructor(baseComponent: BaseComponent, name: string, paramList: ParamList, propertyAssignList: PropertyAssignment[]) {
        super();
        this._baseComponent = baseComponent;
        this._name = name;
        this._paramList = paramList;
        this._propertyAssignList = propertyAssignList;
    }

    get baseComponent(): BaseComponent {
        return this._baseComponent;
    }

    get name(): string {
        return this._name;
    }

    get paramList(): ParamList {
        return this._paramList;
    }

    get propertyAssignList(): PropertyAssignment[] {
        return this._propertyAssignList;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitComponentDefinition(this, t);
    }
}