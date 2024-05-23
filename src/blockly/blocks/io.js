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

mipsGenerator.forBlock['port-state'] = function( block, generator ) {
    const output = [];

    const port  = block.getFieldValue( 'PORT' ) || "d0";
    const state = block.getFieldValue( 'STATE' ) || "connected";

    const result = generator.getTempRegister();
    generator.pinRegister( result );

    switch( state ) {
        case "connected":
            output.push( `sdse ${result} ${port}` );
            break;
        
        case "disconnected":
            output.push( `sdns ${result} ${port}` );
            break;

        default:
            output.push( `#!! Unknown state: ${state} !!#` )
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['set'] = function( block, generator ) {
    const output = [];
    let dest  = block.getFieldValue( "DEST" );
    const source  = generator.valueToCode( block, "SOURCE", Order.ATOMIC ) || "0";

    generator.isAlias( dest );
    dest = generator.resolveAlias( dest );

    const [readable, preamble] = loaderShim( source );
    if( preamble ) {
        output.push( preamble );
        generator.unPinRegister( readable );
    }

    // Is this a literal register?
    if( REGISTERS.indexOf(dest) > -1 ) {
        generator.pinRegister( dest );
        if( dest !== readable )
            output.push( `move ${dest} ${readable}` )
        return output.join('\n');
    }

    // Check the alias table, do we already have a reg?
    if( generator.isAlias(dest) ) {
        dest = generator.resolveAlias( dest );
    }

    // Otherwise we're creating a variable, so grab a spare reg
    const reg = generator.getTempRegister();
    generator.pinRegister( reg );

    generator.aliasList[ dest ] = reg;
    if( reg !== readable )
        output.push( `move ${reg} ${readable}` )
    return output.join('\n');
}

mipsGenerator.forBlock['get'] = function( block, generator ) {
    let source = block.getFieldValue( "SOURCE" );

    //const predefined = isAlias( source );
    source = generator.resolveAlias( source );

    return [ source, Order.ATOMIC ];
}

mipsGenerator.forBlock["read"] = function( block, generator ) {
    const prop = block.getFieldValue( 'PROPERTY' );
    const port = block.getFieldValue( 'PORT' );

    const reg = generator.getTempRegister();
    if( reg === undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    generator.pinRegister( reg );

    return [
        `l ${reg} ${port} ${prop}`,
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["read-batch"] = function( block, generator ) {
    const operation = block.getFieldValue( 'OPERATION' );
    const prop      = block.getFieldValue( 'PROPERTY' );
    let   hash      = block.getFieldValue( 'HASH' );

    const reg = generator.getTempRegister();
    if( reg === undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    generator.pinRegister( reg );

    // Is this hash not known?
    if( !generator.isDefined( `HASH("${hash}")` ) ) {
        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = generator.isDefined( `HASH("${hash}")` ); // Number

    return [
        `lb ${reg} ${hash} ${prop} ${operation}`,
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["read-batch-named"] = function( block, generator ) {
    const operation = block.getFieldValue( 'OPERATION' );
    const prop      = block.getFieldValue( 'PROPERTY' );
    let   hash      = block.getFieldValue( 'HASH' );
    let   name      = block.getFieldValue( 'NAME' );

    const reg = generator.getTempRegister();
    if( reg === undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    generator.pinRegister( reg );

    // Is this hash not known?
    if( !generator.isDefined( `HASH("${hash}")` ) ) {
        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = generator.isDefined( `HASH("${hash}")` ); // Number

    // Is this hash not known?
    if( !generator.isDefined( `HASH("${name}")` ) ) {
        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${name}")`;
        name = symbol;
    }
    else
        name = generator.isDefined( `HASH("${name}")` ); // Number

    return [
        `lbn ${reg} ${hash} ${name} ${prop} ${operation}`,
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["write"] = function( block, generator ) {
    const output = [];

    const source  = generator.valueToCode( block, 'SOURCE', Order.ATOMIC ) || 0;
    const prop = block.getFieldValue( 'PROPERTY' );
    const port = block.getFieldValue( 'PORT' );

    const [readable, preamble] = generator.loaderShim( source );
    if( preamble )
        output.push( preamble );

    output.push( `s ${port} ${prop} ${readable}` );
    return output.join("\n");
}

//sb deviceHash logicType r?
mipsGenerator.forBlock["write-batch"] = function( block, generator ) {
    const output = [];

    const source  = generator.valueToCode( block, 'SOURCE', Order.ATOMIC ) || 0;
    const prop    = block.getFieldValue( 'PROPERTY' );
    let   hash    = block.getFieldValue( 'HASH' );
    
    // Is this hash not known?
    if( !generator.isDefined( `HASH("${hash}")` ) ) {

        if( !Object.keys(LOGIC_COMPONENTS).includes( hash ) )
            output.push( "# Warn: Unknown prefab name" );

        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = generator.isDefined( `HASH("${hash}")` ); // Number

    const [readable, preamble] = generator.loaderShim( source );
    if( preamble )
        output.push( preamble );

    output.push( `sb ${hash} ${prop} ${readable}` );
    return output.join("\n");
}

//sbn deviceHash nameHash logicType r?
mipsGenerator.forBlock["write-batch-named"] = function( block, generator ) {
    const output = [];

    const source  = generator.valueToCode( block, 'SOURCE', Order.ATOMIC ) || 0;
    const prop    = block.getFieldValue( 'PROPERTY' );
    let   hash    = block.getFieldValue( 'HASH' );
    let   name    = block.getFieldValue( 'NAME' );

    // Is this hash not known?
    if( !generator.isDefined( `HASH("${hash}")` ) ) {
        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${hash}")`;
        
        hash = symbol;
    }
    else
        hash = generator.isDefined( `HASH("${hash}")` ); // Number

    // Is this hash not known?
    if( !generator.isDefined( `HASH("${name}")` ) ) {
        const symbol = generator.genDefineSymbol();
        generator.defineList[symbol] = `HASH("${name}")`;
        name = symbol;
    }
    else
        name = generator.isDefined( `HASH("${name}")` ); // Number

    const [readable, preamble] = generator.loaderShim( source );
    if( preamble )
        output.push( preamble );

    output.push( `sbn ${hash} ${name} ${prop} ${readable}` );
    return output.join("\n");
}