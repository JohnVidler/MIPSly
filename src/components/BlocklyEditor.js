'use client';

//import { useState } from 'react';
import * as Blockly from 'blockly';
import { BlocklyWorkspace } from 'react-blockly';
import { save, load } from '../blockly/serialization';
import { blocks } from '../blockly/blocks/stationeers-mips';
import { mipsGenerator } from '../blockly/generators/stationeers-mips';
import { toolbox } from '../blockly/toolbox';

// New Format Block Components //
import { ioToolbox } from '../blockly/blocks/io';
import { functionToolbox } from '../blockly/blocks/functions';
import { soundToolbox } from '../blockly/blocks/sound';

toolbox.contents.push( ioToolbox() );
toolbox.contents.push( functionToolbox() );
toolbox.contents.push( soundToolbox() );

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);

export function BlocklyEditor() {
    //const [xml, setXml] = useState();

    const codeDiv = document.getElementById('generatedCode').firstChild;
    const outputDiv = document.getElementById('output').firstChild;

    function runCode( workspace ) {
        console.log( "Running code!" );
        mipsGenerator.reset();
        const code = mipsGenerator.workspaceToCode(workspace);
        codeDiv.innerText = mipsGenerator.generateFrontMatter();
        codeDiv.innerText += code;
        codeDiv.innerText += mipsGenerator.generateBackMatter();

        outputDiv.innerText = mipsGenerator._log;

        console.log( code );

        //ic10encode( codeDiv.innerText, ic10emuBtn );
    };

    function onInject( workspace ) {
        console.log( "Injected workspace!" );
        console.log( workspace );

        // Set up UI elements and inject Blockly
        
        //const ic10emuBtn = document.getElementById('ic10emu-button');
        //const ws = Blockly.inject(blocklyDiv, {toolbox, renderer: 'Zelos'});*/

        load( workspace );
        runCode( workspace );
    }

    function onChange( workspace ) {
        save( workspace );

        runCode( workspace );
    }

    return (
        <BlocklyWorkspace
            className="blocklyDiv" // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={toolbox} // this must be a JSON toolbox definition
            onWorkspaceChange={onChange}
            onInject={onInject}
        />
    );
}