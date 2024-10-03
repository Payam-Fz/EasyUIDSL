import { Visitor } from "../visitor";
import { Variable } from "./Variable";

/**
 * A parameter represented by a name.
 * 
 * Note: Parameters exist only in the context of `ComponentDefinition`s.
 */
export class Param extends Variable {

    constructor(name: string) {
        super(name);
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitParam(this, t);
    }
}