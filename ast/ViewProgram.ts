import { Visitor } from "../visitor";
import {ComponentUsage, ASTNode } from "./";

/**
 * Represents a full .view file
 */
export class ViewProgram extends ASTNode {
    private _componentUsages: ComponentUsage[];
    private _fileName: string;

    constructor(fileName: string, componentInstantiations: ComponentUsage[]) {
        super();
        this._fileName = fileName;
        this._componentUsages = componentInstantiations;
    }
    get fileName() {
        return this._fileName
    }
    get componentUsages() {
        return this._componentUsages;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitViewProgram(this, t);
    }
}
