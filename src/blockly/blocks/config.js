import * as Blockly from 'blockly';
import { mipsGenerator, Order, Type } from '../generators/stationeers-mips';
import { PORTS } from '../ic10';
import { ENUM_LOGIC } from '../enums';

const TOOLBOX_HUE = 10;

export const configToolbox = function() {
    return {
        "kind": "category",
        "name": "Configuration",
        "colour": TOOLBOX_HUE,
        "contents": [
            { 'kind': 'block', 'type': 'ic10config' },
            { 'kind': 'block', 'type': 'ic10device' },
        ]
    };
}

// Block Definitions //
Blockly.common.defineBlocks(
    Blockly.common.createBlockDefinitionsFromJsonArray(
        [
            {
                "type": "ic10config",
                "message0": "Configure ic10\nd0 = %1\nd1 = %2\nd2 = %3\nd3 = %4\nd4 = %5\nd5 = %6",
                "args0": [
                    {
                        "type": "input_value",
                        "name": "d0",
                        "check": Type.PortConnection
                    },
                    {
                        "type": "input_value",
                        "name": "d1",
                        "check": Type.PortConnection
                    },
                    {
                        "type": "input_value",
                        "name": "d2",
                        "check": Type.PortConnection
                    },
                    {
                        "type": "input_value",
                        "name": "d3",
                        "check": Type.PortConnection
                    },
                    {
                        "type": "input_value",
                        "name": "d4",
                        "check": Type.PortConnection
                    },
                    {
                        "type": "input_value",
                        "name": "d5",
                        "check": Type.PortConnection
                    },
                ],
                "output": Type.PortConnection,
                "colour": TOOLBOX_HUE,
            },
        ]
    )
);

// State Tracking //
mipsGenerator.devices = [];
mipsGenerator.nextDeviceID = 0;

mipsGenerator.getNextDeviceId = function() {
    return ++mipsGenerator.nextDeviceID;
}


// Code Generators //
mipsGenerator.forBlock['ic10config'] = function( block, generator ) {
    block.data = generator.getNextDeviceId();
    return [ '...config...' ].join("\n");
};