import * as Blockly from 'blockly';

const REGISTERS = [
    [ "r0", "r0" ],
    [ "r1", "r1" ],
    [ "r2", "r2" ],
    [ "r3", "r3" ],
    [ "r4", "r4" ],
    [ "r5", "r5" ],
    [ "r6", "r6" ],
    [ "r7", "r7" ],
    [ "r8", "r8" ],
    [ "r9", "r9" ],
    [ "r10", "r10" ],
    [ "r11", "r11" ],
    [ "r12", "r12" ],
    [ "r13", "r13" ],
    [ "r14", "r14" ],
    [ "r15", "r15" ],
    [ "ra", "ra" ],
    [ "sp", "sp" ],
];

const PORTS = [
    [ "d0", "d0" ],
    [ "d1", "d1" ],
    [ "d2", "d2" ],
    [ "d3", "d3" ],
    [ "d4", "d4" ],
    [ "d5", "d5" ],
    [ "db", "db" ],
];

const CONDITIONS = [
    [ "is equal to", "EQUAL" ],
    [ "is not equal to", "NOT_EQUAL" ],
    [ "is less than", "LESS_THAN" ],
    [ "is less than or equal to", "LESS_OR_EQUAL" ],
    [ "is greater than", "GREATER_THAN" ],
    [ "is greater or equal to", "GREATER_OR_EQUAL" ],
];

const OPERATORS = [
    [ "+", "ADD" ],
    [ "-", "SUB" ],
    [ "/", "DIV" ],
    [ "%", "MOD" ],
    [ "x", "MUL" ]
];

