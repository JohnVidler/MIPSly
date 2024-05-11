import * as Blockly from 'blockly';
import { LOGIC_COMPONENTS, getPrefabIndex } from '../stationpedia';

export const Order = {
    ATOMIC: 0
};

export const Type = {
    Number: "Number",
    Boolean: "Boolean",
    PortAction: "PORT_ACTION",
    Sound: "ENUM_SOUND"
};

const REGISTERS = [
    "r0", "r1","r2", "r3", "r4",
    "r5", "r6", "r7", "r8", "r9",
    "r10", "r11", "r12", "r13", "r14",
    "r15"
];

const PORTS = [ "d0", "d1", "d2", "d3", "d4", "d5", "db" ];

let aliasList = {}
let defineList = {}
let functionList = {}

let pinnedRegisters = [];
function getTempRegister() {
    for( let reg in REGISTERS ) {
        if( !pinnedRegisters.includes( REGISTERS[reg] ) )
            return REGISTERS[reg];
    }
    console.warn( "# ERR: SORRY! RAN OUT OF REGISTERS :(" );
    return undefined;
}
function pinRegister( reg ) {
    if( pinnedRegisters.includes( reg ) )
        return false
    pinnedRegisters.push( reg );

    return true;
}
function unPinRegister( reg ) {
    const index = pinnedRegisters.indexOf( reg )

    if( index > -1 ) {
        pinnedRegisters.splice( index, 1 );
        return true;
    }
    return false;
}

let labelList = [];
function genLabel() {
    const label = `L${labelList.length}`;
    labelList.push( label );
    return label;
}

function genDefineSymbol() {
    let index = 0;
    while( Object.keys(defineList).find( v => v == `G${index}` ) )
        index++;
    return `G${index}`;
}

function isAlias( alias ) {
    if( aliasList[alias] )
        return true;
    return false;
}

function isDefined( name ) {
    for( let key of Object.keys(defineList) ) {
        if( defineList[key] == name )
            return key;
    }
    return undefined;
}

function isPort( input ) {
    return (PORTS.indexOf(input) > -1 );
}

function isRegister( input ) {
    return (REGISTERS.indexOf(input) > -1 );
}

function resolveAlias( alias, depth = 0 ) {
    if( depth > 100 ) {
        console.warn( "Too much alias recursion! Stopping at the 100th iteration." );
        return alias;
    }

    if( aliasList[alias] )
        return resolveAlias( aliasList[alias], depth + 1 )

    return alias;
}

export const mipsGenerator = new Blockly.Generator('stationeersMIPS');

mipsGenerator.log = function( line ) {
    this._log += line + "\n";
}

mipsGenerator.generateFrontMatter = function() {
    const output = [];

    if( Object.keys(aliasList).length > 0 && !this.NO_ALIAS ) {
        output.push( "# ALIASES #" )
        for( const key in aliasList ) {
            output.push( `alias ${key} ${aliasList[key]}` );
            this.log( `${key} = ${aliasList[key]}` );
        }
    }
    
    if( Object.keys(defineList).length > 0 ) {
        output.push( "\n# DEFINITIONS #" )
        for( const key in defineList )
            output.push( `define ${key} ${defineList[key]}` );
    }

    if( output.length > 0 )
        output.push( "\n# CODE #\n" );

    return output.join('\n');
}

mipsGenerator.generateBackMatter = function() {
    output = [];

    if( Object.keys(functionList).length > 0 ) {
        output.push( "\n\n# FUNCTIONS #" )
        for( const key in functionList )
            output.push( `${functionList[key]}` );
    }

    return output.join('\n');
}

mipsGenerator.reset = function() {
    // Reset the generator entirely

    this.INDENT = "";
    this.NO_ALIAS = false;

    this._log = "";

    pinnedRegisters = [];
    aliasList = {};
    defineList = {};
    functionList = {};
    labelList = [];
}

