lexer grammar UILexer;

// (DEFAULT_MODE)
BASE_COMPONENT: ('BUTTON' | 'TEXT' | 'PICTURE' | 'CHECKBOX' | 'CONTAINER' | 'TEXTINPUT');
PROPERTY: ('color' | 'backgroundcolor' | 'width' | 'height' | 'border' | 'url' | 'alt' | 'value'
    | 'visible' | 'onclick' | 'disabled' | 'checked' | 'fontsize' | 'fontstyle' | 'text'
    | 'direction' | 'alignment' | 'borderstyle' | 'bordercolor' | 'borderwidth' | 'gap' | 'padding' );
PARAM_PASS: 'WITH';
ALIAS: 'AS';
FUNCTION_NAME: ('set' | 'open') ;
VIEW: 'view' ;
BOOLEAN: ('true' | 'false') ;
NAME: [a-z] [a-zA-Z0-9_\-]* ;
UI_NAME: [A-Z] [a-zA-Z0-9]*;
COLON: ':' ;
EQUAL: '=' ;
ARITH_OP: [+\-*/];
START_PARENTHESIS: '(';
END_PARENTHESIS: ')' ;
LIST_START: '[';
LIST_END: ']' ;
DOT: '.' ;
COMMA: ',';
NEWLINE: [\n];
INDENT: ('\t' | '    ');
DEFAULT_WS: [\r ]+ -> skip;

fragment SINGLE_QUOTE_STRING: '\'' [\u0000-\u0026\u0028-\u0079]+ '\'' ;
fragment DOUBLE_QUOTE_STRING: '"' [\u0000-\u0021\u0023-\u0079]+ '"' ;
STRING: (SINGLE_QUOTE_STRING | DOUBLE_QUOTE_STRING) ;
NUMBER: [0-9]+ ;
