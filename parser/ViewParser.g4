parser grammar ViewParser;
options { tokenVocab=UILexer; }

view_program: NEWLINE* (component_usage NEWLINE+)* component_usage NEWLINE* EOF ;
component_usage: NAME | component_instantiation ;

// Similar between View and Definition
// Used for containers that have already declared aliased variables
list: LIST_START value (COMMA value)* LIST_END ;

// Shared between View and Definition
value: (NAME | NUMBER | STRING | BOOLEAN | arith_exp) ;
component_instantiation: UI_NAME (PARAM_PASS assignment (COMMA assignment)*)? ;
assignment: NAME EQUAL (value | list) ;
arith_exp: possible_num (ARITH_OP possible_num)+ ;
possible_num: (NUMBER | obj_prop | NAME) ;
obj_prop: UI_NAME DOT PROPERTY ;
