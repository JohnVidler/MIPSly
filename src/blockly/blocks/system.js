import * as Blockly from 'blockly';
import { mipsGenerator, Order } from '../generators/stationeers-mips';

export const systemToolbox = function () {

  return {
    "kind": "category",
    "name": "System",
    "colour": 100,
    "contents": [
      { 'kind': 'block', 'type': 'wait' },
      { 'kind': 'block', 'type': 'sleep' },
      { 'kind': 'block', 'type': 'explode' },
    ]
  }
};


mipsGenerator.forBlock['wait'] = () => "yield";
mipsGenerator.forBlock['sleep'] = function ( block, generator ) {
    const output = []
    let time = generator.valueToCode( block, "TIME", Order.ATOMIC ) || "1";

    const [readable, preamble] = generator.loaderShim( time );
    if( preamble )
        output.push( preamble );
    generator.unPinRegister( readable );

    output.push( `sleep ${readable}` );

    return output.join("\n")
}
mipsGenerator.forBlock['explode'] = () => "hcf # Boom :)";