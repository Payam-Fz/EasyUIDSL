import {Writable} from "stream";
import {Variable, ViewProgram} from "../ast";
import {BaseEvaluator} from "./BaseEvaluator";

export class ViewEvaluator extends BaseEvaluator {

    visitViewProgram(viewProgram: ViewProgram, t: Writable): void {
        t.write(
            "\tconst " + viewProgram.fileName + "Page = () => (\n" +
         "\t\t<div style={style}>\n"
        );
        viewProgram.componentUsages.forEach(componentUsage => {
            t.write("\t\t\t");
            if (componentUsage instanceof Variable) {
                t.write("{");
                componentUsage.accept(this, t);
                t.write("}\n");
            } else {
                componentUsage.accept(this, t);
                t.write("\n");
            }
        });
        t.write(
            "\t\t</div>\n" +
            "\t);\n"
        );
    }
}