# UI Design Language

## Getting Started

1. Have Node.js 16.17.0 or higher installed on your machine
2. Install dependencies: ```npm install```

### Generate parser files
  - ```npm run gen``` - Generate all lexer and parser files
  - or:
    - ```npm run gen-lexer``` - Generate lexer for all files
    - ```npm run gen-def-parser``` - Generate parser for `.def` files
    - ```npm run gen-view-parser``` - Generate parser for `.view` files

If using the ANTLR4 VS Code extension, the generated files will also be appear in `parser/.antlr`.

