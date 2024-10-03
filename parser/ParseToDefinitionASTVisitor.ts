import { Arith_expContext, AssignmentContext, ComponentContext, Component_instantiationContext, Def_programContext,
    Func_argContext, FunctionContext, ListContext, Obj_propContext, Possible_numContext,
    Property_assignContext, ValueContext, Variable_definitionContext, ViewContext } from "../gen/DefinitionParser";
import DefinitionParserVisitor from "../gen/DefinitionParserVisitor";
import { ASTNode } from "../ast/ASTNode";
import { ArithExpression, ArithOperation, BooleanConstant, ComponentDefinition, ComponentInstantiation, DefProgram,
    List, NamedArgument, Param, ParamList, Property, PropertyAssignment, VariableDefinition, BaseComponent,
    FunctionCall, Variable, NumberConstant, StringConstant, Value, ObjectPropertyValue, ViewReference } from "../ast";

/**
 * ParseToDefinitionASTVisitor takes in a parse tree from DefinitionParser and 
 * returns an AST corresponding to the definition program for the .def file.
 */
export class ParseToDefinitionASTVisitor extends DefinitionParserVisitor<ASTNode> {
    visitDef_program: (ctx: Def_programContext) => DefProgram = (ctx) => {
        const componentDefinitions: ComponentDefinition[] = ctx.component_list().map(
            c => this.visitComponent(c)
        );

        const varDefList = ctx.variable_definition_list();
        const variableDefinitions = varDefList.map(
            varDef => this.visitVariable_definition(varDef)
        );
        return new DefProgram(componentDefinitions, variableDefinitions);
    };

    visitComponent: (ctx: ComponentContext) => ComponentDefinition = (ctx) => {
        const baseComp: BaseComponent = new BaseComponent(ctx.BASE_COMPONENT().getText());

        const componentName = ctx.UI_NAME().getText();

        const propertyAssignList: PropertyAssignment[] = ctx.property_assign_list().map(
            pa => this.visitProperty_assign(pa)
        );

        const paramNames = new Set<string>();

        // Search assignments for variable names, which are the params
        propertyAssignList.forEach(propertyAssignment => {
            const value = propertyAssignment.value;
            if (value instanceof Variable) paramNames.add(value.name);
            else if (value instanceof List) { // We need to look in function calls too
                const list = value;
                list.values.forEach(listElem => {
                    if (listElem instanceof FunctionCall) {
                        const funcCall = listElem;
                        funcCall.args.forEach(funcArg => {
                            // Check if variables are in the following forms:
                            // variable: t
                            // object property: t.width
                            // expression: t + 10, or t.width + 10 
                            if (funcArg instanceof ObjectPropertyValue) {
                                paramNames.add(funcArg.variable.name);
                            } else if (funcArg instanceof Variable) {
                                paramNames.add(funcArg.name);
                            } else if (funcArg instanceof ArithExpression) {
                                const exp = funcArg;
                                exp.terms.forEach(term => {
                                    if (term instanceof Variable) {
                                        paramNames.add(term.name);
                                    } else if (term instanceof ObjectPropertyValue) {
                                        paramNames.add(term.variable.name);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        const params = Array.from(paramNames).map(name => new Param(name));
        const paramList = new ParamList(params);

        return new ComponentDefinition(baseComp, componentName, paramList, propertyAssignList);
    };

    visitProperty_assign: (ctx: Property_assignContext) => PropertyAssignment = (ctx) => {
        const property: Property = new Property(ctx.PROPERTY().getText());
        const functionContext = ctx.function_();
        const listContext = ctx.list();
        const valueContext = ctx.value();

        if (functionContext) {
            const func = this.visitFunction(functionContext);
            return new PropertyAssignment(property, func);
        } else if (listContext) {
            const list = this.visitList(listContext);
            return new PropertyAssignment(property, list);
        } else if (valueContext) {
            const val = this.visitValue(valueContext);
            return new PropertyAssignment(property, val);
        } else {
            throw "property assignment is missing the right-hand side."
        }
    };

    visitFunction: (ctx: FunctionContext) => FunctionCall = (ctx) => {
        const funcName: string = ctx.FUNCTION_NAME().getText();
        const args = ctx.func_arg_list().map(funcArg_ctx => {
            return this.visitFunc_arg(funcArg_ctx);
        });

        return new FunctionCall(funcName, args);
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
            throw new Error("value type is invalid.")
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

    visitVariable_definition: (ctx: Variable_definitionContext) => VariableDefinition = (ctx) => {
        const varName = ctx.NAME().getText();
        const variable = new Variable(varName);

        const componentInstantiation = this.visitComponent_instantiation(ctx.component_instantiation());

        return new VariableDefinition(variable, componentInstantiation);
    };

	visitComponent_instantiation: (ctx: Component_instantiationContext) => ComponentInstantiation = (ctx) => {
        const componentName = ctx.UI_NAME().getText();

        const namedArguments = ctx.assignment_list().map(assignmentContext => {
            return this.visitAssignment(assignmentContext);
        });

        return new ComponentInstantiation(componentName, namedArguments);
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
        const func_ctxList = ctx.function__list();
        if (value_ctxList.length > 0) {
            const values = value_ctxList.map(valueContext => {
                return this.visitValue(valueContext);
            });
            return new List(values);
        } else if (func_ctxList.length > 0) {
            const funcCalls = func_ctxList.map(funcContext => {
                return this.visitFunction(funcContext);
            });
            return new List(funcCalls);
        } else {
            throw new Error("Received invalid list contents");
        }
    };

    visitFunc_arg: (ctx: Func_argContext) => Value = (ctx) => {
        const objProp_ctx = ctx.obj_prop();
        if (objProp_ctx) return this.visitObj_prop(objProp_ctx);

        const view_ctx = ctx.view();
        if (view_ctx) return this.visitView(view_ctx);

        const value_ctx = ctx.value();
        return this.visitValue(value_ctx);
    };

    visitObj_prop: (ctx: Obj_propContext) => ASTNode = (ctx) => {
        const varName = ctx.UI_NAME().getText();
        const propertyName = ctx.PROPERTY().getText();

        const variable = new Variable(varName);
        const property = new Property(propertyName);
        return new ObjectPropertyValue(variable, property);
    };

    visitView: (ctx: ViewContext) => ASTNode = (ctx) => {
        const viewName = ctx.UI_NAME().getText();
        return new ViewReference(viewName);
    };
}
