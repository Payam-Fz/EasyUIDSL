import { ASTNode } from "../ast/ASTNode";

export class VariableMap {
    private environment: Map<string, number>;
    private memory: Map<number, ASTNode | undefined>;
    private memptr: number;

    constructor() {
        this.environment = new Map<string, number>();
        this.memory = new Map<number, ASTNode | undefined>();
        this.memptr = 0;
    }

    private getFreshLocation(): number {
        const loc = this.memptr;
        this.memptr += 1;
        return loc;
    }

    getVariable(name: string): ASTNode | undefined {
        const location = this.environment.get(name);
        if (location !== undefined) {
            return this.memory.get(location);
        }
        return undefined; // or throw an error if the variable does not exist
    }

    defineVariable(name: string): void {
        const location = this.getFreshLocation();
        this.environment.set(name, location);
        this.memory.set(location, undefined); // Assuming null is a placeholder for uninitialized variables
    }

    storeVariable(name: string, node: ASTNode): void {
        if (!this.environment.has(name)) {
            throw new Error(`Trying to store to an undefined variable '${name}'.`);
        }
        const location: number = this.environment.get(name)!;
        this.memory.set(location, node);
    }

    defineAndStoreVariable(name: string, node: ASTNode): void {
        const loc = this.defineVariable(name);
        this.storeVariable(name, node);
    }

    hasVariable(name: string): boolean {
        const loc = this.environment.get(name);
        if (loc !== undefined) {
            return this.memory.get(loc) !== undefined;
        }
        return false;
    }
}






// map<name, int> environment
// map<int, AST object> memory

//     private Integer getFreshLocation() {
//         Integer loc = memptr;
//         memptr = memptr + 1;
//         return loc;
//     }

// getVariable(name): AST Node -> a function that returns AST class corresponding to the variable
// createVariable(name): void
// storeVariable(name, AST Node): void -> store AST class in memory : environment.put(d.getName(), location); memory.put(location, null);

// example:
// location = getFreshLocation();
//  // declare variable (no initialisation yet; you might also prefer a default initialisation)
//


