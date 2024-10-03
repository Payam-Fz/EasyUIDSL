import { CharStream, CommonTokenStream } from "antlr4";
import UILexer from "../../gen/UILexer";
import ViewParser, {
    AssignmentContext,
    Component_instantiationContext,
    Component_usageContext,
    ListContext
} from "../../gen/ViewParser";
import { ParseToViewASTVisitor } from "../../parser/ParseToViewASTVisitor";
import { ViewExamples } from "../examples/test-examples/view-examples";
import { List, StringConstant, Variable } from "../../ast";


describe("ParseToViewASTVisitor", () => {
    let viewParser: ParseToViewASTVisitor;

    beforeEach(() => {
        viewParser = new ParseToViewASTVisitor("Test");
    });

    describe("visitView_program", () => {
        it("parses a view program with 2 instantiations for ViewProgram_nav", () => {
            const viewProgram_ctx = getViewProgramCtxFromInput(ViewExamples.ViewProgram_nav);
            const viewProgram = viewParser.visitView_program(viewProgram_ctx);

            expect(viewProgram.componentUsages).toHaveLength(2);
        });

        it("parses a view program with only variable instantiations for ViewProgram_varsOnly", () => {
            const viewProgram_ctx = getViewProgramCtxFromInput(ViewExamples.ViewProgram_varsOnly);
            const viewProgram = viewParser.visitView_program(viewProgram_ctx);

            expect(viewProgram.componentUsages).toHaveLength(4);
        });
    });

    describe("visitComponent_instantiation", () => {
        it("parses 2 component instantiations for ViewProgram_nav", () => {
            const compInst_ctxList = getCompInstCtxFromInput(ViewExamples.ViewProgram_nav);

            const componentInstantiation1 = viewParser.visitComponent_instantiation(compInst_ctxList[0]);
            expect(componentInstantiation1.componentName).toBe('NavBar');
            expect(componentInstantiation1.argumentList).toHaveLength(2);

            const componentInstantiation2 = viewParser.visitComponent_instantiation(compInst_ctxList[1]);
            expect(componentInstantiation2.componentName).toBe('MyText');
            expect(componentInstantiation2.argumentList).toHaveLength(1);
        });

        it("parses 4 component instantiations for ViewProgram_varsOnly", () => {
            const compInst_ctxList = getCompVarCtxFromInput(ViewExamples.ViewProgram_varsOnly);

            // The parser doesn't know the difference between a component instantiation
            // without arguments vs. a variable
            expect(compInst_ctxList[0]).toBe('hb');
            expect(compInst_ctxList[1]).toBe('ab');
            expect(compInst_ctxList[2]).toBe('mb');
            expect(compInst_ctxList[3]).toBe('coolText');
        });
    });

    describe("visitAssignment", () => {
        it("parses assignments for ViewProgram_nav", () => {            
            const assignment_ctxList = getAssignmentCtxFromInput(ViewExamples.ViewProgram_nav);
    
            expect(assignment_ctxList).toHaveLength(3);

            const assignment1 = viewParser.visitAssignment(assignment_ctxList[0]);
            expect(assignment1.parameterName).toBe('components');
            expect(assignment1.argumentValue).toBeInstanceOf(List);

            const assignment2 = viewParser.visitAssignment(assignment_ctxList[1]);
            expect(assignment2.parameterName).toBe('c');
            expect(assignment2.argumentValue).toBeInstanceOf(StringConstant);
    
            const assignment3 = viewParser.visitAssignment(assignment_ctxList[2]);
            expect(assignment3.parameterName).toBe('t');
            expect(assignment3.argumentValue).toBeInstanceOf(StringConstant);
            expect((assignment3.argumentValue as StringConstant).value).toBe('Welcome to my website!');
        });
    });

    describe("visitList", () => {
        it("parses list argument for ViewProgram_nav", () => {            
            const list_ctxList = getListCtxFromInput(ViewExamples.ViewProgram_nav);

            expect(list_ctxList).toHaveLength(1);

            const list = viewParser.visitList(list_ctxList[0]);
            expect(list.values).toHaveLength(3);

            const variableNames = ['hb', 'ab', 'mb'];

            // Check that each value of the list is the matching variable name
            list.values.forEach((val, i) => {
                expect(val).toBeInstanceOf(Variable);
                expect((val as Variable).name).toBe(variableNames[i]);
            });
        });
    });
});

const getGeneratedParser = (input: string) => {
    const charStream = new CharStream(input);
    const lexer = new UILexer(charStream);
    const tokenStream = new CommonTokenStream(lexer);
    return new ViewParser(tokenStream);
};

// Get the view program context
const getViewProgramCtxFromInput = (input: string) => {
    const generatedParser = getGeneratedParser(input);
    return generatedParser.view_program();
};

const getCompUsageCtxFromInput = (input: string): Component_usageContext[] => {
    const viewProgram_ctx = getViewProgramCtxFromInput(input);
    const usageCtx: Component_usageContext[] = [];
    viewProgram_ctx.component_usage_list().forEach(ctx => {
        usageCtx.push(ctx);
    })
    return usageCtx;
};

// Get all component instantiation contexts in the input
const getCompInstCtxFromInput = (input: string): Component_instantiationContext[] => {
    const compUsage_ctx = getCompUsageCtxFromInput(input);
    const instantiationCtx: Component_instantiationContext[] = [];
    compUsage_ctx.forEach(ctx => {
        if (ctx.component_instantiation()) {
            instantiationCtx.push(ctx.component_instantiation());
        }
    })
    return instantiationCtx;
};

// Get all component variable contexts in the input
const getCompVarCtxFromInput = (input: string): string[] => {
    const compUsage_ctx = getCompUsageCtxFromInput(input);
    const variableCtx: string[] = [];
    compUsage_ctx.forEach(ctx => {
        if (ctx.NAME()) {
            variableCtx.push(ctx.NAME().getText());
        }
    })
    return variableCtx;
};

// Get all assignments found in the input
const getAssignmentCtxFromInput = (input: string) => {
    const compInst_ctxList = getCompInstCtxFromInput(input);
    const assignmentContexts: AssignmentContext[] = [];

    compInst_ctxList.forEach(ctx => {
        assignmentContexts.push(...ctx.assignment_list());
    });

    return assignmentContexts;
};

// Get all lists found in the input
const getListCtxFromInput = (input: string) => {
    const assignment_ctxList = getAssignmentCtxFromInput(input);

    const listContexts: ListContext[] = [];

    assignment_ctxList.forEach(ctx => {
        if (ctx.list()) listContexts.push(ctx.list());
    });

    return listContexts;
};