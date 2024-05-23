import { useState } from 'react';
import './App.css';
import BlocklyEditor from './components/BlocklyEditor';

function App() {
  const [getTab, setTab] = useState<number>( 0 );
  const [jsonInternals, setJsonInternals] = useState<string>( "" );
  const [ic10Sharelink, setIC10Sharelink] = useState<string>( "" );
  const [mipsCode, setMipsCode] = useState<string>( "" );
  const [buildLog, setBuildLog] = useState<string>( "" );

  function activeTab( ref ) {
    return ( self ) => {
      setTab( ref );
    }
  }

  return (
    <div className="App h-screen w-screen flex flex-col">
      <div className="flex" id="headerContainer">
        <h1 className="font-bold text-xl">MIPSly - A Stationeers MIPS Blockly Editor</h1>
        <div id="extra"></div>
        <div className="last light">
          Version: <span id="git-branch">{__GIT_BRANCH__}</span>/<span id="git-hash">{__GIT_HASH__}</span>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted ml-4 mr-auto">
        <a onClick={activeTab(0)} role="tab" className={getTab == 0 ? "tab tab-active font-bold" : "tab"}>Code Editor</a>
        <a onClick={activeTab(1)} role="tab" className={getTab == 1 ? "tab tab-active font-bold" : "tab"}>Configuration</a>
        <a onClick={activeTab(2)} role="tab" className={getTab == 2 ? "tab tab-active font-bold" : "tab"}>Internals and Debug</a>
      </div>

      {getTab == 0 && (
        <div className="grow flex flex-row tabContent">
          <div className="basis-1/4 p-4">
            <h3>Generated Code</h3>
            <div className="code-render"><code><pre>{mipsCode}</pre></code></div>
            <a className="button ml-auto mr-auto inline-block" id="ic10emu-button" href={ic10Sharelink} target="_blank">Open in ic10emu.dev!</a>

            <h3>Extra Build Information</h3>
            <div id="output"><code>{buildLog}</code></div>
          </div>
          <BlocklyEditor dataHook={setJsonInternals} ic10URL={setIC10Sharelink} codeHook={setMipsCode} />
        </div>
      )}

      {getTab == 1 && (
        <div className="grow flex flex-row tabContent">
          <p>This is content for TAB 2!</p>
        </div>
      )}

      {getTab == 2 && (
        <div className="grow flex flex-row tabContent">
          {jsonInternals && (<pre className="text-xs font-mono text-wrap">{ JSON.stringify(JSON.parse(jsonInternals),null,2) }</pre>)}
          {ic10Sharelink && (<pre className="text-xs font-mono text-wrap">{ ic10Sharelink }</pre>)}
        </div>
      )}

    </div>
  );
}

export default App;

/*
<div id="outputPane">
                <h3>Generated Code</h3>
                <div className="code-render" dangerouslySetInnerHTML={codeMarkup}></div>

                <div className="center">
                    <a className="button" id="ic10emu-button" href={ic10Link} target="_blank">Open in ic10emu.dev!</a>
                </div>

                <h3>Extra Build Information</h3>
                <div id="output"><code>{getLog}</code></div>
            </div>*/