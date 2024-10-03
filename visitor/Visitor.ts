import { ArithExpression, ArithOperation, ComponentDefinition, DefProgram, Param, ParamList, Property, PropertyAssignment, VariableDefinition } from "../ast";
import { BaseComponent, BooleanConstant, ComponentInstantiation, Constant, FunctionCall, Variable, NumberConstant, StringConstant, Value, List, ListValue, NamedArgument } from "../ast";
import { ViewProgram, MainProgram, ObjectPropertyValue, ViewReference } from "../ast";
import {ComponentUsage} from "../ast/ComponentUsage";

/**
 * Visitor interface for all nodes, where:
 * - `T` is the context type passed between nodes
 * - `U` is the return type of each visited node
 * 
 * This should only be used by the `BaseVisitor` class.
 */
export interface Visitor<T,U> {
    // ------------- Definition -------------

    visitDefProgram(defProgram: DefProgram, t: T): U;

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: T): U;

    visitParam(param: Param, t: T): U;

    visitParamList(paramList: ParamList, t: T): U;

    visitProperty(property: Property, t: T): U;

    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: T): U;

    visitVariableDefinition(variableDefinition: VariableDefinition, t: T): U;

    // ------------- Shared -------------

    visitBaseComponent(baseComponent: BaseComponent, t: T): U;

    visitBooleanConstant(booleanConstant: BooleanConstant, t: T): U;

    visitComponentInstantiation(componentInstantiation: ComponentInstantiation, t: T): U;

    visitConstant(constant: Constant, t: T): U;

    visitFunctionCall(functionCall: FunctionCall, t: T): U;

    visitList(list: List, t: T): U;

    visitListValue(listValue: ListValue, t: T): U;

    visitNamedArgument(namedArg: NamedArgument, t: T): U;

    visitNumberConstant(numberConstant: NumberConstant, t: T): U;

    visitObjectPropertyValue(objPropertyVal: ObjectPropertyValue, t: T): U;

    visitStringConstant(stringConstant: StringConstant, t: T): U;

    visitValue(value: Value, t: T): U;

    visitVariable(variable: Variable, t: T): U;

    visitViewReference(viewRef: ViewReference, t: T): U;

    visitArithExpression(arithExpression: ArithExpression, t: T): U;

    visitArithOperation(arithOperation: ArithOperation, t: T): U;

    // ------------- View -------------

    visitViewProgram(viewProgram: ViewProgram, t: T): U;

    visitComponentUsage(componentUsage: ComponentUsage, t: T): U;

    // ------------- Main -------------

    visitMainProgram(mainProgram: MainProgram, t: T): U;
}