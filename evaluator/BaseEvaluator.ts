import {BaseVisitor} from "../visitor";
import {Writable} from "stream";
import {
    ArithExpression,
    ArithOperation,
    BooleanConstant, ComponentInstantiation,
    List, NamedArgument,
    NumberConstant,
    OperationEnum,
    StringConstant,
    Variable
} from "../ast";

// This class implements the methods which are similar between DefEvaluator and ViewEvaluator
export abstract class BaseEvaluator extends BaseVisitor<Writable, void> {

    visitComponentInstantiation(componentInstantiation: ComponentInstantiation, t: Writable): void {
        if (componentInstantiation.argumentList == null) {
            t.write("{" + componentInstantiation.componentName + "}");
        } else {
            t.write("<" + componentInstantiation.componentName + " ");
            componentInstantiation.argumentList.forEach(argument => {
                argument.accept(this, t);
            });
            t.write(" />");
        }
    }

    visitNamedArgument(namedArg: NamedArgument, t: Writable): void {
        t.write(namedArg.parameterName + "={");
        namedArg.argumentValue.accept(this, t);
        t.write("}");
    }

    visitStringConstant(stringConstant: StringConstant, t: Writable): void {
        t.write("\"" + stringConstant.value + "\"");
    }

    visitNumberConstant(numberConstant: NumberConstant, t: Writable): void {
        t.write(numberConstant.value.toString());
    }

    visitBooleanConstant(booleanConstant: BooleanConstant, t: Writable): void {
        t.write(booleanConstant.value ? "true" : "false");
    }

    visitVariable(variable: Variable, t: Writable): void {
        t.write(variable.name);
    }

    visitArithExpression(arithExpression: ArithExpression, t: Writable): void {
        const terms = arithExpression.terms;
        const ops = arithExpression.operations;
        const maxLength = Math.max(terms.length, ops.length);

        // for (let i = 0; i < terms.length; i++) {
        //     if (! (terms[i] instanceof NumberConstant)) {
        //         throw new Error("Not number Constant error");
        //     }
        // }

        for (let i = 0; i < ops.length; i++) {
            if (ops[i].type === OperationEnum.Division) {
                // Assuming terms[i + 1] is the divisor
                const divisor = terms[i + 1]
                if (divisor instanceof NumberConstant && divisor.value === 0 ) {
                    throw new Error("Division by zero error");
                }
            }
        }
        for (let i = 0; i < maxLength; i++) {
            if (i < terms.length) {
                terms[i].accept(this, t);
            }
            if (i < ops.length) {
                ops[i].accept(this, t);
            }
        }
    }

    visitArithOperation(arithOperation: ArithOperation, t: Writable): void {
        t.write(arithOperation.symbol);
    }

    visitList(list: List, t: Writable): void {
        t.write("[");
        list.values.forEach((v, i) => {
            v.accept(this, t);
            if (i < list.values.length - 1) {
                t.write(", ");
            }
        });
        t.write("]");
    }
}