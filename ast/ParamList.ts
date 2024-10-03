import { Visitor } from "../visitor";
import {ASTNode} from "./ASTNode";
import {Param} from "./Param";

/**
 * A list of parameters for a component.
 *
 * ex: Given the following component definition, the parameters would be `n`, `h`, `s`
 *
 * `BUTTON button:
 *  width = n
 *  height= h
 *  text= s
 *  color ="gray"`
 */
export class ParamList extends ASTNode {

    private _params: Param[];
    constructor(params: Param[]) {
        super();
        this._params = params;
    }

    get params(): Param[] {
        return this._params;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitParamList(this, t);
    }
}
