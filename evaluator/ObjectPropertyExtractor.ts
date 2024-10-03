import {BaseVisitor} from "../visitor";
import {
    ArithExpression,
    BooleanConstant,
    ComponentDefinition,
    ComponentInstantiation, DefProgram,
    FunctionCall,
    List,
    NamedArgument, NumberConstant, ObjectPropertyValue,
    PropertyAssignment, StringConstant, Variable,
    VariableDefinition, ViewReference
} from "../ast";

// Goes through AST tree and returns all instances of ObjectProperty
export class ObjectPropertyExtractor extends BaseVisitor<void, ObjectPropertyValue[]> {

    visitDefProgram(defProgram: DefProgram, t: void): ObjectPropertyValue[] {
        let objProps: ObjectPropertyValue[] = [];
        objProps = objProps.concat(defProgram.componentDefinitions.flatMap(cd => cd.accept(this, t)));
        objProps = objProps.concat(defProgram.variableDefinitions.flatMap(vd => vd.accept(this, t)));
        return objProps;
    }

    visitComponentDefinition(componentDefinition: ComponentDefinition, t: void): ObjectPropertyValue[] {
        return componentDefinition.propertyAssignList.flatMap(pa => pa.accept(this, t));
    }

    visitVariableDefinition(variableDefinition: VariableDefinition, t: void): ObjectPropertyValue[] {
        return variableDefinition.componentInstantiation.accept(this, t);
    }

    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: void): ObjectPropertyValue[] {
        return propertyAssign.value.accept(this, t);
    }

    visitFunctionCall(func: FunctionCall, t: void): ObjectPropertyValue[] {
        return func.args.flatMap(arg => arg.accept(this, t));
    }

    visitObjectPropertyValue(objPropertyVal: ObjectPropertyValue, t: void): ObjectPropertyValue[] {
        return [objPropertyVal];
    }

    visitViewReference(viewRef: ViewReference, t: void): ObjectPropertyValue[] {
        return [];
    }

    visitVariable(variable: Variable, t: void): ObjectPropertyValue[] {
        return [];
    }
    visitNumberConstant(numberConstant: NumberConstant, t: void): ObjectPropertyValue[] {
        return [];
    }
    visitStringConstant(stringConstant: StringConstant, t: void): ObjectPropertyValue[] {
        return [];
    }
    visitBooleanConstant(stringConstant: BooleanConstant, t: void): ObjectPropertyValue[] {
        return [];
    }
    visitArithExpression(arithExpression: ArithExpression, t: void): ObjectPropertyValue[] {
        return arithExpression.terms.flatMap(term => term.accept(this, t));
    }

    visitList(list: List, t: void): ObjectPropertyValue[] {
        return list.values.flatMap(v => v.accept(this, t));
    }

    visitComponentInstantiation(componentInstantiation: ComponentInstantiation, t: void): ObjectPropertyValue[] {
        return componentInstantiation.argumentList.flatMap(na => na.accept(this, t));
    }

    visitNamedArgument(namedArg: NamedArgument, t: void): ObjectPropertyValue[] {
        return namedArg.argumentValue.accept(this, t);
    }
}
