/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/stationeers-mips';
import {stationeerMIPSGenerator} from './generators/stationeers-mips';
import {ic10encode} from './integrations/ic10emu';
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
const runCode = () => {
  stationeerMIPSGenerator.reset();
  const code = stationeerMIPSGenerator.workspaceToCode(ws);
  codeDiv.innerText = stationeerMIPSGenerator.generateFrontMatter();
  codeDiv.innerText += code;
  codeDiv.innerText += stationeerMIPSGenerator.generateBackMatter();

  outputDiv.innerText = stationeerMIPSGenerator._log;

  ic10encode( codeDiv.innerText, ic10emuBtn );
};



// Setup any static values in the source... not ideal, but whatever.
document.getElementById('git-hash').innerText = __GIT_HASH__;
document.getElementById('git-branch').innerText = __GIT_BRANCH__;

const extra_links = [];
if( __GIT_BRANCH__ == "dev" ) {
  extra_links.push( "<a href='https://github.com/JohnVidler/MIPSly/issues' target='_blank'>Bug Tracker</a>" );
  extra_links.push( " :: " );
  extra_links.push( "<a href='https://github.com/JohnVidler/MIPSly' target='_blank'>Help With Development</a>" );
  extra_links.push( " :: " );
  extra_links.push( "<a href='https://johnvidler.co.uk/mips'>Stable Mode</a>" );
}
else {
  extra_links.push( "<a href='https://johnvidler.github.io/MIPSly/'>Development Mode</a>" );
}
document.getElementById('extra').innerHTML = extra_links.join('\n');


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
