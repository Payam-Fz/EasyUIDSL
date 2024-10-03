import { CharStream, CommonTokenStream } from "antlr4";
import UILexer from "../../gen/UILexer";
import { ArithExpression, BooleanConstant, ComponentEnum, FunctionCall, FunctionEnum, List, NumberConstant, OperationEnum, Param, StringConstant, Variable } from "../../ast";
import { ParseToDefinitionASTVisitor } from "../../parser/ParseToDefinitionASTVisitor";
import DefinitionParser, { Func_argContext, FunctionContext, ListContext, Property_assignContext } from "../../gen/DefinitionParser";
import { DefExamples } from "../examples/test-examples/def-examples";
import { ViewReference } from "../../ast/ViewReference";
import { ObjectPropertyValue } from "../../ast/ObjectPropertyValue";


describe("ParseToDefinitionASTVisitor", () => {
    let defParser: ParseToDefinitionASTVisitor;

    beforeEach(() => {
        defParser = new ParseToDefinitionASTVisitor();
    });

    describe("visitDef_program", () => {
        it("parses a def program for DefProgram_nav", () => {
            const defProgram_ctx = getDefProgramCtxFromInput(DefExamples.DefProgram_nav);
            const defProgram = defParser.visitDef_program(defProgram_ctx);

            expect(defProgram.componentDefinitions).toHaveLength(3);
            expect(defProgram.variableDefinitions).toHaveLength(3);
        });

        it("parses a def program for DefProgram_changePic", () => {
            const defProgram_ctx = getDefProgramCtxFromInput(DefExamples.DefProgram_changePic);
            const defProgram = defParser.visitDef_program(defProgram_ctx);

            expect(defProgram.componentDefinitions).toHaveLength(3);
            expect(defProgram.variableDefinitions).toHaveLength(4);
        });
    });

    describe("visitComponent", () => {
        it("parses 3 component definitions for DefProgram_nav", () => {
            const compDef_ctxList = getComponentCtxFromInput(DefExamples.DefProgram_nav);

            const componentDef1 = defParser.visitComponent(compDef_ctxList[0]);
            expect(componentDef1.baseComponent.component).toBe(ComponentEnum.Button);
            expect(componentDef1.name).toBe('HomeButton');
            expect(componentDef1.paramList.params).toHaveLength(0);
            expect(componentDef1.propertyAssignList).toHaveLength(5);

            const componentDef2 = defParser.visitComponent(compDef_ctxList[1]);
            expect(componentDef2.baseComponent.component).toBe(ComponentEnum.Button);
            expect(componentDef2.name).toBe('AboutButton');
            expect(componentDef2.paramList.params).toHaveLength(1);
            expect(componentDef2.propertyAssignList).toHaveLength(6);

            const componentDef3 = defParser.visitComponent(compDef_ctxList[2]);
            expect(componentDef3.baseComponent.component).toBe(ComponentEnum.Container);
            expect(componentDef3.name).toBe('NavBar');
            expect(componentDef3.paramList.params).toHaveLength(0);
            expect(componentDef3.propertyAssignList).toHaveLength(6);
        });

        it("parses component definitions for DefProgram_changePic with varying param lists", () => {
            const compDef_ctxList = getComponentCtxFromInput(DefExamples.DefProgram_changePic);

            const componentDef1 = defParser.visitComponent(compDef_ctxList[0]);
            expect(componentDef1.baseComponent.component).toBe(ComponentEnum.Picture);
            expect(componentDef1.name).toBe('DynamicPicture');
            expect(componentDef1.paramList.params).toHaveLength(1);
            expect(componentDef1.propertyAssignList).toHaveLength(1);

            const componentDef2 = defParser.visitComponent(compDef_ctxList[1]);
            const expectedParamNames = ['DynamicPicture', 'HeyText'];

            expect(componentDef2.baseComponent.component).toBe(ComponentEnum.Button);
            expect(componentDef2.name).toBe('Btn');
            expect(componentDef2.paramList.params).toHaveLength(expectedParamNames.length);
            expect(componentDef2.propertyAssignList).toHaveLength(3);

            // Check that all the params are in the paramList
            const paramNames = componentDef2.paramList.params.map(param => {
                return param.name;
            });
            expectedParamNames.forEach(expectedParam => {
                expect(paramNames).toContain(expectedParam);
            });

            const componentDef3 = defParser.visitComponent(compDef_ctxList[2]);
            expect(componentDef3.baseComponent.component).toBe(ComponentEnum.Text);
            expect(componentDef3.name).toBe('HeyText');
            expect(componentDef3.paramList.params).toHaveLength(0);
            expect(componentDef3.propertyAssignList).toHaveLength(1);
        });
    });

    describe("visitProperty_assign", () => {
        it("parses property assignments for DefProgram_nav", () => {            
            const propAssignment_ctxList = getPropertyAssignmentCtxFromInput(DefExamples.DefProgram_nav);

            // Only testing the property assignments in the second component
            // We could test more, but this should be enough
            const propertyAssignments2 = propAssignment_ctxList[1];
            expect(propertyAssignments2).toHaveLength(6);

            // color = c
            const property1 = defParser.visitProperty_assign(propertyAssignments2[0]);
            expect(property1.property.name).toBe('color');
            expect(property1.value).toBeInstanceOf(Variable);
            expect((property1.value as Variable).name).toBe('c');

            // width = 100
            const property2 = defParser.visitProperty_assign(propertyAssignments2[1]);
            expect(property2.property.name).toBe('width');
            expect(property2.value).toBeInstanceOf(NumberConstant);
            expect((property2.value as NumberConstant).value).toBe(100);

            // height = 50
            const property3 = defParser.visitProperty_assign(propertyAssignments2[2]);
            expect(property3.property.name).toBe('height');
            expect(property3.value).toBeInstanceOf(NumberConstant);
            expect((property3.value as NumberConstant).value).toBe(50);

            // disabled = false
            const property4 = defParser.visitProperty_assign(propertyAssignments2[3]);
            expect(property4.property.name).toBe('disabled');
            expect(property4.value).toBeInstanceOf(BooleanConstant);
            expect((property4.value as BooleanConstant).value).toBe(false);

            // text = 'About'
            const property5 = defParser.visitProperty_assign(propertyAssignments2[4]);
            expect(property5.property.name).toBe('text');
            expect(property5.value).toBeInstanceOf(StringConstant);
            expect((property5.value as StringConstant).value).toBe('About');

            // onclick = open(About.view)
            const property6 = defParser.visitProperty_assign(propertyAssignments2[5]);
            expect(property6.property.name).toBe('onclick');
            expect(property6.value).toBeInstanceOf(FunctionCall);
        });

        it("parses property assignments for DefProgram_changePic with a list", () => {
            const propAssignment_ctxList = getPropertyAssignmentCtxFromInput(DefExamples.DefProgram_changePic);

            const propertyAssignments2 = propAssignment_ctxList[1];
            expect(propertyAssignments2).toHaveLength(3);

            // onclick = [set(pic.width, pic.width * 2), set(t.fontsize, 14)]
            const property3 = defParser.visitProperty_assign(propertyAssignments2[2]);
            expect(property3.property.name).toBe('onclick');
            expect(property3.value).toBeInstanceOf(List);
        });
    });

    describe("visitList", () => {
        it("parses a list property assignment for DefProgram_changePic", () => {
            const list_ctxList = getListCtxFromInput(DefExamples.DefProgram_changePic);
            
            expect(list_ctxList).toHaveLength(1);
            
            // [set(pic.width, pic.width * 2), set(t.fontsize, 14), open(About.view)]
            const list1 = defParser.visitList(list_ctxList[0]);
            expect(list1.values).toHaveLength(3);
            list1.values.forEach(val => {
                expect(val).toBeInstanceOf(FunctionCall);
            });
        });
    });

    describe("visitFunction", () => {
        it("parses function calls for DefProgram_nav", () => {
            const func_ctxList = getFunctionCtxFromInput(DefExamples.DefProgram_nav);

            expect(func_ctxList).toHaveLength(2);

            // open(Main.view)
            const funcCall1 = defParser.visitFunction(func_ctxList[0]);
            expect(funcCall1.type).toBe(FunctionEnum.Open);
            expect(funcCall1.args).toHaveLength(1);

            // open(About.view)
            const funcCall2 = defParser.visitFunction(func_ctxList[1]);
            expect(funcCall2.type).toBe(FunctionEnum.Open);
            expect(funcCall2.args).toHaveLength(1);
        });

        it("parses function calls for DefProgram_changePic", () => {
            const func_ctxList = getFunctionCtxFromInput(DefExamples.DefProgram_changePic);
            
            expect(func_ctxList).toHaveLength(3);

            // set(pic.width, pic.width * 2)
            const funcCall1 = defParser.visitFunction(func_ctxList[0]);
            expect(funcCall1.type).toBe(FunctionEnum.Set);
            expect(funcCall1.args).toHaveLength(2);

            // set(t.fontsize, 14)
            const funcCall2 = defParser.visitFunction(func_ctxList[1]);
            expect(funcCall2.type).toBe(FunctionEnum.Set);
            expect(funcCall2.args).toHaveLength(2);

            // open(About.view)
            const funcCall3 = defParser.visitFunction(func_ctxList[2]);
            expect(funcCall3.type).toBe(FunctionEnum.Open);
            expect(funcCall3.args).toHaveLength(1);
        });
    });

    describe("visitFunc_arg", () => {
        it("parses func args for DefProgram_nav", () => {
            const funcArg_ctxList = getFunctionArgCtxFromInput(DefExamples.DefProgram_nav);

            // 2 sets of function args
            expect(funcArg_ctxList).toHaveLength(2);

            // Main.view
            const func1_argCtxList = funcArg_ctxList[0];
            const func1Arg1 = defParser.visitFunc_arg(func1_argCtxList[0]);
            expect(func1Arg1).toBeInstanceOf(ViewReference);
            
            // About.view
            const func2_argCtxList = funcArg_ctxList[1];
            const func2Arg1 = defParser.visitFunc_arg(func2_argCtxList[0]);
            expect(func2Arg1).toBeInstanceOf(ViewReference);
        });

        it("parses func args for DefProgram_changePic", () => {
            const funcArg_ctxList = getFunctionArgCtxFromInput(DefExamples.DefProgram_changePic);

            // 2 sets of function args
            expect(funcArg_ctxList).toHaveLength(3);

            // pic.width, pic.width * 2
            const func1_argCtxList = funcArg_ctxList[0];
            const func1Arg1 = defParser.visitFunc_arg(func1_argCtxList[0]);
            expect(func1Arg1).toBeInstanceOf(ObjectPropertyValue);

            const func1Arg2 = defParser.visitFunc_arg(func1_argCtxList[1]);
            expect(func1Arg2).toBeInstanceOf(ArithExpression);

            // Do a deeper check on pic.width
            // Ideally we would unit test visitObj_prop instead
            const objProp = func1Arg1 as ObjectPropertyValue;
            expect(objProp.variable.name).toBe('DynamicPicture');
            expect(objProp.property.name).toBe('width');

            // Do a deeper check on pic.width * 2
            // Ideally we would unit test visitObj_prop and visitArith_exp instead
            const arithExpression = func1Arg2 as ArithExpression;
            expect(arithExpression.terms).toHaveLength(2);
            expect(arithExpression.operations).toHaveLength(1);
            expect(arithExpression.operations[0].type).toBe(OperationEnum.Multiplication);
            expect(arithExpression.terms[0]).toBeInstanceOf(ObjectPropertyValue);
            expect(arithExpression.terms[1]).toBeInstanceOf(NumberConstant);
            expect((arithExpression.terms[1] as NumberConstant).value).toBe(2);

            // t.fontsize, 14
            const func2_argCtxList = funcArg_ctxList[1];
            const func2Arg1 = defParser.visitFunc_arg(func2_argCtxList[0]);
            expect(func2Arg1).toBeInstanceOf(ObjectPropertyValue);

            const func2Arg2 = defParser.visitFunc_arg(func2_argCtxList[1]);
            expect(func2Arg2).toBeInstanceOf(NumberConstant);
        });
    });

    describe("visitVariable_definition", () => {
        it("parses variable definitions for DefProgram_nav", () => {            
            const varDef_ctxList = getVarDefCtxFromInput(DefExamples.DefProgram_nav);

            expect(varDef_ctxList).toHaveLength(3);

            const varDef1 = defParser.visitVariable_definition(varDef_ctxList[0]);
            expect(varDef1.variable.name).toBe('hb');

            const varDef2 = defParser.visitVariable_definition(varDef_ctxList[1]);
            expect(varDef2.variable.name).toBe('ab');

            const varDef3 = defParser.visitVariable_definition(varDef_ctxList[2]);
            expect(varDef3.variable.name).toBe('nb');
        });

        it("parses variable definitions for DefProgram_changePic", () => {            
            const varDef_ctxList = getVarDefCtxFromInput(DefExamples.DefProgram_changePic);

            expect(varDef_ctxList).toHaveLength(4);

            const varDef1 = defParser.visitVariable_definition(varDef_ctxList[0]);
            expect(varDef1.variable.name).toBe('coolPic');

            const varDef2 = defParser.visitVariable_definition(varDef_ctxList[1]);
            expect(varDef2.variable.name).toBe('myText');

            const varDef3 = defParser.visitVariable_definition(varDef_ctxList[2]);
            expect(varDef3.variable.name).toBe('myTextAgain');

            const varDef4 = defParser.visitVariable_definition(varDef_ctxList[3]);
            expect(varDef4.variable.name).toBe('myBtn');
        });
    });
});

