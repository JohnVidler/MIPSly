import * as Blockly from 'blockly';

import { LOGIC_COMPONENTS, getPrefabIndex } from '../stationpedia';
import { mipsGenerator, Order, Type } from '../generators/stationeers-mips';
import { PORTS } from '../ic10';
import { ENUM_LOGIC } from '../enums';

const TOOLBOX_HUE = 50

export const ioToolbox = function () {

    return {
        "kind": "category",
        "name": "Input/Output",
        "colour": 300,
        "contents": [
            { 'kind': 'block', 'type': 'io-action' },
            { 'kind': 'block', 'type': 'entity-enum' },
            { 'kind': 'block', 'type': 'property-enum' },
            { 'kind': 'block', 'type': 'port-state' },

            { 'kind': 'block', 'type': 'read' },
            { 'kind': 'block', 'type': 'read-batch' },
            { 'kind': 'block', 'type': 'read-batch-named' },

            { 'kind': 'block', 'type': 'write' },
            { 'kind': 'block', 'type': 'write-batch' },
            { 'kind': 'block', 'type': 'write-batch-named' },
        ]
    };
};

// Block Definitions //
Blockly.common.defineBlocks(
    Blockly.common.createBlockDefinitionsFromJsonArray(
        [
            {
                "type": "io-action",
                "message0": "On port %1 %2",
                "args0": [
                    {
                        "type": "field_dropdown",
                        "name": "PORT",
                        "options": [ ...PORTS ]
                    },
                    {
                        "type": "input_value",
                        "name": "PORT_ACTION",
                        "check": Type.PortAction
                    },
                ],
                "previousStatement": null,
                "nextStatement": null,
                "colour": TOOLBOX_HUE,
            },
        ]
    )
);

Blockly.Blocks['entity-enum'] = {
    init: function () {
        this.appendValueInput("CONTEXT")
            .appendField("device")
            .setCheck( Type.PortAction )
            .appendField( new Blockly.FieldDropdown( this.dynamicDropdown(this) ), "ENTITY" );
        this.setOutput(true, Type.PortAction);
        this.setColour(TOOLBOX_HUE);
        this.setTooltip( "" );
        this.setHelpUrl( "" );

        this.setOnChange(function(changeEvent) {
            if (this.getInput('CONTEXT').connection.targetBlock()) {
                
                //this.setWarningText(null);
            } else {
                //this.filteredList = getPrefabIndex().sort( (a,b) => a[0].localeCompare( b[0] ) );
            }
        });
    },
    
    dynamicDropdown: (ref) => {
        return () => {
            const target = ref.getInput('CONTEXT').connection.targetBlock();

            if( target ) {
                const property = target.getFieldValue( "PROPERTY" );
                const list = [];
                
                for( const key in LOGIC_COMPONENTS ) {
                    const logicTypes = Object.keys(LOGIC_COMPONENTS[key].logic);
                    if( logicTypes.includes( property ) ) {
                        list.push( [key, key] );
                    }
                }

                return list;
            }

            return getPrefabIndex().sort( (a,b) => a[0].localeCompare( b[0] ) );
        }
    }
};

Blockly.Blocks['property-enum'] = {
    init: function () {
        this.appendValueInput("CONTEXT")
            .appendField("property")
            .setCheck( Type.PortAction )
            .appendField( new Blockly.FieldDropdown( this.dynamicDropdown(this) ), "PROPERTY" );
        this.setOutput(true, Type.PortAction);
        this.setColour(TOOLBOX_HUE);
        this.setTooltip();
        this.setHelpUrl( "" );
    },
    
    dynamicDropdown: (ref) => {
        return () => {
            const target = ref.getInput('CONTEXT').connection.targetBlock();

            if( target ) {
                const entity = target.getFieldValue( "ENTITY" );
                if( LOGIC_COMPONENTS[entity] ) {
                    const list = [];
                    
                    for( const key in LOGIC_COMPONENTS[entity].logic )
                        list.push( [key, key] );

                    return list;
                }
            }

            return ENUM_LOGIC.sort( (a,b) => a[0].localeCompare( b[0] ) );
        }
    }
};

// Code Generators //
mipsGenerator.forBlock['io-action'] = function( block, generator ) {
    const port   = block.getFieldValue( "PORT" );
    const action = generator.valueToCode( block, "PORT_ACTION", Order.ATOMIC );

    const output = [];

    for( const prop in action ) {
        if( action[prop] )
            output.push( `s ${port} ${prop} ${action[prop]}` );
    }

    return output.join( '\n' );
};

mipsGenerator.forBlock['entity-enum'] = function( block, generator ) {
    const context = generator.valueToCode( block, "CONTEXT", Order.ATOMIC ) || {};
    const entity  = block.getFieldValue( "ENTITY" );

    context['Entity'] = entity;

    return [ context, Order.ATOMIC ];
};

mipsGenerator.forBlock['property-enum'] = function( block, generator ) {
    const context = generator.valueToCode( block, "CONTEXT", Order.ATOMIC ) || {};
    const property  = block.getFieldValue( "PROPERTY" );

    context['Property'] = property;

    return [ context, Order.ATOMIC ];
};