const GROUP_OPS = [
    [ "Average", "0" ],
    [ "Sum",     "1" ],
    [ "Minimum", "2" ],
    [ "Maximum", "3" ],
];

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
    [
        /*{
            "type": "object",
            "message0": "Example { %1 %2 }",
            "args0": [
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "output": null,
            "colour": 230,
        },
        {
            "type": "member",
            "message0": "MEMBER %1 %2 %3",
            "args0": [
                { "type": "field_input", "name": "MEMBER_NAME", "text": "" },
                { "type": "field_label", "name": "COLON", "text": ":" },
                { "type": "input_value", "name": "MEMBER_VALUE" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
        },*/

        {
            "type": "function",
            "message0": "Function %1 { %2 %3 }",
            "args0": [
                { "type": "field_input", "name": "FUNCTION_NAME", "text": "example" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "colour": 50,
        },

        {
            "type": "call",
            "message0": "call function %1",
            "args0": [
                {
                    "type": "field_input",
                    "name": "FUNCTION_NAME",
                    "text": "example"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 50,
        },

        {
            "type": "wait",
            "message0": "wait 1 cycle",
            "previousStatement": null,
            "nextStatement": null,
            "colour": 100,
        },

        /*{
            "type": "yield",
            "message0": "yield",
            "previousStatement": null,
            "nextStatement": null,
            "colour": 100,
        },*/

        {
            "type": "define",
            "message0": "define %1 = %2",
            "args0": [
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "name"
                },
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": [
                        ...REGISTERS,
                        ...PORTS
                    ]
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 150,
        },

        {
            "type": "explode",
            "message0": "explode",
            "previousStatement": null,
            "nextStatement": null,
            "colour": 100,
        },

        {
            "type": "sleep",
            "message0": "sleep for %1 seconds",
            "args0": [
                { "type": "input_value", "name": "TIME" },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 100,
        },

        {
            "type": "forever",
            "message0": "repeat forever %1 %2",
            "args0": [
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "previousStatement": null,
            "colour": 130,
        },

        {
            "type": "while",
            "message0": "repeat while %1 %2 %3",
            "args0": [
                { "type": "input_value", "name": "CONDITION" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "repeat",
            "message0": "repeat %1 times %2 %3",
            "args0": [
                { "type": "input_value", "name": "ITERATIONS" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "if",
            "message0": "if %1 then %2 %3",
            "args0": [
                { "type": "input_value", "name": "CONDITION" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "MEMBERS" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "if-else",
            "message0": "if %1 then %2 %3 else %4 %5",
            "args0": [
                { "type": "input_value", "name": "CONDITION" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "TRUE_MEMBERS" },
                { "type": "input_dummy" },
                { "type": "input_statement", "name": "FALSE_MEMBERS" }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "condition",
            "message0": "%1 %2 %3",
            "args0": [
                { "type": "input_value", "name": "LVALUE" },
                {
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [ ...CONDITIONS ]
                },
                { "type": "input_value", "name": "RVALUE" },
            ],
            "inputsInline": true,
            "output": "BOOL",
            "colour": 130,
        },

        {
            "type": "arithmetic",
            "message0": "%1 %2 %3",
            "args0": [
                { "type": "input_value", "name": "LVALUE" },
                {
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [ ...OPERATORS ]
                },
                { "type": "input_value", "name": "RVALUE" },
            ],
            "inputsInline": true,
            "output": "Number",
            "colour": 35,
        },

        {
            "type": "bitwise-ops",
            "message0": "%1 %2 %3",
            "args0": [
                [ "AND", "and" ],
                [ "NAND", "nand" ],
                [ "OR", "or" ],
                [ "NOR", "nor" ],
                [ "XOR", "xor" ]
            ],
            "inputsInline": true,
            "output": "Number",
            "colour": 35,
        },

        {
            "type": "minmax",
            "message0": "the %1 of %2 and %3",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [
                        ["larger", "MAX"],
                        ["smaller", "MIN"],
                    ]
                },
                { "type": "input_value", "name": "LVALUE" },
                { "type": "input_value", "name": "RVALUE" },
            ],
            "output": "Number",
            "colour": 35,
        },

        {
            "type": "port-state",
            "message0": "port %1 %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": [ ...PORTS ]
                },
                {
                    "type": "field_dropdown",
                    "name": "STATE",
                    "options": [
                        [ "connected", "connected" ],
                        [ "disconnected", "disconnected" ],
                    ]
                },
            ],
            "inputsInline": true,
            "output": "Number",
            "colour": 130,
        },

        {
            "type": "set",
            "message0": "set %1 to %2",
            "args0": [
                { "type": "field_input", "name": "DEST", "text": "name" },
                { "type": "input_value", "name": "SOURCE" },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "get",
            "message0": "the value of %1",
            "args0": [
                { "type": "field_input", "name": "SOURCE", "text": "name" },
            ],
            "output": "Number",
            "colour": 130,
        },

        {
            "type": "read",
            "message0": "property %1 from port %2",
            "args0": [
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": [ ...PORTS ]
                }
            ],
            "output": "Number",
            "colour": 130,
        },

        {
            "type": "read-batch",
            "message0": "the %1 %2 from %3",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "OPERATION",
                    "options": [ ...GROUP_OPS ]
                },
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                { "type": "field_input", "name": "HASH", "text": "device" },
            ],
            "output": "Number",
            "colour": 130,
        },

        {
            "type": "read-batch-named",
            "message0": "the %1 %2 from %3 named %4",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "OPERATION",
                    "options": [ ...GROUP_OPS ]
                },
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                { "type": "field_input", "name": "HASH", "text": "device" },
                { "type": "field_input", "name": "NAME", "text": "name" },
            ],
            "output": "Number",
            "colour": 130,
        },

        {
            "type": "write",
            "message0": "set %1 on port %2 to %3",
            "args0": [
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": [ ...PORTS ]
                },
                { "type": "input_value", "name": "SOURCE" },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "write-batch",
            "message0": "set %1 on %2 to %3",
            "args0": [
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                { "type": "field_input", "name": "HASH", "text": "device" },
                { "type": "input_value", "name": "SOURCE" },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "write-batch-named",
            "message0": "set %1 on %2 named %3 to %4",
            "args0": [
                { "type": "field_input", "name": "PROPERTY", "text": "property" },
                { "type": "field_input", "name": "HASH", "text": "device" },
                { "type": "field_input", "name": "NAME", "text": "name" },
                { "type": "input_value", "name": "SOURCE" },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 130,
        },

        {
            "type": "color",
            "message0": "%1",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "COLOR",
                    "options": [
                        [ "Blue", "0" ],
                        [ "Grey", "1" ],
                        [ "Green", "2" ],
                        [ "Orange", "3" ],
                        [ "Red", "4" ],
                        [ "Yellow", "5" ],
                        [ "White", "6" ],
                        [ "Black", "7" ],
                        [ "Brown", "8" ],
                        [ "Khaki", "9" ],
                        [ "Pink", "10" ],
                        [ "Purple", "11" ],
                    ]
                },
            ],
            "output": "Number",
            "colour": 130,
        },
    ]
);