mipsGenerator.serialiseCode = function( code ) {
    console.log( typeof code );

    if( typeof code == "object" ) {
        if( Array.isArray(code) )
            return code.join( '\n' )

        return `# Raw Context: ${JSON.stringify(code)} #`;
    }

    if( typeof code == "boolean" )
        return code?'1':'0';

    return `${code}`;
}

mipsGenerator.scrub_ = function( block, code, thisOnly ) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const prevBlock = block.previousConnection && block.previousConnection.targetBlock();
    const outputConnection = block.outputConnection && block.outputConnection.targetBlock();

    if( !outputConnection )
        code = this.serialiseCode( code );

    if (nextBlock && !thisOnly)
        return [
            code,
            this.serialiseCode( mipsGenerator.blockToCode( nextBlock ) )
        ].join( '\n' );

    return code;
};

mipsGenerator.forBlock['define'] = function( block, generator ) {
    const name = block.getFieldValue( "NAME" ) || "??";
    const port = block.getFieldValue( "PORT" ) || "??";

    if( pinRegister( port ) )
        aliasList[ name ] = port;

    return "";
}

mipsGenerator.forBlock['function'] = function( block, generator ) {
    const name = block.getFieldValue( 'FUNCTION_NAME' ) || "function";
    const statements = generator.statementToCode( block, 'MEMBERS' );

    const code = [
        `${name}:`,
        'push ra',
        statements,
        'pop ra',
        'j ra'
    ].join("\n");

    functionList[name] = code;
    labelList.push( name );

    return null;
}

mipsGenerator.forBlock['call'] = function( block, generator ) {
    const name = block.getFieldValue( 'FUNCTION_NAME' ) || "function"
    return `jal ${name}`;
}

mipsGenerator.forBlock['forever'] = function( block, generator ) {
    const output = [];
    const label = genLabel();
    const statements = generator.statementToCode( block, 'MEMBERS' );

    output.push( `${label}:` );
    output.push( statements );
    output.push( `j ${label}` );

    return output.join( "\n" )
}

/*mipsGenerator.forBlock['yield'] = function( block, generator ) {
    const SCRATCH_REGS = 6
    const output = []

    for( let i=0; i<SCRATCH_REGS; i++ )
        output.push( `push r${i}` );

    // Schedule here...

    for( let i=SCRATCH_REGS-1; i>-1; i-- )
        output.push( `push r${i}` );

    return output.join('\n');
}*/

mipsGenerator._conditionalShim = function( condition, falseLabel ) {
    // checks here!
    let [readable, preamble] = loaderShim( condition );
    if( preamble ) {
        const preambleLines = preamble.split("\n");
        const lastLine = preambleLines[preambleLines.length - 1];

        // Is this a 'store-compare' line? If so, mangle it into a branch!
        let branchLine = `${lastLine}`.split(' ');
        if( ["seq", "sne", "slt", "sle", "sgt", "sge" ].includes(branchLine[0]) ) {
            
            preambleLines.splice(-1);

            // Note - branch logic here is flipped, as we're SKIPPING if these are true.
            // This is an extremely minor optimisation, as it lets us save a label
            // for the actual if-true branch, and simply fails over the inner code
            // if required.
            
            branchLine[0] = {
                "seq": "bne",
                "sne": "beq",
                "slt": "bge",
                "sle": "bgt",
                "sgt": "ble",
                "sge": "blt"
            }[branchLine[0]];

            branchLine.splice( 1, 1 );
            branchLine.push( falseLabel );

            preambleLines.push( branchLine.join(" ") );
        }
        else // Implicit 'branch if true'
            preambleLines.push( `bne ${readable} 1 ${falseLabel}` );
        
        preamble = preambleLines.join("\n");
    }

    return [readable, preamble];
}

