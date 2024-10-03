import { Visitor } from "../visitor";
import { ASTNode } from "./ASTNode";
import { NamedArgument } from "./NamedArgument";
import {ListValue} from "./ListValue";

/**
 * Represents the usage of a component in view file.
 * can be a ComponentInstantiation or an alias name
 * Ex: `MyText WITH t = "Like"`
 */
export abstract class ComponentUsage extends ListValue {
}