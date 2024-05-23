import * as Blockly from 'blockly';
import { getPrefabIndex } from '../stationpedia';
import { REGISTERS, PORTS, CONDITIONS, OPERATORS, GROUP_OPS } from '../ic10';

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
                { "type": "input_value", "name": "LVALUE" },
                {
                    "type": "field_dropdown",
                    "name": "OPERATOR",
                    "options": [
                        [ "AND", "and" ],
                        [ "NAND", "nand" ],
                        [ "OR", "or" ],
                        [ "NOR", "nor" ],
                        [ "XOR", "xor" ]
                    ]
                },
                { "type": "input_value", "name": "RVALUE" },
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
                {
                    "type": "input_value",
                    "name": "HASH",
                    "shadow": {  // This is the important bit!
                        "type": "text",  // The rest is just a normal block definition
                        "fields": {
                            "TEXT": "abc"
                        }
                    }
                },
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
                {
                    "type": "field_dropdown",
                    "name": "HASH",
                    "options": getPrefabIndex().filter( v => v[1].startsWith("Structure") )
                },
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
    ]
);