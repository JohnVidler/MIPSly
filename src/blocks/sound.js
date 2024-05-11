import * as Blockly from 'blockly';

import { LOGIC_COMPONENTS } from '../stationpedia';
import { mipsGenerator, Order, Type } from '../generators/stationeers-mips';
import { ENUM_SOUND } from '../enums';

// Toolbox //
export const soundToolbox = function() {

    return {
        "kind": "category",
        "name": "Speakers / Klaxons",
        "colour": 100,
        "contents": [
            { 'kind': 'block', 'type': 'sound-enum' },
            { 'kind': 'block', 'type': 'sound-play' },
        ]
    };
};

// Block Definitions //
Blockly.common.defineBlocks(
    Blockly.common.createBlockDefinitionsFromJsonArray(
        [
            {
                "type": "sound-enum",
                "message0": "📢 %1",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "SOUND",
                        "options": ENUM_SOUND.map( v => [ `${v[0]}`,`${v[1]}` ] )
                    },
                ],
                "output": Type.Sound,
                "colour": 230,
            },
        ]
    )
);

Blockly.Blocks['sound-play'] = {
    init: function () {
        this.appendValueInput("SOUND")
            .setCheck(["ENUM_SOUND", "Number"])
            .appendField("play sound");
        this.appendValueInput("VOLUME")
            .setCheck("Number")
            .appendField("at volume");
        this.setInputsInline(true);
        this.setOutput(true, Type.PortAction);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


// Code Generators //
mipsGenerator.forBlock['sound-play'] = function( block, generator ) {
    const sound  = generator.valueToCode( block, "SOUND", Order.ATOMIC ) || undefined;
    const volume = generator.valueToCode( block, "VOLUME", Order.ATOMIC );

    return [
        {
            "Volume": volume,
            "Mode": sound,
        },
        Order.ATOMIC
    ];
};

mipsGenerator.forBlock['sound-enum'] = function( block, generator ) {
    return [ block.getFieldValue( "SOUND" ) || 0, Order.ATOMIC ];
};