import { Visitor } from "../visitor";

export abstract class ASTNode {
    abstract accept<T, U>(v: Visitor<T, U>, t: T): U;
}
