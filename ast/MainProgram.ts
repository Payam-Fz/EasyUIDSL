import { ASTNode } from "./ASTNode";
import { Visitor } from "../visitor";
import { DefProgram } from "./DefProgram";
import { ViewProgram } from "./ViewProgram";

export class MainProgram extends ASTNode {
    private _definition: DefProgram;
    private _views: ViewProgram[];

    constructor(def: DefProgram, views: ViewProgram[]) {
        super();
        this._definition = def;
        this._views = views;
    }

    get definition() {
        return this._definition;
    }

    get views() {
        return this._views;
    }

    accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitMainProgram(this, t);
    }
}