const getGeneratedParser = (input: string) => {
    const charStream = new CharStream(input);
    const lexer = new UILexer(charStream);
    const tokenStream = new CommonTokenStream(lexer);
    return new DefinitionParser(tokenStream);
};

// Get the def program context
const getDefProgramCtxFromInput = (input: string) => {
    const generatedParser = getGeneratedParser(input);
    return generatedParser.def_program();
};

const getComponentCtxFromInput = (input: string) => {
    const defProgram_ctx = getDefProgramCtxFromInput(input);
    return defProgram_ctx.component_list();
}

// Get all property assignments found in the input, grouped by component definition
const getPropertyAssignmentCtxFromInput = (input: string) => {
    const compDef_ctxList = getComponentCtxFromInput(input);
    const assignmentContexts: Property_assignContext[][] = [];

    compDef_ctxList.forEach(ctx => {
        assignmentContexts.push(ctx.property_assign_list());
    });

    return assignmentContexts;
};

// Get all component instantiation contexts in the input
const getVarDefCtxFromInput = (input: string) => {
    const defProgram_ctx = getDefProgramCtxFromInput(input);
    return defProgram_ctx.variable_definition_list();
};

// Get all list contexts found in component defs in the input
const getListCtxFromInput = (input: string) => {
    const propertyAssignmentCtxList = getPropertyAssignmentCtxFromInput(input).flat();
    const listContexts: ListContext[] = [];

    propertyAssignmentCtxList.forEach(ctx => {
        if (ctx.list()) listContexts.push(ctx.list());
    });

    return listContexts;
};

// Get all function call contexts found in component defs in the input
const getFunctionCtxFromInput = (input: string) => {
    const propertyAssignmentCtxList = getPropertyAssignmentCtxFromInput(input).flat();
    const funcContexts: FunctionContext[] = [];

    propertyAssignmentCtxList.forEach(ctx => {
        if (ctx.function_()) funcContexts.push(ctx.function_());

        const listContext = ctx.list();
        if (listContext && listContext.function__list()) {
            funcContexts.push(...listContext.function__list())
        }
    });

    return funcContexts;
};

const getFunctionArgCtxFromInput = (input: string) => {
    const functionCtxList = getFunctionCtxFromInput(input);
    const funcArgContexts: Func_argContext[][] = [];

    functionCtxList.forEach(ctx => {
        funcArgContexts.push(ctx.func_arg_list());
    });

    return funcArgContexts;
};
