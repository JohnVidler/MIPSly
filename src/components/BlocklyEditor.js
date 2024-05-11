'use client';

import { useState } from 'react';
import * as Blockly from 'blockly';
import { BlocklyWorkspace } from 'react-blockly';
import { IC10Configurator } from './IC10Configurator';
import { save, load } from '../blockly/serialization';
import { ic10encode } from '../blockly/integrations/ic10emu';
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
    const [getCode,  setCode]     = useState();
    const [getLog,   setLog]      = useState();
    const [ic10Link, setIC10Link] = useState();

    function runCode( workspace ) {
        mipsGenerator.reset();
        const code = mipsGenerator.workspaceToCode(workspace);
        const frontMatter = mipsGenerator.generateFrontMatter();
        const backMatter = mipsGenerator.generateBackMatter();

        const finalCode = [frontMatter, code, backMatter].join('\n');

        setCode( finalCode );
        setLog( mipsGenerator._log );
        ic10encode( finalCode, setIC10Link );
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
        <div id="pageContainer">
            <div id="outputPane">
                <IC10Configurator />
                <h3>Generated Code</h3>
                <pre id="generatedCode"><code>{getCode}</code></pre>
                <div className="center">
                    <a className="button" id="ic10emu-button" href={ic10Link} target="_blank">Open in ic10emu.dev!</a>
                </div>

                <h3>Extra Build Information</h3>
                <div id="output"><code>{getLog}</code></div>
            </div>
            <BlocklyWorkspace
                className="blocklyDiv" // you can use whatever classes are appropriate for your app's CSS
                toolboxConfiguration={toolbox} // this must be a JSON toolbox definition
                onWorkspaceChange={onChange}
                onInject={onInject}
            />
        </div>
    );
}