import { ASTNode } from "./ASTNode";

/**
 * Represents a one of several things:
 * - `Constant` - an atomic value that is known statically
 * - `Variable` - a variable whose value may not be known statically
 * - `ArithExpression` - an expression whose value will be computed dynamically
 * - `List` - a list of component variables or function calls
 * - `ViewReference` - a reference to a user defined view
 */
export abstract class Value extends ASTNode {
}