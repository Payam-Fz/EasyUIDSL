import UILexer from "../../gen/UILexer";
import { CharStream } from "antlr4";


type LexerTest = {
    description: string;
    inputText: string;
    expectedTokens: string[];
};

const componentTests: LexerTest[] = [
    {
        description: "BUTTON component with params",
        inputText: `BUTTON HomeButton:
        \tcolor = c
        \twidth = 100
        \theight = n
        \ttext = "Home"
        \tonclick = open(Main.view)`,
        expectedTokens: [
            'BUTTON', 'HomeButton', ':', '\n', '\t', 'color',
            '=', 'c', '\n', '\t', 'width', '=', '100', '\n', '\t', 'height', '=', 'n', '\n', '\t', 'text', '=', 
            '"Home"', '\n', '\t', 'onclick', '=', 'open', '(', 'Main', '.', 'view', ')'
        ],
    },
    {
        description: "BUTTON component with TEXT param",
        inputText: `BUTTON Button:
            \ttext = obj
            \tonclick = set(obj.text, obj.text + 1)`,
        expectedTokens: [
            'BUTTON', 'Button', ':', '\n', '\t', 'text', '=', 'obj', '\n',
            '\t', 'onclick', '=', 'set', '(', 'obj', '.', 'text', ',', 'obj', '.', 'text', '+', '1', ')'
        ],
    },
    {
        description: "BUTTON component with no params",
        inputText: `BUTTON HomeButton:
            \tcolor = "gray"
            \twidth = 100
            \theight = 50
            \ttext = "Home"
            \tonclick = open(Main.view)`,
        expectedTokens: [
            'BUTTON', 'HomeButton', ':',  '\n', '\t',
            'color', '=', '"gray"',  '\n', '\t', 'width', '=', '100',  '\n', '\t',
            'height', '=', '50',  '\n', '\t', 'text', '=',
            '"Home"', '\n', '\t','onclick', '=', 'open', '(', 'Main', '.', 'view', ')'
        ],
    },
    {
        description: "TEXT component with params",
        inputText:`TEXT Text:
            \ttext = t
            \tfontsize = n`,
        expectedTokens: [
            'TEXT', 'Text', ':', '\n', '\t', 'text',
            '=', 't', '\n', '\t', 'fontsize', '=', 'n'
        ],
    },
    {
        description: "TEXT component with no params",
        inputText: `TEXT Text:
            \ttext = "hello world"
            \tcolor = "black"
            \tfontsize = 12
            \tfontstyle = "bold"`,
        expectedTokens: [
            'TEXT', 'Text',':', '\n', '\t', 'text', '=', '"hello world"', '\n', '\t',
            'color', '=', '"black"', '\n', '\t', 'fontsize', '=', '12', '\n', '\t', 'fontstyle', '=', '"bold"'
        ],
    },
    {
        description: "PICTURE component with no params",
        inputText: `PICTURE Picture:
            \turl = "https://randomsource.com"
            \twidth = 100
            \theight = 100`,
        expectedTokens: [
            'PICTURE', 'Picture', ':', '\n', '\t', 'url', '=', '"https://randomsource.com"', '\n', '\t', 'width', '=', '100', '\n', '\t', 'height', '=', '100'
        ],
    },
    {
        description: "PICTURE component with params",
        inputText: `PICTURE Picture:
            \turl = u
            \talt = "picture of mountains"
            \twidth = w
            \theight = h
            \tvisible = v`,
        expectedTokens: [
            'PICTURE', 'Picture', ':', '\n', '\t', 'url', '=', 'u', '\n', '\t', 'alt', '=', '"picture of mountains"', '\n', '\t', 'width', '=', 'w', '\n', '\t', 'height', '=', 'h', '\n', '\t', 'visible', '=', 'v'
        ],
    },
    {
        description: "CHECKBOX component with STRING param",
        inputText: `CHECKBOX CheckBox:
            \tchecked = false
            \ttext = s`,
        expectedTokens: [
            'CHECKBOX', 'CheckBox', ':', '\n', '\t', 'checked', '=', 'false',
            '\n', '\t', 'text', '=', 's'
        ],
    },
    {
        description: "CHECKBOX component with TEXT param",
        inputText: `CHECKBOX CheckBox:
            \tchecked = false
            \ttext = obj`,
        expectedTokens: [
            'CHECKBOX', 'CheckBox', ':', '\n', '\t', 'checked', '=', 'false', '\n', '\t', 'text', '=', 'obj'
        ],
    },
    {
        description: "CHECKBOX component with no param",
        inputText: `CHECKBOX CheckBox:
            \tchecked = true`,
        expectedTokens: [
            'CHECKBOX', 'CheckBox', ':', '\n', '\t', 'checked', '=', 'true'
        ],
    },
    {
        description: "CONTAINER component with no param",
        inputText: `CONTAINER NavBar:
            \twidth = 200
            \theight = 50
            \tborderstyle = "solid"
            \tbordercolor = "black"
            \tborderwidth = 1
            \tdirection = "row"
            \talignment = "center"`,
        expectedTokens: [
            'CONTAINER', 'NavBar', ':', '\n', '\t',
            'width', '=', '200', '\n', '\t', 'height', '=', '50', '\n', '\t', 'borderstyle', '=', '"solid"',
            '\n', '\t',  'bordercolor', '=', '"black"', '\n', '\t', 'borderwidth', '=', '1',  '\n', '\t',
            'direction', '=', '"row"', '\n', '\t', 'alignment', '=', '"center"'
        ],
    },
    {
        description: "CONTAINER component with params",
        inputText: `CONTAINER Container:
            \twidth = n
            \theight = 200
            \tbordercolor = s
            \tdirection = "row"`,
        expectedTokens: [
            'CONTAINER', 'Container', ':', '\n', '\t',
            'width', '=', 'n', '\n', '\t', 'height', '=', '200', '\n', '\t', 'bordercolor', '=', 's', '\n', '\t',
            'direction', '=', '"row"'
        ],
    },
    {
        description: "TEXTINPUT component with no param",
        inputText: `TEXTINPUT Input:
            \twidth = 100
            \theight = 25`,
        expectedTokens: [
            'TEXTINPUT', 'Input', ':', '\n', '\t', 'width', '=', '100', '\n', '\t', 'height', '=', '25'
        ],
    },
    {
        description: "TEXTINPUT component with params",
        inputText: `TEXTINPUT Input:
            \twidth = w
            \theight = h`,
        expectedTokens: [
            'TEXTINPUT', 'Input', ':', '\n', '\t', 'width', '=', 'w',
            '\n', '\t', 'height', '=', 'h'
        ],
    },
    {
        description: "should be space invariant",
        inputText: `BUTTON      Button  :
            \twidth = n
            \theight=n
            \ttext= s
            \tcolor ="gray"`,
        expectedTokens: [
            'BUTTON', 'Button', ':', '\n', '\t', 'width', '=', 'n',
            '\n', '\t', 'height', '=', 'n', '\n', '\t', 'text', '=', 's', '\n', '\t', 'color', '=', '"gray"'
        ],
    },

    {
        description: "should handle instantion",
        inputText: `BUTTON Button:
            \twidth = n
            \theight=n
            \ttext= s
            \tcolor ="gray"
            
            Button WITH n=100, s="hello" AS b1`,
        expectedTokens: [
            'BUTTON', 'Button', ':', '\n', '\t', 'width', '=', 'n',
            '\n', '\t', 'height', '=', 'n', '\n', '\t', 'text', '=', 's', '\n', '\t', 'color', '=', '"gray"',
            '\n', '\n', 'Button', 'WITH', 'n', '=', '100', ',', 's', '=', '"hello"', 'AS', 'b1'
        ],
    },

    {
        description: "should handle multiline list",
        inputText: `BUTTON Button:
            \twidth = n
            \theight=n
            \ttext= s
            \tcolor ="gray"
            \tonclick = [
                set(o.text, 'Wow'),
                set(o.width, 100)
            ]
            
            Button WITH n=100, s="hello", obj=o AS b1`,
        expectedTokens: [
            'BUTTON', 'Button', ':', '\n', '\t', 'width', '=', 'n',
            '\n', '\t', 'height', '=', 'n', '\n', '\t', 'text', '=', 's', '\n', '\t', 'color', '=', '"gray"',
            '\n', '\t', 'onclick', '=', '[', '\n', 'set', '(', 'o', '.', 'text', ',', '\'Wow\'', ')', ',', '\n', 'set', '(', 'o', '.', 'width', ',',
            '100', ')', '\n', ']',
            '\n', '\n', 'Button', 'WITH', 'n', '=', '100', ',', 's', '=', '"hello"', ',', 'obj', '=', 'o', 'AS', 'b1'
        ],
    },
];

