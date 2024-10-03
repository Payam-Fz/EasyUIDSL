import { Visitor } from "../visitor";
import { ASTNode } from "./ASTNode";

export enum OperationEnum {
    Invalid,
    Addition,
    Subtraction,
    Multiplication,
    Division
}

/**
 * An addition, subtraction, multiplication, or division operation
 */
export class ArithOperation extends ASTNode {

    private _type: OperationEnum;
    private _symbol: string;
    constructor(opSymbol: string) {
        super();
        this._symbol = opSymbol;
        let type = OperationEnum.Invalid;
        switch (opSymbol) {
            case '+':
                type = OperationEnum.Addition;
                break;
            case '-':
                type = OperationEnum.Subtraction;
                break;
            case '*':
                type = OperationEnum.Multiplication;
                break;
            case '/':
                type = OperationEnum.Division;
                break;
            default:
        }
        this._type = type;
    }

    get type(): OperationEnum {
        return this._type;
    }

    get symbol(): string {
        return this._symbol;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitArithOperation(this, t);
    }
}
