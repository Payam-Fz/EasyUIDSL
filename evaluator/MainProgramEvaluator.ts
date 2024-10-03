import {DefinitionEvaluator} from "./DefinitionEvaluator";
import {ViewEvaluator} from "./ViewEvaluator";
import {MainProgram} from "../ast";
import {Writable} from "stream";
import {BaseEvaluator} from "./BaseEvaluator";

export class MainProgramEvaluator extends BaseEvaluator {

    private _defEval: DefinitionEvaluator;
    private _viewEval: ViewEvaluator;

    constructor(defEval: DefinitionEvaluator, viewEval: ViewEvaluator) {
        super();
        this._defEval = defEval;
        this._viewEval = viewEval;
    }

    visitMainProgram(mainProgram: MainProgram, t: Writable): void {
        t.write("const {useState} = React;\n\n");
        t.write("const style = {\n" +
            "\twidth: \"100%\",\n" +
            "\theight: \"100%\",\n" +
            "\tdisplay: \"grid\",\n" +
            "\tjustifyItems: \"center\",\n" +
            "\talignItems: \"center\",\n" +
            "\tgap: \"10px\",\n" +
            "\tpadding: \"10px\",\n" +
            "};\n\n");
        t.write("const App = () => {\n");

        t.write("\t//--------------------- DEFINITIONS ---------------------//\n");
        mainProgram.definition.accept(this._defEval, t);

        t.write("\t//------------------------ VIEWS ------------------------//\n");
        mainProgram.views.forEach(v => v.accept(this._viewEval, t));

        t.write("\n\treturn (\n" +
            "\t\t<div>\n" +
            "\t\t\t{\n");

        mainProgram.views.filter(view => view.fileName !== "Main").forEach(view => {
            t.write("\t\t\t\tcurrentView === \"" + view.fileName + "\" ? (<" + view.fileName + "Page />) :\n");
        });

        t.write("\t\t\t\t<MainPage />\n" +
            "\t\t\t}\n" +
            "\t\t</div>\n" +
            "\t);\n" +
            "};\n");

        t.write("ReactDOM.render(<App />, document.getElementById(\"root\"));\n");
    }
}