const viewTests: LexerTest[] = [
    {
        description: "basic render",
        inputText: `Text WITH param1="hello world"`,
        expectedTokens: [
            'Text', 'WITH', 'param1', '=', '"hello world"'
        ]
    },

    {
        description: "parses simple component instantiations",
        inputText: `bigText
        Button WITH w=200, h=10
        likeButtonText`,
        expectedTokens: [
            'bigText', '\n', 'Button', 'WITH', 'w', '=', '200', ',', 'h', '=', '10',
            '\n', 'likeButtonText'
        ],
    },
    {
        description: "parses components and container",
        inputText: `DynamicPicture WITH url="https://randomsource.com"
        Container WITH components=[dp, changePictureButton]
        Text WITH t="Change picture dimensions"`
        ,
        expectedTokens: [
            'DynamicPicture', 'WITH', 'url', '=', '"https://randomsource.com"',
            '\n', 'Container', 'WITH', 'components', '=', '[', 'dp', ',', 'changePictureButton', ']',
            '\n', 'Text', 'WITH', 't', '=', '"Change picture dimensions"'
        ],
    },
    {
        description: "should be space invariant",
        inputText: `Text    WITH   u="Like"


         Container WITH components=[likeButtonText]`,
        expectedTokens: [
            'Text', '\t', 'WITH', 'u', '=', '"Like"', '\n', '\n', '\n',
            'Container', 'WITH', '\t', 'components', '=', '[', 'likeButtonText', ']'
        ],
    },
];

describe("component.def lexer token outputs", () => {
    it.each(componentTests)("$description", ({ inputText, expectedTokens }) => {

        const charStream = new CharStream(inputText);
        const lexer = new UILexer(charStream);
        const tokens = lexer.getAllTokens();

        // expect(tokens.length).toBe(expectedTokens.length);
        tokens.forEach((token, i) => {
            expect(inputText.substring(token.start, token.stop + 1)).toBe(expectedTokens[i])
        });
    });
});

describe("view lexer token outputs", () => {
    it.each(viewTests)("$description", ({ inputText, expectedTokens }) => {
        const charStream = new CharStream(inputText);
        const lexer = new UILexer(charStream);
        const tokens = lexer.getAllTokens();

        expect(tokens.length).toBe(expectedTokens.length);
        tokens.forEach((token, i) => {
            // console.log(inputText.substring(token.start, token.stop + 1));
            expect(inputText.substring(token.start, token.stop + 1)).toBe(expectedTokens[i]);
        });
    });
});

