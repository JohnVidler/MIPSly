import { mipsGenerator, Order, Type } from '../generators/stationeers-mips';

export const functionToolbox = function() {
    return {
        "kind": "category",
        "name": "Functions",
        "colour": 50,
        "contents": [
            { 'kind': 'block', 'type': 'function' },
            { 'kind': 'block', 'type': 'call' },
        ]
    };
}

mipsGenerator.forBlock['function'] = function( block, generator ) {
    const name = block.getFieldValue( 'FUNCTION_NAME' ) || "function";
    const statements = generator.statementToCode( block, 'MEMBERS' );

    // Commented out for now as SemlerPDX complained
    /*const code = [
        `${name}:`,
        'push ra',
        statements,
        'pop ra',
        'j ra'
    ].join("\n");*/

    const code = [
        `${name}:`,
        statements,
        'j ra'
    ].join("\n");

    generator.functionList[name] = code;
    generator.labelList.push( name );

    return null;
}

mipsGenerator.forBlock['call'] = function( block, generator ) {
    const name = block.getFieldValue( 'FUNCTION_NAME' ) || "function"
    return `jal ${name}`;
}