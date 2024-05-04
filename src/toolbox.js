const functionToolbox = {
  "kind": "category",
  "name": "Functions",
  "colour": 50,
  "contents": [
    { 'kind': 'block', 'type': 'function' },
    { 'kind': 'block', 'type': 'call' },
  ]
};

const internalsToolbox = {
  "kind": "category",
  "name": "Other",
  "colour": 100,
  "contents": [
    { 'kind': 'block', 'type': 'wait' },
    { 'kind': 'block', 'type': 'sleep' },
    { 'kind': 'block', 'type': 'explode' },
  ]
};

const basicToolbox = {
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
    { 'kind': 'block', 'type': 'arithmetic' },
    { 'kind': 'block', 'type': 'minmax' },
    { 'kind': 'block', 'type': 'set' },
    { 'kind': 'block', 'type': 'get' },
  ]
};

const loopsToolbox = {
  "kind": "category",
  "name": "Loops",
  "colour": 200,
  "contents": [
    { 'kind': 'block', 'type': 'while' },
    { 'kind': 'block', 'type': 'repeat' },
    { 'kind': 'block', 'type': 'forever' },
  ]
};

const logicToolbox = {
  "kind": "category",
  "name": "Logic",
  "colour": 250,
  "contents": [
    { 'kind': 'block', 'type': 'logic_boolean' },
    { 'kind': 'block', 'type': 'condition' },
    { 'kind': 'block', 'type': 'if' },
    { 'kind': 'block', 'type': 'if-else' },
  ]
};

const ioToolbox = {
  "kind": "category",
  "name": "Input/Output",
  "colour": 300,
  "contents": [
    { 'kind': 'block', 'type': 'port-state' },

    { 'kind': 'block', 'type': 'read' },
    { 'kind': 'block', 'type': 'read-batch' },
    { 'kind': 'block', 'type': 'read-batch-named' },

    { 'kind': 'block', 'type': 'write' },
    { 'kind': 'block', 'type': 'write-batch' },
    { 'kind': 'block', 'type': 'write-batch-named' },
  ]
};

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    /*{
      'kind': 'block',
      'type': 'object'
    },
    {
      'kind': 'block',
      'type': 'member'
    },*/

    basicToolbox,
    loopsToolbox,
    logicToolbox,
    internalsToolbox,
    ioToolbox,
    functionToolbox,
  ]
}