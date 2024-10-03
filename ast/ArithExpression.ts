import { Value } from "./Value";
import { ArithOperation } from "./ArithOperation";
import { Visitor } from "../visitor";

/**
 * An arithmetic expression. The expression can contain variables or constants.
 * 
 * This assumes that the expressions are not nested, rather are linear as per grammar.
 * e.g. 2 + 3 / 4 - 6 + 7
 * 
 * ex: `obj.width + 40`
 * 
 * ex: `pic.height / 100 + obj.width`
 *
 * order of operations
 */
export class ArithExpression extends Value {

    private _terms: Value[];
    private _operations: ArithOperation[];

    constructor(terms: Value[], operations: ArithOperation[]) {
        super();
        this._terms = terms;
        this._operations = operations;
    }

    get terms(): Value[] {
        return this._terms;
    }

    get operations(): ArithOperation[] {
        return this._operations;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitArithExpression(this, t);
    }
}
