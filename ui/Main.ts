import UILexer from "../gen/UILexer";
import {CharStreams, CommonTokenStream, TokenStream} from "antlr4";
import * as fs from "fs";
import DefinitionParser from "../gen/DefinitionParser";
import ViewParser from "../gen/ViewParser";
import {ParseToDefinitionASTVisitor} from "../parser/ParseToDefinitionASTVisitor";
import {ParseToViewASTVisitor} from "../parser/ParseToViewASTVisitor";
import { ViewEvaluator, DefinitionEvaluator, MainProgramEvaluator } from "../evaluator";
import { DefProgram, ViewProgram, MainProgram } from "../ast";
import { PropertyChecker, DefChecker, FunctionChecker, VariableChecker } from "../checkers";
import {StringWriter} from "../utils/StringWriter";

const INPUT_FOLDER = "./ui/input/";

/**
 * Main class that executes the program
 * (still need to figure this out)
 */
const main = () => {
    console.log("\n______ Reading files... ______");
    const fileNames: string[] = fs.readdirSync(INPUT_FOLDER);
    // Reading Def
    const defFile = fileNames.find(fn => fn.endsWith(".def"));
    if (!defFile) {
        console.error("No definition file (.def) provided.");
        return;
    }
    const defContent = fs.readFileSync(INPUT_FOLDER + defFile, {encoding: 'utf-8', flag: 'r'})

    // Reading Views
    // the array of view names (eg. Main.view => Main)
    const viewNames: string[] = fileNames
        .filter(fn => fn.endsWith(".view"))
        .map(fn => fn.slice(0, -5));
    if (viewNames.length < 1) {
        console.error("No view file (.view) provided.");
        return;
    }
    const viewContents: string[] = [];
    for (const viewName of viewNames) {
        const path = INPUT_FOLDER + viewName + ".view";
        viewContents.push(fs.readFileSync(path, {encoding: 'utf-8', flag: 'r'}));
    }
    console.log("______ Done reading files ______\n");

    console.log("\n______ Tokenizing... ______");
    // Tokenizing def files
    const defLexer: UILexer = new UILexer(CharStreams.fromString(defContent));
    defLexer.reset();
    const defToken = new CommonTokenStream(defLexer);

    // Tokenizing view files
    const viewTokens: CommonTokenStream[] = [];
    for (const content of viewContents) {
        const lexer: UILexer = new UILexer(CharStreams.fromString(content));
        lexer.reset();
        viewTokens.push(new CommonTokenStream(lexer));
    }
    console.log("______ Done tokenizing ______\n");

    console.log("\n______ Parsing... ______");
    // Parsing Definition
    const defParser = new DefinitionParser(defToken);
    const defVisitor = new ParseToDefinitionASTVisitor();
    const defProgram = defVisitor.visitDef_program(defParser.def_program());
    if (!defProgram) throw new Error('Definition Program failed to parse');

    // Parsing Views
    const viewPrograms: ViewProgram[] = [];
    viewTokens.forEach((tokens, i) => {
        const viewName = viewNames[i]; // Assumes view file order is the same
        const viewParser = new ViewParser(tokens);
        const viewVisitor = new ParseToViewASTVisitor(viewName);
        const viewProgram = viewVisitor.visitView_program(viewParser.view_program());
        if (!viewProgram) throw new Error(`View Program ${viewName} failed to parse.`)
        viewPrograms.push(viewProgram);
    });

    const mainProgram = new MainProgram(defProgram, viewPrograms);
    console.log("______ Done parsing ______\n");

    console.log("\n______ Static checking... ______");
    const variableChecker: VariableChecker = new VariableChecker();
    let errors = variableChecker.checkProgram(mainProgram);
    if (errors != "") {
        console.error(errors);
        return;
    }
    const defChecker: DefChecker = new DefChecker();
    errors = defChecker.checkProgram(mainProgram);
    if (errors != "") {
        console.error(errors);
        return;
    }
    const functionChecker: FunctionChecker = new FunctionChecker();
    errors = functionChecker.checkProgram(mainProgram);
    if (errors != "") {
        console.error(errors);
        return;
    }
    const propertyChecker: PropertyChecker = new PropertyChecker();
    const errWriter = new StringWriter();
    defProgram.accept(propertyChecker, errWriter);
    errWriter.end();
    errors = errWriter.toString();
    if (errors != "") {
        console.log(errors);
        return;
    }
    console.log("______ Done static checking ______\n");

    console.log("\n______ Evaluating... ______");
    const output = "./ui/output/App.jsx";
    const fileStream = fs.createWriteStream(output);
    const defEvaluator = new DefinitionEvaluator();
    const viewEvaluator = new ViewEvaluator();
    const mainEvaluator = new MainProgramEvaluator(defEvaluator, viewEvaluator);

    try {
        mainProgram.accept(mainEvaluator, fileStream);
    } catch (error: any) {
        console.error(error.message);
        return;
    }

    // something like this?
    // const mainEvaluator = ...
    // parsedProgram.accept(mainEvaluator, fileStream);

    fileStream.end();
    console.log("______ Done evaluating ______\n");
}

main();

