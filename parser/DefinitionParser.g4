parser grammar DefinitionParser;
options { tokenVocab=UILexer; }

def_program: NEWLINE* (component NEWLINE+)* component NEWLINE* (variable_definition NEWLINE+)* variable_definition? NEWLINE* EOF ;
component: BASE_COMPONENT UI_NAME COLON NEWLINE (property_assign NEWLINE)* property_assign;
property_assign: INDENT PROPERTY EQUAL (value | function | list) ;

variable_definition: component_instantiation ALIAS NAME ;
function: FUNCTION_NAME START_PARENTHESIS func_arg (COMMA func_arg)? END_PARENTHESIS ;
func_arg: (value | obj_prop | view) ;
view: UI_NAME DOT VIEW;

// Similar between View and Definition but not exactly the same
list: LIST_START (function | value) (COMMA (function | value))* LIST_END ;

// Shared between View and Definition
value: (NAME | NUMBER | STRING | BOOLEAN | arith_exp) ;
component_instantiation: UI_NAME (PARAM_PASS assignment (COMMA assignment)*)? ;
assignment: NAME EQUAL (value | list) ;
arith_exp: possible_num (ARITH_OP possible_num)+ ;
possible_num: (NUMBER | obj_prop | NAME) ;
obj_prop: UI_NAME DOT PROPERTY ;
