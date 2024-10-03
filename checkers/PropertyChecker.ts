import {BaseVisitor} from "../visitor";
import {
    BooleanConstant,
    FunctionCall, List,
    NumberConstant,
    PropertyAssignment,
    StringConstant,
    Variable
} from "../ast";
import {StringWriter} from "../utils/StringWriter";
import {ASTNode} from "../ast/ASTNode";

/**
 * Checks whether the value passed to a property has expected type and value
 */
export class PropertyChecker extends BaseVisitor<StringWriter, void> {

    private expectedTypes: Record<string, any[]> = {
        "color": [StringConstant, Variable],
        "backgroundcolor": [StringConstant, Variable],
        "width": [StringConstant, NumberConstant, Variable],
        "height": [StringConstant, NumberConstant, Variable],
        "visible": [BooleanConstant, Variable],
        "border": [StringConstant, Variable],
        "borderstyle": [StringConstant],
        "bordercolor": [StringConstant, Variable],
        "borderwidth": [StringConstant, NumberConstant, Variable],
        "fontstyle": [StringConstant],
        "fontsize": [StringConstant, NumberConstant, Variable],
        "gap": [StringConstant, NumberConstant, Variable],
        "padding": [StringConstant, NumberConstant, Variable],
        "direction": [StringConstant],
        "alignment": [StringConstant],

        "onclick": [FunctionCall, List, Variable],
        "url": [StringConstant, Variable],
        "alt": [StringConstant, Variable],
        "disabled": [BooleanConstant, Variable],
        "checked": [BooleanConstant, Variable],
        "value": [StringConstant, Variable],

        "text": [StringConstant, Variable],
    }

    private expectedStringValues: Record<string, string[]> = {
        "direction": ["row", "column"],
        "alignment": ["left", "center", "right"],
        "fontstyle": ["bold", "underline", "italic"],
        "borderstyle": ["dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "none", "hidden"]
    }
    visitPropertyAssignment(propertyAssign: PropertyAssignment, t: StringWriter): void {
        const propertyName = propertyAssign.property.name;
        if (propertyName in this.expectedTypes) {
            const match = this.expectedTypes[propertyName]
                .find(type => propertyAssign.value instanceof type);
            if (match === undefined) {
                t.write(`- Unexpected value type for property '${propertyName}'.\n`);
                return;
            }
        }

        // Assumes that properties with expectedStringValues are only of type StringConstant
        if (propertyName in this.expectedStringValues) {
            const match = this.expectedStringValues[propertyName]
                .find(val => (propertyAssign.value as StringConstant).value === val);
            if (match === undefined) {
                t.write(`- Unexpected value for property '${propertyName}'.\n`);
                return;
            }
        }
    }
}