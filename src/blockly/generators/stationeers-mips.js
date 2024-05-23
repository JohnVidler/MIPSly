import * as Blockly from 'blockly';
import { LOGIC_COMPONENTS } from '../stationpedia';

export const Order = {
    ATOMIC: 0,
    RUNTIME: 1
};

export const Type = {
    Number: "Number",
    Boolean: "Boolean",
    PortConnection: "PORT_CONNECTION",
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

export const mipsGenerator = new Blockly.Generator('stationeersMIPS');

mipsGenerator.aliasList = {}
mipsGenerator.defineList = {}
mipsGenerator.functionList = {}
mipsGenerator.pinnedRegisters = [];
mipsGenerator.labelList = [];

mipsGenerator.getTempRegister = function() {
    for( let reg in REGISTERS ) {
        if( !this.pinnedRegisters.includes( REGISTERS[reg] ) )
            return REGISTERS[reg];
    }
    console.warn( "# ERR: SORRY! RAN OUT OF REGISTERS :(" );
    return undefined;
}
mipsGenerator.pinRegister = function( reg ) {
    if( this.pinnedRegisters.includes( reg ) )
        return false
    this.pinnedRegisters.push( reg );

    return true;
}
mipsGenerator.unPinRegister = function( reg ) {
    const index = this.pinnedRegisters.indexOf( reg )

    if( index > -1 ) {
        this.pinnedRegisters.splice( index, 1 );
        return true;
    }
    return false;
}

mipsGenerator.genLabel = function() {
    const label = `L${this.labelList.length}`;
    this.labelList.push( [label] );
    return label;
}

mipsGenerator.genDefineSymbol = function() {
    let index = 0;
    while( Object.keys(this.defineList).find( v => v === `G${index}` ) )
        index++;
    return `G${index}`;
}

mipsGenerator.isAlias = function( alias ) {
    if( this.aliasList[alias] )
        return true;
    return false;
}

mipsGenerator.isDefined = function( name ) {
    for( let key of Object.keys(this.defineList) ) {
        if( this.defineList[key] === name )
            return key;
    }
    return undefined;
}

mipsGenerator.isPort = function( input ) {
    return (PORTS.indexOf(input) > -1 );
}

mipsGenerator.isRegister = function( input ) {
    return (REGISTERS.indexOf(input) > -1 );
}

mipsGenerator.resolveAlias = function( alias, depth = 0 ) {
    if( depth > 100 ) {
        console.warn( "Too much alias recursion! Stopping at the 100th iteration." );
        return alias;
    }

    if( this.aliasList[alias] )
        return this.resolveAlias( aliasList[alias], depth + 1 )

    return alias;
}

mipsGenerator.log = function( line ) {
    this._log += line + "\n";
}

mipsGenerator.loaderShim = function( input ) {
    // Is this ACTUALLY code?
    if( Number.isNaN(Number.parseFloat(input)) && !this.isRegister(input) && !this.isPort(input) ) {
        // Grab the last-pinned reg...
        const lastReg = this.pinnedRegisters[this.pinnedRegisters.length - 1]; //pinnedRegisters.pop();

        console.log( `code! ${input} -> ${lastReg}` );
        return [ lastReg, input ]
    }
    return [ input, null ]
}

mipsGenerator._conditionalShim = function( condition, falseLabel, generator ) {
    // checks here!
    let [readable, preamble] = generator.loaderShim( condition );
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


mipsGenerator.generateFrontMatter = function() {
    const output = [];

    if( Object.keys(this.aliasList).length > 0 && !this.NO_ALIAS ) {
        output.push( "# ALIASES #" )
        for( const key in this.aliasList ) {
            output.push( `<span title="This is an alias!">alias ${key} ${this.aliasList[key]}</span>` );
            this.log( `${key} = ${this.aliasList[key]}` );
        }
    }
    
    if( Object.keys(this.defineList).length > 0 ) {
        output.push( "\n# DEFINITIONS #" )
        for( const key in this.defineList )
            output.push( `define ${key} ${this.defineList[key]}` );
    }

    if( output.length > 0 )
        output.push( "\n# CODE #\n" );

    return output.join("\n");
}

mipsGenerator.generateBackMatter = function() {
    const output = [];

    if( Object.keys(this.functionList).length > 0 ) {
        output.push( "\n\n# FUNCTIONS #" )
        for( const key in this.functionList )
            output.push( `${this.functionList[key]}` );
    }

    return output.join('\n');
}

mipsGenerator.reset = function() {
    // Reset the generator entirely

    this.INDENT = "";
    this.NO_ALIAS = false;

    this._log = "";

    this.pinnedRegisters = [];
    this.aliasList = {};
    this.defineList = {};
    this.functionList = {};
    this.labelList = [];
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
    //const prevBlock = block.previousConnection && block.previousConnection.targetBlock();
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

    if( generator.pinRegister( port ) )
        generator.aliasList[ name ] = port;

    return "";
}





mipsGenerator.forBlock['forever'] = function( block, generator ) {
    const output = [];
    const label = generator.genLabel();
    const statements = generator.statementToCode( block, 'MEMBERS' );

    output.push( `${label}:` );
    output.push( statements );
    output.push( `j ${label}` );

    return output.join( "\n" );
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



mipsGenerator.forBlock['if'] = function( block, generator ) {
    const output = [];
    const falseLabel = generator.genLabel();
    const condition  = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    const [, preamble] = mipsGenerator._conditionalShim( condition, falseLabel, generator )
    if( preamble )
        output.push( preamble );

    output.push( generator.statementToCode( block, 'MEMBERS' ) );
    output.push( `${falseLabel}:` )
    return output.join( "\n" );
}

mipsGenerator.forBlock['if-else'] = function( block, generator ) {
    const output = [];
    const falseLabel = generator.genLabel();
    const skipLabel  = generator.genLabel();
    const condition        = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    const [, preamble] = mipsGenerator._conditionalShim( condition, falseLabel, generator )
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
    const loopLabel = generator.genLabel();
    const falseLabel = generator.genLabel();
    const condition  = generator.valueToCode( block, "CONDITION", Order.ATOMIC );

    output.push( `${loopLabel}:` );
    const [, preamble] = mipsGenerator._conditionalShim( condition, falseLabel, generator )
    if( preamble )
        output.push( preamble );

    output.push( generator.statementToCode( block, 'MEMBERS' ) );
    output.push( `j ${loopLabel}` );
    output.push( `${falseLabel}:` );
    return output.join( "\n" );
}

mipsGenerator.forBlock['repeat'] = function( block, generator ) {
    const output = [];
    const loopLabel = generator.genLabel();
    const falseLabel = generator.genLabel();
    const iterations  = generator.valueToCode( block, "ITERATIONS", Order.ATOMIC );

    let counter = generator.getTempRegister()
    generator.pinRegister( counter );

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

    const [lReadable, lPreamble] = generator.loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    generator.unPinRegister( lReadable );

    const [rReadable, rPreamble] = generator.loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    generator.unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = generator.getTempRegister();
    generator.pinRegister( result );

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

    const [lReadable, lPreamble] = generator.loaderShim( lvalue );
    if( lPreamble )
        output.push( lPreamble );
    generator.unPinRegister( lReadable );

    const [rReadable, rPreamble] = generator.loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    generator.unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = generator.getTempRegister();
    generator.pinRegister( result );

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
    generator.unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    generator.unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = generator.getTempRegister();
    generator.pinRegister( result );

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
    generator.unPinRegister( lReadable );

    const [rReadable, rPreamble] = loaderShim( rvalue );
    if( rPreamble )
        output.push( rPreamble );
    generator.unPinRegister( rReadable );

    // ... to make room for our own value, if its not already used...
    const result = generator.getTempRegister();
    generator.pinRegister( result );

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





mipsGenerator.forBlock['dummy'] = function( block, generator ) {
    return "# dummy #";
}