mipsGenerator.forBlock['if'] = function( block, generator ) {
    const output = [];
    const falseLabel = genLabel();
    const condition  = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    const [readable, preamble] = mipsGenerator._conditionalShim( condition, falseLabel )
    if( preamble )
        output.push( preamble );

    output.push( generator.statementToCode( block, 'MEMBERS' ) );
    output.push( `${falseLabel}:` )
    return output.join( "\n" );
}

mipsGenerator.forBlock['if-else'] = function( block, generator ) {
    const output = [];
    const falseLabel = genLabel();
    const skipLabel  = genLabel();
    const condition        = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    const [readable, preamble] = mipsGenerator._conditionalShim( condition, falseLabel )
    if( preamble )
        output.push( preamble );
    
    output.push( generator.statementToCode( block, 'TRUE_MEMBERS' ) );
    output.push( `j ${skipLabel}` );
    output.push( `${falseLabel}:` );
    output.push( generator.statementToCode( block, 'FALSE_MEMBERS' ) );
    output.push( `${skipLabel}:` );
    return output.join( "\n" );
}

mipsGenerator.forBlock['while'] = function( block, generator ) {
    const output = [];
    const loopLabel = genLabel();
    const falseLabel = genLabel();
    const condition  = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    output.push( `${loopLabel}:` );
    const [readable, preamble] = mipsGenerator._conditionalShim( condition, falseLabel )
    if( preamble )
        output.push( preamble );

    output.push( generator.statementToCode( block, 'MEMBERS' ) );
    output.push( `j ${loopLabel}` );
    output.push( `${falseLabel}:` );
    return output.join( "\n" );
}

mipsGenerator.forBlock['repeat'] = function( block, generator ) {
    const output = [];
    const loopLabel = genLabel();
    const falseLabel = genLabel();
    const iterations  = generator.valueToCode( block, "ITERATIONS", Order.ATOMIC );

    let counter = getTempRegister()
    pinRegister( counter );

    output.push( `move ${counter} ${iterations}` );
    output.push( `${loopLabel}:` ); 
    output.push( `beqz ${counter} ${falseLabel}` );
    output.push( generator.statementToCode( block, 'MEMBERS' ) );
    output.push( `sub ${counter} ${counter} 1` );
    output.push( `j ${loopLabel}` );
    output.push( `${falseLabel}:` );
    return output.join( "\n" );
}

