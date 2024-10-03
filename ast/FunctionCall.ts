import { Visitor } from "../visitor";
import { ListValue } from "./ListValue";
import { Value } from "./Value";

export enum FunctionEnum {
    Invalid,
    Set,
    Open
}

/**
 * A call to a function, which consists of the name of the function that is called and
 * the arguments that are passed in.
 */
export class FunctionCall extends ListValue {
    private _type: FunctionEnum;
    private _arguments: Value[];

    constructor(name: String, args: Value[]) {
        super();
        let funcName = FunctionEnum.Invalid;
        switch (name) {
            case 'set':
                funcName = FunctionEnum.Set;
                break;
            case 'open':
                funcName = FunctionEnum.Open;
                break;
            default:
        }
        this._type = funcName;
        this._arguments = args;
    }
    
    get type(): FunctionEnum {
        return this._type;
    }

    get args(): Value[] {
        return this._arguments;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitFunctionCall(this, t);
    }
}