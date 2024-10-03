import { Visitor } from "../visitor";
import { Constant } from "./Constant";

/**
 * A constant string value wrapped in quotes
 */
export class StringConstant extends Constant {
    private _string: string;

    constructor(str: string) {
        super();
        this._string = this.trimQuotes(str);
    }

    private trimQuotes(str: string) {
        if (/^('|")[^'"]*('|")$/.test(str)) {
            return str.slice(1, -1);
        }
        return str;
    }

    get value(): string {
        return this._string;
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitStringConstant(this, t);
    }
}
