/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const storageKey = 'mipsly';

/**
 * Saves the state of the workspace to browser's local storage.
 * @param {Blockly.Workspace} workspace Blockly workspace to save.
 */
export const save = function(workspace) {
  const blocks = Blockly.serialization.workspaces.save(workspace);

  const data = read();
  data.program = blocks;
  write( data );

  //window.localStorage?.setItem(storageKey, JSON.stringify(data));

  return data;
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param {Blockly.Workspace} workspace Blockly workspace to load into.
 */
export const load = function(workspace) {
  //const data = window.localStorage?.getItem(storageKey);
  const blocks = read().program;
  if (!blocks) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(blocks, workspace, false);
  Blockly.Events.enable();
};


export const read = function() {
  const data = JSON.parse(window.localStorage?.getItem(storageKey));
  if (!data) return {};

  return data;
}

export const write = function( data ) {
  if (!data) return;

  window.localStorage?.setItem(storageKey, JSON.stringify(data));
}