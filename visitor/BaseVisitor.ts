import { ArithExpression, ArithOperation, ComponentDefinition, DefProgram, Param, ParamList, Property, PropertyAssignment, VariableDefinition } from "../ast";
import { BaseComponent, BooleanConstant, ComponentInstantiation, Constant, FunctionCall, Variable, NumberConstant, StringConstant, Value, ListValue, NamedArgument, List } from "../ast";
import { ViewProgram, MainProgram, ObjectPropertyValue, ViewReference } from "../ast";
import { Visitor } from "./Visitor";
import {ComponentUsage} from "../ast/ComponentUsage";

/**
 * Base visitor for .def files. Evaluator visitors should extend this class.
 */
export class BaseVisitor<T,U> implements Visitor<T,U> {
    // ------------- Definition -------------

    visitArithExpression(arithExpression: ArithExpression, t: T): U {
        // console.log('Visiting ArithExpression', arithExpression.terms, arithExpression.operations);
        arithExpression.terms.forEach(term => term.accept(this, t));
        arithExpression.operations.forEach(op => op.accept(this, t));
        return null as U;
    }

    visitArithOperation(arithOperation: ArithOperation, t: T): U {
        // console.log('Visiting ArithOperation', arithOperation.symbol);
        return null as U;
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: T): U {
        // console.log('Visiting ComponentDefinition', componentDefinition.name);
        componentDefinition.baseComponent.accept(this, t);
        componentDefinition.paramList.accept(this, t);
        componentDefinition.propertyAssignList.forEach(propertyAssignment => {
            propertyAssignment.accept(this, t);
        });
        return null as U;
    }

    visitDefProgram(defProgram: DefProgram, t: T): U {
        // console.log('Visiting DefProgram');
        defProgram.componentDefinitions.forEach(componentDefinition => {
            componentDefinition.accept(this, t);
        });
        return null as U;
    }

    visitParam(param: Param, t: T): U {
        // console.log('Visiting Param', param.name);
        return null as U;
    }

    visitParamList(paramList: ParamList, t: T): U {
        // console.log('Visiting ParamList');
        paramList.params.forEach(param => {
            param.accept(this, t);
        });
        return null as U;
    }

    visitProperty(property: Property, t: T): U {
        // console.log('Visiting Property', property.name);
        return null as U;
    }

    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: T): U {
        // console.log('Visiting PropertyAssign');
        propertyAssign.property.accept(this, t);
        propertyAssign.value.accept(this, t);
        return null as U;
    }

    visitVariableDefinition(variableDefinition: VariableDefinition, t: T): U {
        // console.log('Visiting VariableDefinition', variableDefinition.variable);
        variableDefinition.componentInstantiation.accept(this, t);
        return null as U;
    }

    // ------------- Shared -------------

    visitBaseComponent(baseComponent: BaseComponent, t: T): U {
        // console.log('Visiting BaseComponent', baseComponent.component);
        return null as U;
    }

    visitComponentInstantiation(componentInstantiation: ComponentInstantiation, t: T): U {
        // console.log('Visiting ComponentInstantiation', componentInstantiation.componentName);
        componentInstantiation.argumentList.forEach(arg => {
            arg.accept(this, t);
        });
        return null as U;
    }

    visitBooleanConstant(booleanConstant: BooleanConstant, t: T): U {
        // console.log('Visiting BooleanConstant', booleanConstant.value);
        return null as U;
    }

    visitConstant(constant: Constant, t: T): U {
        // we shouldn't ever hit this
        console.error('Unexpected path - Visiting Constant');
        return null as U;
    }

    visitFunctionCall(func: FunctionCall, t: T): U {
        // console.log('Visiting FunctionCall', func.type);
        return null as U;
    }

    visitList(list: List, t: T): U {
        // console.log('Visiting List');
        list.values.forEach(val => val.accept(this, t));
        return null as U;
    }

    visitListValue(listValue: ListValue, t: T): U {
        // we shouldn't ever hit this
        console.error('Unexpected path - Visiting ListValue');
        return null as U;
    }

    visitNamedArgument(namedArg: NamedArgument, t: T): U {
        // console.log('Visiting NamedArgument', namedArg.parameterName);
        namedArg.argumentValue.accept(this, t);
        return null as U;
    }

    visitNumberConstant(numberConstant: NumberConstant, t: T): U {
        // console.log('Visiting NumberConstant', numberConstant.value);
        return null as U;
    }

    visitObjectPropertyValue(objPropertyVal: ObjectPropertyValue, t: T): U {
        // console.log('Visiting ObjectPropertyValue');
        objPropertyVal.variable.accept(this, t);
        objPropertyVal.property.accept(this, t);
        return null as U;
    }

    visitStringConstant(stringConstant: StringConstant, t: T): U {
        // console.log('Visiting StringConstant', stringConstant.value);
        return null as U;
    }

    visitValue(value: Value, t: T): U {
        // we shouldn't ever hit this
        console.error('Unexpected path - Visiting Value');
        return null as U;
    }

    visitVariable(variable: Variable, t: T): U {
        // console.log('Visiting Variable', variable.name);
        return null as U;
    }

    visitViewReference(viewRef: ViewReference, t: T): U {
        // console.log('Visiting ViewReference', viewRef.name);
        return null as U;
    }

    // ------------- View -------------

    visitViewProgram(viewProgram: ViewProgram, t: T): U {
        // console.log('Visiting ViewProgram');
        viewProgram.componentUsages.forEach(componentInstantiation => {
            componentInstantiation.accept(this, t);
        });
        return null as U;
    }

    visitComponentUsage(componentUsage: ComponentUsage, t: T): U {
        // we shouldn't ever hit this
        console.error('Unexpected path - Visiting ComponentUsage');
        return null as U;
    }

    // ------------- Main -------------

    visitMainProgram(mainProgram: MainProgram, t: T): U {
        // console.log('Visiting MainProgram');
        const definition = mainProgram.definition;
        definition.accept(this, t);

        const views = mainProgram.views;
        views.forEach(view => view.accept(this, t));

        return null as U;
    }
}