mipsGenerator.forBlock['condition'] = function( block, generator ) {
    const output = [];
    const lvalue     = generator.valueToCode( block, "LVALUE", Order.ATOMIC ) || "0";
    const rvalue     = generator.valueToCode( block, "RVALUE", Order.ATOMIC ) || "0";
    const operator   = block.getFieldValue( 'OPERATOR' ) || "EQUAL"

    const [lReadable, lPreamble] = loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = getTempRegister();
    pinRegister( result );

    switch( operator ) {
        case "EQUAL":
            output.push( `seq ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "NOT_EQUAL":
            output.push( `sne ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "LESS_THAN":
            output.push( `slt ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "LESS_OR_EQUAL":
            output.push( `sle ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "GREATER_THAN":
            output.push( `sgt ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "GREATER_OR_EQUAL":
            output.push( `sge ${result} ${lReadable} ${rReadable}` );
            break;
        
        default:
            this._log += `Unknown operator in conditional: ${operator}\n`
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['arithmetic'] = function( block, generator ) {
    const output = [];
    const lvalue     = generator.valueToCode( block, "LVALUE", Order.ATOMIC ) || "0";
    const rvalue     = generator.valueToCode( block, "RVALUE", Order.ATOMIC ) || "0";
    const operator   = block.getFieldValue( 'OPERATOR' ) || "ADD"

    const [lReadable, lPreamble] = loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = getTempRegister();
    pinRegister( result );

    switch( operator ) {
        case "ADD":
            output.push( `add ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "SUB":
            output.push( `sub ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "DIV":
            output.push( `div ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "MOD":
            output.push( `mod ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "MUL":
            output.push( `mul ${result} ${lReadable} ${rReadable}` );
            break;
        
        default:
            this._log += `Unknown operator in arithmetic: ${operator}\n`
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['bitwise-ops'] = function( block, generator ) {
    const output = [];
    const lvalue     = generator.valueToCode( block, "LVALUE", Order.ATOMIC ) || "0";
    const rvalue     = generator.valueToCode( block, "RVALUE", Order.ATOMIC ) || "0";
    const operator   = block.getFieldValue( 'OPERATOR' ) || "and"

    const [lReadable, lPreamble] = loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = getTempRegister();
    pinRegister( result );

    switch( operator ) {
        case "and":
            output.push( `and ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "or":
            output.push( `or ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "nor":
            output.push( `nor ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "xor":
            output.push( `xor ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "nand":
            output.push( `and ${result} ${lReadable} ${rReadable}` );
            output.push( `seqz ${result} ${result}` );
            break;
        
        default:
            this._log += `Unknown operator in bitwise operation: ${operator}\n`
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['minmax'] = function( block, generator ) {
    const output = [];
    const lvalue     = generator.valueToCode( block, "LVALUE", Order.ATOMIC ) || "0";
    const rvalue     = generator.valueToCode( block, "RVALUE", Order.ATOMIC ) || "0";
    const operator   = block.getFieldValue( 'OPERATOR' ) || "MIN"

    const [lReadable, lPreamble] = loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = getTempRegister();
    pinRegister( result );

    switch( operator ) {        
        case "MIN":
            output.push( `min ${result} ${lReadable} ${rReadable}` );
            break;
        
        case "MAX":
            output.push( `max ${result} ${lReadable} ${rReadable}` );
            break;
        
        default:
            this._log += `Unknown operator in conditional: ${operator}\n`
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['port-state'] = function( block, generator ) {
    const output = [];

    const port  = block.getFieldValue( 'PORT' ) || "d0";
    const state = block.getFieldValue( 'STATE' ) || "connected";

    const result = getTempRegister();
    pinRegister( result );

    switch( state ) {
        case "connected":
            output.push( `sdse ${result} ${port}` );
            break;
        
        case "disconnected":
            output.push( `sdns ${result} ${port}` );
            break;
    }

    return [ output.join("\n"), Order.ATOMIC ];
}

mipsGenerator.forBlock['set'] = function( block, generator ) {
    const output = [];
    let dest  = block.getFieldValue( "DEST" );
    const source  = generator.valueToCode( block, "SOURCE", Order.ATOMIC ) || "0";

    const predefined = isAlias( dest );
    dest = resolveAlias( dest );

    const [readable, preamble] = loaderShim( source );
    if( preamble ) {
        output.push( preamble );
        unPinRegister( readable );
    }

    // Is this a literal register?
    if( REGISTERS.indexOf(dest) > -1 ) {
        pinRegister( dest );
        if( dest != readable )
            output.push( `move ${dest} ${readable}` )
        return output.join('\n');
    }

    // Check the alias table, do we already have a reg?
    if( isAlias(dest) ) {
        dest = resolveAlias( dest );
    }

    // Otherwise we're creating a variable, so grab a spare reg
    const reg = getTempRegister();
    pinRegister( reg );

    aliasList[ dest ] = reg;
    if( reg != readable )
        output.push( `move ${reg} ${readable}` )
    return output.join('\n');
}

mipsGenerator.forBlock['get'] = function( block, generator ) {
    let source = block.getFieldValue( "SOURCE" );

    //const predefined = isAlias( source );
    source = resolveAlias( source );

    return [ source, Order.ATOMIC ];
}

mipsGenerator.forBlock['wait'] = () => "yield";
mipsGenerator.forBlock['sleep'] = function ( block, generator ) {
    const output = []
    let time = generator.valueToCode( block, "TIME", Order.ATOMIC ) || "1";

    const [readable, preamble] = loaderShim( time );
    if( preamble )
        output.push( preamble );
    unPinRegister( readable );

    output.push( `sleep ${readable}` );

    return output.join("\n")
}
mipsGenerator.forBlock['explode'] = () => "hcf # Boom :)";

mipsGenerator.forBlock["math_number"] = function( block, generator ) {
    return [
        `${block.getFieldValue( 'NUM' )}`,
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["logic_boolean"] = function( block, generator ) {
    return [
        block.getFieldValue( 'BOOL' ) === "TRUE" ? '1' : '0',
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["read"] = function( block, generator ) {
    const prop = block.getFieldValue( 'PROPERTY' );
    const port = block.getFieldValue( 'PORT' );

    const reg = getTempRegister();
    if( reg == undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    pinRegister( reg );

    return [
        `l ${reg} ${port} ${prop}`,
        Order.ATOMIC
    ];
}

mipsGenerator.forBlock["read-batch"] = function( block, generator ) {
    const operation = block.getFieldValue( 'OPERATION' );
    const prop      = block.getFieldValue( 'PROPERTY' );
    let   hash      = block.getFieldValue( 'HASH' );

    const reg = getTempRegister();
    if( reg == undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    pinRegister( reg );

    // Is this hash not known?
    if( !isDefined( `HASH("${hash}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = isDefined( `HASH("${hash}")` ); // Number

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

    const reg = getTempRegister();
    if( reg == undefined )
        return "# ERR: SORRY! RAN OUT OF REGISTERS :(";
    pinRegister( reg );

    // Is this hash not known?
    if( !isDefined( `HASH("${hash}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = isDefined( `HASH("${hash}")` ); // Number

    // Is this hash not known?
    if( !isDefined( `HASH("${name}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${name}")`;
        name = symbol;
    }
    else
        name = isDefined( `HASH("${name}")` ); // Number

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

    const [readable, preamble] = loaderShim( source );
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
    if( !isDefined( `HASH("${hash}")` ) ) {

        if( !Object.keys(LOGIC_COMPONENTS).includes( hash ) )
            output.push( "# Warn: Unknown prefab name" );

        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = isDefined( `HASH("${hash}")` ); // Number

    const [readable, preamble] = loaderShim( source );
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
    if( !isDefined( `HASH("${hash}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = isDefined( `HASH("${hash}")` ); // Number

    // Is this hash not known?
    if( !isDefined( `HASH("${name}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${name}")`;
        name = symbol;
    }
    else
        name = isDefined( `HASH("${name}")` ); // Number

    const [readable, preamble] = loaderShim( source );
    if( preamble )
        output.push( preamble );

    output.push( `sbn ${hash} ${name} ${prop} ${readable}` );
    return output.join("\n");
}

mipsGenerator.forBlock["color"] = ( block, _ ) => [ `${block.getFieldValue( 'COLOR' )}`, Order.ATOMIC ];

mipsGenerator.forBlock["hash"] = function( block, _ ) {
    let hash = block.getFieldValue( 'HASH' );

    // Is this hash not known?
    if( !isDefined( `HASH("${hash}")` ) ) {
        const symbol = genDefineSymbol();
        defineList[symbol] = `HASH("${hash}")`;
        hash = symbol;
    }
    else
        hash = isDefined( `HASH("${hash}")` ); // Number

    return [ `${hash}`, Order.ATOMIC ];
}

function loaderShim( input ) {
    // Is this ACTUALLY code?
    if( Number.isNaN(Number.parseFloat(input)) && !isRegister(input) && !isPort(input) ) {
        // Grab the last-pinned reg...
        const lastReg = pinnedRegisters[pinnedRegisters.length - 1]; //pinnedRegisters.pop();

        console.log( `code! ${input} -> ${lastReg}` );
        return [ lastReg, input ]
    }
    return [ input, null ]
}


mipsGenerator.forBlock['dummy'] = function( block, generator ) {
    return "# dummy #";
}