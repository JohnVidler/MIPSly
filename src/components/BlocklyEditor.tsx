'use client';

import { useState, useEffect } from 'react';
import * as Blockly from 'blockly';
import { BlocklyWorkspace } from 'react-blockly';
import { save, load, read } from '../blockly/serialization';
import { ic10encode } from '../blockly/integrations/ic10emu';
import { blocks } from '../blockly/blocks/stationeers-mips';
import { mipsGenerator } from '../blockly/generators/stationeers-mips';

import MIPSCodeNode, { resetSpans } from '../blockly/generators/MIPSCodeNode';
import MIPSCodeBlock from '../blockly/generators/MIPSCodeBlock'
import MIPSComment from '../blockly/generators/MIPSComment'

// New Format Block Components //
import { configToolbox } from '../blockly/blocks/config';
import { basicToolbox } from '../blockly/blocks/basic.js';
import { functionToolbox } from '../blockly/blocks/functions';
import { ioToolbox } from '../blockly/blocks/io';
import { logicToolbox } from '../blockly/blocks/logic';
import { loopsToolbox } from '../blockly/blocks/loops';
import { systemToolbox } from '../blockly/blocks/system';
import { soundToolbox } from '../blockly/blocks/sound';

const toolbox = {
    'kind': 'categoryToolbox',
    'contents': [
        /*{ 'kind': 'block', 'type': 'object' },
        { 'kind': 'block', 'type': 'member' },*/
        basicToolbox(),
        
        ioToolbox(),
        logicToolbox(),
        loopsToolbox(),
        systemToolbox(),

        { 'kind': 'sep', 'cssConfig': { "container": "h-10" } },
      
        configToolbox(),
        functionToolbox(),
        soundToolbox(),
        
    ]
};

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);

type LogHook  = (code: string) => void
type DataHook = (code: string) => void
type CodeHook = (code: string) => void
type NodeHook = (root: MIPSCodeNode) => void
type IC10URL  = (url: string) => void

interface EditorProps {
    dataHook: DataHook | undefined,
    codeHook: CodeHook | undefined,
    nodeHook: NodeHook | undefined,
    ic10URL:  IC10URL | undefined,
    logHook:  LogHook | undefined,
}

export function BlocklyEditor( props: EditorProps) {
    const [getCode,  setCode]     = useState<string>();

    function runCode( workspace ) {
        try {
            resetSpans();
            mipsGenerator.reset();
            const code = mipsGenerator.workspaceToCode(workspace);
            const frontMatter = mipsGenerator.generateFrontMatter();
            const backMatter = mipsGenerator.generateBackMatter();

            const finalCode = [frontMatter, code, backMatter]

            const root = new MIPSCodeBlock();
            root.children.push( new MIPSComment("This is just a test") );
            root.children.push( new MIPSComment("This is just a test 2.0") );
            
            const inner = new MIPSCodeBlock();
            inner.children.push( new MIPSComment("This is a newer scope") );
            root.children.push( inner );

            //setCode( root.getHTML() );
            const mips = root.getMIPS();

            if( props.codeHook )
                props.codeHook( finalCode.join("\n") );
            if( props.logHook )
                props.logHook( mipsGenerator._log );

            /*if( props.ic10URL )
                ic10encode( props.ic10URL );*/

            return mips;
        } catch( err ) {
            console.error( "Caught!" );
            console.error( err );
        }
    }

    function onInject( workspace ) {
        // Set up UI elements and inject Blockly
        
        //const ic10emuBtn = document.getElementById('ic10emu-button');
        //workspace = Blockly.inject(blocklyDiv, {toolbox, renderer: 'Zelos'});

        load( workspace );
        runCode( workspace );
    }

    function onChange( workspace ) {
        console.log("update...");
        save( workspace );

        if( props.dataHook )
            props.dataHook( read() );

        runCode( workspace );
    }

    //<!--<pre id="generatedCode"><code>{getCode}</code></pre>-->

    //const codeMarkup = { __html: getCode };
    return (
        <BlocklyWorkspace
            className="blocklyDiv" // you can use whatever classes are appropriate for your app's CSS
            toolboxConfiguration={toolbox} // this must be a JSON toolbox definition
            onWorkspaceChange={onChange}
            onInject={onInject}
        />
    );
}

export default BlocklyEditor;