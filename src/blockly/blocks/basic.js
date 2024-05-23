import * as Blockly from 'blockly';
import { getPrefabIndex } from '../stationpedia';
import { mipsGenerator, Order } from '../generators/stationeers-mips';

export const basicToolbox = function () {

  return {
    "kind": "category",
    "name": "Basic",
    "colour": 150,
    "contents": [
      {
        'kind': 'block',
        'type': 'define'
      },
      {
        'kind': 'block',
        'type': 'math_number',
        "colour": 100
      },
      {
        'kind': 'block',
        'type': 'logic_boolean',
        "colour": 100
      },
      { 'kind': 'block', 'type': 'color' },
      { 'kind': 'block', 'type': 'hash' },
      { 'kind': 'block', 'type': 'arithmetic' },
      { 'kind': 'block', 'type': 'bitwise-ops' },
      { 'kind': 'block', 'type': 'minmax' },
      { 'kind': 'block', 'type': 'set' },
      { 'kind': 'block', 'type': 'get' },
    ]
  }
}


Blockly.common.defineBlocks(
  Blockly.common.createBlockDefinitionsFromJsonArray(
    [
      {
        "type": "hash",
        "message0": "the prefab hash for %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "HASH",
            "options": getPrefabIndex().filter( v => v[1].startsWith("Structure") )
          }
        ],
        "output": "Number",
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
              ["Blue", "0"],
              ["Grey", "1"],
              ["Green", "2"],
              ["Orange", "3"],
              ["Red", "4"],
              ["Yellow", "5"],
              ["White", "6"],
              ["Black", "7"],
              ["Brown", "8"],
              ["Khaki", "9"],
              ["Pink", "10"],
              ["Purple", "11"],
              ["Borple", "12"]
            ]
          },
        ],
        "output": "Number",
        "colour": 130,
      }
    ]
  )
);

mipsGenerator.forBlock["color"] = (block, _) => [`${block.getFieldValue('COLOR')}`, Order.ATOMIC];

mipsGenerator.forBlock["hash"] = function (block, gen) {
  let hash = block.getFieldValue('HASH');

  // Is this hash not known?
  if (!gen.isDefined(`HASH("${hash}")`)) {
    const symbol = gen.genDefineSymbol();
    gen.defineList[symbol] = `HASH("${hash}")`;
    hash = symbol;
  }
  else
    hash = gen.isDefined(`HASH("${hash}")`); // Number

  return [`${hash}`, Order.ATOMIC];
}