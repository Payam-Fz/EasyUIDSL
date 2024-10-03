import UILexer from "../../gen/UILexer";
import {CharStreams, CommonTokenStream} from "antlr4";
import DefinitionParser from "../../gen/DefinitionParser";
import {ParseToDefinitionASTVisitor} from "../../parser/ParseToDefinitionASTVisitor";
import {DefProgram, NumberConstant} from "../../ast";
import {DefinitionEvaluator} from "../../evaluator/DefinitionEvaluator";
import { Writable } from "stream";
import {StringWriter} from "../../utils/StringWriter";


const getDefProgramAst = (input: string): DefProgram => {
    // Tokenization
    const lexer: UILexer = new UILexer(CharStreams.fromString(input));
    lexer.reset();
    const tokens = new CommonTokenStream(lexer);

    // Parsing
    const defParser = new DefinitionParser(tokens);
    const defVisitor = new ParseToDefinitionASTVisitor();
    return defVisitor.visitDef_program(defParser.def_program());
}

describe("ASTToDefinitionEvaluator", () => {
    describe("evaluateComponentDefinition", () => {
        describe("evaluateButtonDefinitionWithOpenFunction", () => {
            it("evaluates a ComponentDefinition for a view button", () => {
                const input: string =
                    `BUTTON HomeButton:
                    \tcolor = 'white'
                    \tbackgroundcolor = 'gray'
                    \twidth = 100
                    \theight = 50
                    \ttext = 'Home'
                    \tonclick = open(Main.view)
                    
                    BUTTON AboutButton:
                    \tcolor = 'white'
                    \tbackgroundcolor = 'gray'
                    \twidth = 100
                    \theight = 50
                    \ttext = 'About'
                    \tonclick = open(About.view)
                    `;

                const expectedOutput: string =
`\tconst [currentView, setCurrentView] = useState("Main");

\tconst HomeButton = ({}) => (
\t\t<button
\t\t\tstyle = {{
\t\t\t\tcursor: "pointer",
\t\t\t\tcolor: "white",
\t\t\t\tbackgroundColor: "gray",
\t\t\t\twidth: 100,
\t\t\t\theight: 50,
\t\t\t}}
\t\t\tonClick = {() => {setCurrentView("Main");}}
\t\t>
\t\t\t{"Home"}
\t\t</button>
\t);
\tconst AboutButton = ({}) => (
\t\t<button
\t\t\tstyle = {{
\t\t\t\tcursor: "pointer",
\t\t\t\tcolor: "white",
\t\t\t\tbackgroundColor: "gray",
\t\t\t\twidth: 100,
\t\t\t\theight: 50,
\t\t\t}}
\t\t\tonClick = {() => {setCurrentView("About");}}
\t\t>
\t\t\t{"About"}
\t\t</button>
\t);


`;

                const defAST = getDefProgramAst(input);
                const defEvaluator = new DefinitionEvaluator();
                const stringWriter: Writable = new StringWriter();
                defAST.accept(defEvaluator, stringWriter);
                stringWriter.end();
                const output = stringWriter.toString();
                expect(output).toBe(expectedOutput);
            });
        });

        describe("evaluateButtonDefinitionWithSetFunction", () => {
            it("evaluates a ComponentDefinition for a set button", () => {
                const input: string =
                    `BUTTON MyButton:
                    \tcolor = 'white'
                    \tbackgroundcolor = 'gray'
                    \twidth = 75
                    \theight = 25
                    \ttext = t
                    \tonclick = [set(MyPicture.width, MyPicture.width+10), set(MyPicture.height, MyPicture.height+10)]
                    
                    PICTURE MyPicture:
                    \turl = s
                    \talt = 'Description'
                    \twidth = 200
                    \theight = 200
                    `;

                const expectedOutput: string =
`\tconst [currentView, setCurrentView] = useState("Main");
\tconst [myPictureWidth, setMyPictureWidth] = useState(200);
\tconst [myPictureHeight, setMyPictureHeight] = useState(200);

\tconst MyButton = ({t}) => (
\t\t<button
\t\t\tstyle = {{
\t\t\t\tcursor: "pointer",
\t\t\t\tcolor: "white",
\t\t\t\tbackgroundColor: "gray",
\t\t\t\twidth: 75,
\t\t\t\theight: 25,
\t\t\t}}
\t\t\tonClick = {() => {
\t\t\t\tsetMyPictureWidth(myPictureWidth+10);
\t\t\t\tsetMyPictureHeight(myPictureHeight+10);
\t\t\t}}
\t\t>
\t\t\t{t}
\t\t</button>
\t);
\tconst MyPicture = ({s}) => (
\t\t<img
\t\t\tstyle = {{
\t\t\t\twidth: myPictureWidth,
\t\t\t\theight: myPictureHeight,
\t\t\t}}
\t\t\tsrc = {s}
\t\t\talt = {"Description"}
\t\t>
\t\t</img>
\t);


`;

                const defAST = getDefProgramAst(input);
                const pictureWidth = defAST.componentDefinitions[1].propertyAssignList[2];
                expect(pictureWidth.property.name).toBe("width");
                expect(pictureWidth.value).toBeInstanceOf(NumberConstant);
                const defEvaluator = new DefinitionEvaluator();
                const stringWriter: Writable = new StringWriter();
                defAST.accept(defEvaluator, stringWriter);
                stringWriter.end();
                const output = stringWriter.toString();
                expect(output).toBe(expectedOutput);
                // Make sure the AST is not modified
                expect(pictureWidth.value).toBeInstanceOf(NumberConstant);
            });
        });
        describe("evaluateContainerDefinition", () => {
            it("evaluates a ComponentDefinition for a view button", () => {
                const input: string =
                    `CONTAINER NavBar:
                    \twidth = 200
                    \theight = 50
                    \tborderstyle = 'solid'
                    \tbordercolor = 'black'
                    \tborderwidth = 1
                    \tdirection = 'row'
                    `;

                const expectedOutput: string =
                    `\tconst [currentView, setCurrentView] = useState("Main");

\tconst NavBar = ({components}) => (
\t\t<div
\t\t\tstyle = {{
\t\t\t\tdisplay: "grid",
\t\t\t\tjustifyItems: "center",
\t\t\t\talignItems: "center",
\t\t\t\tgap: "10px",
\t\t\t\tpadding: "10px",
\t\t\t\twidth: 200,
\t\t\t\theight: 50,
\t\t\t\tborderStyle: "solid",
\t\t\t\tborderColor: "black",
\t\t\t\tborderWidth: 1,
\t\t\t\tgridAutoFlow: "column",
\t\t\t}}
\t\t>
\t\t\t{components}
\t\t</div>
\t);


`;

                const defAST = getDefProgramAst(input);
                const defEvaluator = new DefinitionEvaluator();
                const stringWriter: Writable = new StringWriter();
                defAST.accept(defEvaluator, stringWriter);
                stringWriter.end();
                const output = stringWriter.toString();
                expect(output).toBe(expectedOutput);
            });
        });
    });

    describe("evaluateVariableDefinition", () => {
        describe("evaluateVariableDefinitionForText", () => {
            it("evaluates a VariableDefinition for a Text component", () => {
                const input: string =
                    `TEXT MyText:
                    \ttext = t
                    \tcolor = 'black'
                    \tfontsize = 12
                    \tfontstyle = 'bold'
                    
                    MyText WITH t="Change picture dimensions" AS changePictureButtonText
                    `;

                const expectedOutput: string =
                    `\tconst [currentView, setCurrentView] = useState("Main");

\tconst MyText = ({t}) => (
\t\t<p
\t\t\tstyle = {{
\t\t\t\tcolor: "black",
\t\t\t\tfontSize: 12,
\t\t\t\tfontWeight: "bold",
\t\t\t}}
\t\t>
\t\t\t{t}
\t\t</p>
\t);

\tconst changePictureButtonText = <MyText t={"Change picture dimensions"} />;

`;

                const defAST = getDefProgramAst(input);
                const defEvaluator = new DefinitionEvaluator();
                const stringWriter: Writable = new StringWriter();
                defAST.accept(defEvaluator, stringWriter);
                stringWriter.end();
                const output = stringWriter.toString();
                expect(output).toBe(expectedOutput);
            });
        });
        describe("evaluateVariableDefinitionForContainer", () => {
            it("evaluates a VariableDefinition for a Navbar component", () => {
                const input: string =
                    `BUTTON HomeButton:
                    \tcolor = 'white'
                    \tbackgroundcolor = 'gray'
                    \twidth = 100
                    \theight = 50
                    \ttext = 'Home'
                    \tonclick = open(Main.view)
                    
                    BUTTON AboutButton:
                    \tcolor = 'white'
                    \tbackgroundcolor = 'gray'
                    \twidth = 100
                    \theight = 50
                    \ttext = 'About'
                    \tonclick = open(About.view)
                    
                    CONTAINER NavBar:
                    \twidth = 200
                    \theight = 50
                    \tborderstyle = 'solid'
                    \tbordercolor = 'black'
                    \tborderwidth = 1
                    \tdirection = 'row'
                    
                    HomeButton AS hb
                    AboutButton AS ab
                    NavBar WITH components=[hb, ab] AS nb
                    `;

                const expectedOutput: string =
                    `\tconst [currentView, setCurrentView] = useState("Main");

\tconst HomeButton = ({}) => (
\t\t<button
\t\t\tstyle = {{
\t\t\t\tcursor: "pointer",
\t\t\t\tcolor: "white",
\t\t\t\tbackgroundColor: "gray",
\t\t\t\twidth: 100,
\t\t\t\theight: 50,
\t\t\t}}
\t\t\tonClick = {() => {setCurrentView("Main");}}
\t\t>
\t\t\t{"Home"}
\t\t</button>
\t);
\tconst AboutButton = ({}) => (
\t\t<button
\t\t\tstyle = {{
\t\t\t\tcursor: "pointer",
\t\t\t\tcolor: "white",
\t\t\t\tbackgroundColor: "gray",
\t\t\t\twidth: 100,
\t\t\t\theight: 50,
\t\t\t}}
\t\t\tonClick = {() => {setCurrentView("About");}}
\t\t>
\t\t\t{"About"}
\t\t</button>
\t);
\tconst NavBar = ({components}) => (
\t\t<div
\t\t\tstyle = {{
\t\t\t\tdisplay: "grid",
\t\t\t\tjustifyItems: "center",
\t\t\t\talignItems: "center",
\t\t\t\tgap: "10px",
\t\t\t\tpadding: "10px",
\t\t\t\twidth: 200,
\t\t\t\theight: 50,
\t\t\t\tborderStyle: "solid",
\t\t\t\tborderColor: "black",
\t\t\t\tborderWidth: 1,
\t\t\t\tgridAutoFlow: "column",
\t\t\t}}
\t\t>
\t\t\t{components}
\t\t</div>
\t);

\tconst hb = <HomeButton  />;
\tconst ab = <AboutButton  />;
\tconst nb = <NavBar components={[hb, ab]} />;

`;

                const defAST = getDefProgramAst(input);
                const defEvaluator = new DefinitionEvaluator();
                const stringWriter: Writable = new StringWriter();
                defAST.accept(defEvaluator, stringWriter);
                stringWriter.end();
                const output = stringWriter.toString();
                expect(output).toBe(expectedOutput);
            });
        });


    });

});