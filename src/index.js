/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/stationeers-mips';
import {stationeerMIPSGenerator} from './generators/stationeers-mips';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
//Object.assign(stationeerMIPSGenerator.forBlock, forBlock);
//Object.assign(stationeerMIPSGenerator.define, )

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output').firstChild;
const blocklyDiv = document.getElementById('blocklyDiv');
const ic10emuBtn = document.getElementById('ic10emu-button');
//const ws = Blockly.inject(blocklyDiv, {toolbox, renderer: 'Zelos'});
const ws = Blockly.inject(blocklyDiv, {toolbox});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  stationeerMIPSGenerator.reset();
  const code = stationeerMIPSGenerator.workspaceToCode(ws);
  codeDiv.innerText = stationeerMIPSGenerator.generateFrontMatter();
  codeDiv.innerText += code;
  codeDiv.innerText += stationeerMIPSGenerator.generateBackMatter();

  outputDiv.innerText = stationeerMIPSGenerator._log;

  ic10encode( codeDiv.innerText );
};

async function ic10encode( code ) {
  const ic10context = {
    "name": "Code from MIPSly",
    "date": new Date().toISOString(),
    "session": {
      "vm": {
        "ics": [
            {
                "device": 1,
                "id": 2,
                "registers": Array(18).fill(55),
                "ip": 0,
                "ic": 1,
                "stack": Array(511).fill(0),
                "aliases": {},
                "defines": {},
                "pins": Array(6).fill(null),
                "state": "Start",
                "code": code
            }
        ],
        "devices": [
          {
            "id": 1,
            "prefab_name": "StructureCircuitHousing",
            "slots": [
              {
                "typ": "ProgrammableChip",
                "occupant": { "id": 2, "fields": {} }
              }
            ],
            "connections": [
              { "CableNetwork": { "net": 1, "typ": "Data" } },
              { "CableNetwork": { "typ": "Power" } }
            ],
            "fields": {}
          }
        ],
        "networks": [
          {
            "id": 1,
            "devices": [ 1 ],
            "power_only": [],
            "channels": Array(8).fill(null)
          }
        ],
        "default_network": 1
      },
      "activeIC": 1
    }
  };

  const compressed = arrayBufferToBase64(await compress(JSON.stringify(ic10context), 'gzip'));

  // Convert and compress for ic10emu :)
  ic10emuBtn.href="https://ic10emu.dev/#" + compressed;
}

function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

function compress(string, encoding) {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray, encoding) {
  const cs = new DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
  });
}

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});


// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()) {
    return;
  }
  runCode();
});
