import { BooleanConstant, ComponentInstantiation, Variable, NumberConstant, StringConstant,
    Value, NamedArgument, ArithExpression, ArithOperation, Property, List, ViewProgram, ASTNode,
    ObjectPropertyValue, ComponentUsage } from "../ast";
import {
    Arith_expContext,
    AssignmentContext,
    Component_instantiationContext,
    Component_usageContext,
    ListContext,
    Obj_propContext,
    Possible_numContext,
    ValueContext,
    View_programContext
} from "../gen/ViewParser";
import ViewParserVisitor from "../gen/ViewParserVisitor";

/**
 * ParseToViewASTVisitor takes in a parse tree from ViewParser and returns an AST
 * corresponding to the view program for one view file.
 * 
 * The visitView_program method *might* be the only method that needs to be called
 * from outside this class.
 */
export class ParseToViewASTVisitor extends ViewParserVisitor<ASTNode> {
    private _fileName: string;

    constructor(fileName: string) {
        super();
        this._fileName = fileName;
    }

    public get fileName () {
        return this._fileName;
    }

    public visitView_program: (ctx: View_programContext) => ViewProgram = (ctx) => {
        const compUsageList = ctx.component_usage_list();
        const componentUsages = compUsageList.map(
            compUsage => this.visitComponent_usage(compUsage)
        );

        return new ViewProgram(this.fileName, componentUsages);
    };

    visitComponent_usage: (ctx: Component_usageContext) => ComponentUsage = (ctx) => {
        const nameContext = ctx.NAME();
        const compInstantContext = ctx.component_instantiation();
        if (compInstantContext) {
            return this.visitComponent_instantiation(compInstantContext);
        } else if (nameContext) {
            return new Variable(nameContext.getText());
        } else {
            throw new Error("value type is invalid.");
        }
    }

	visitComponent_instantiation: (ctx: Component_instantiationContext) => ComponentInstantiation = (ctx) => {
        const componentName = ctx.UI_NAME().getText();

        const namedArguments = ctx.assignment_list().map(assignmentContext => {
            return this.visitAssignment(assignmentContext);
        });

        return new ComponentInstantiation(componentName, namedArguments);
    };

    visitValue: (ctx: ValueContext) => Value = (ctx) => {
        const nameContext = ctx.NAME();
        const numberContext = ctx.NUMBER();
        const stringContext = ctx.STRING();
        const booleanContext = ctx.BOOLEAN();
        const arithExpContext = ctx.arith_exp();

        if (nameContext) {
            return new Variable(nameContext.getText());
        } else if (numberContext) {
            return new NumberConstant(numberContext.getText());
        } else if (stringContext) {
            return new StringConstant(stringContext.getText());
        } else if (booleanContext) {
            return new BooleanConstant(booleanContext.getText());
        } else if (arithExpContext) {
            return this.visitArith_exp(arithExpContext);
        } else {
            throw new Error("value type is invalid.");
        }
    };

    visitAssignment: (ctx: AssignmentContext) => NamedArgument = (ctx) => {
        const paramName = ctx.NAME().getText();

        const listContext = ctx.list();
        if (listContext) {
            const list = this.visitList(listContext);
            return new NamedArgument(paramName, list);
        }

        const valueContext = ctx.value();
        if (valueContext) {
            const value = this.visitValue(valueContext);
            return new NamedArgument(paramName, value);
        }

        throw new Error('Did not receive a valid Assignment context');
    }

    visitList: (ctx: ListContext) => List = (ctx) => {
        const value_ctxList = ctx.value_list();
        if (value_ctxList.length > 0) {
            const values = value_ctxList.map(valueContext => {
                return this.visitValue(valueContext);
            });
            return new List(values);
        } else {
            throw new Error("Received invalid list contents");
        }
    };

    visitArith_exp: (ctx: Arith_expContext) => ArithExpression = (ctx) => {
        const terms: Value[] = ctx.possible_num_list().map(
            possibleNum_ctx => this.visitPossible_num(possibleNum_ctx)
        );

        const arithOps: ArithOperation[] = ctx.ARITH_OP_list().map(
            ao => new ArithOperation(ao.getText())
        );

        return new ArithExpression(terms, arithOps);
    };

    visitPossible_num: (ctx: Possible_numContext) => Value = (ctx) => {
        const numberNode = ctx.NUMBER();
        // Term is a constant number, ex: 4
        if (numberNode) return new NumberConstant(numberNode.getText());

        const objProp_ctx = ctx.obj_prop();
        // Term is an object property value, ex: pic.width
        if (objProp_ctx) return this.visitObj_prop(objProp_ctx);

        const nameNode = ctx.NAME();
        // Term is a variable/parameter, ex: x
        if (nameNode) return new Variable(nameNode.getText());

        throw new Error('No possible number was found when parsing Possible_numContext');
    };

    visitObj_prop: (ctx: Obj_propContext) => ASTNode = (ctx) => {
        const varName = ctx.UI_NAME().getText();
        const propertyName = ctx.PROPERTY().getText();

        const variable = new Variable(varName);
        const property = new Property(propertyName);
        return new ObjectPropertyValue(variable, property);
    };
}
