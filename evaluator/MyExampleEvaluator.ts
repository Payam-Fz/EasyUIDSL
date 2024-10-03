import { DefProgram } from "../ast";
import { ViewProgram } from "../ast";
import { BaseVisitor } from "../visitor";

class ExampleVariableMap {
    // Some implementation
}

class MyExampleEvaluator extends BaseVisitor<ExampleVariableMap, void> {
    visitDefProgram(defProgram: DefProgram, t: ExampleVariableMap): void {
        defProgram.accept(this, t);
    }

    visitViewProgram(viewProgram: ViewProgram, t: ExampleVariableMap): void {
        viewProgram.accept(this, t);
    }

    // Override methods wherever necessary
}
