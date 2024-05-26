import { useEffect, useState } from 'react';
import './App.css';
import { ic10encode } from './blockly/integrations/ic10emu';
import BlocklyEditor from './components/BlocklyEditor';
import { NetworkWiringTab } from './components/NetworkWiringEditor';

// Declare these up front, as they're supplied by the build, but TSC doesn't know about them :)
declare const __GIT_BRANCH__: string;
declare const __GIT_HASH__: string;

function App() {
  const [getTab, setTab] = useState<number>( 0 );
  const [jsonInternals, setJsonInternals] = useState<string>( "" );
  const [ic10Sharelink, setIC10Sharelink] = useState<string>( "" );
  const [mipsCode, setMipsCode] = useState<string>( "" );
  const [buildLog, setBuildLog] = useState<string>( "" );

  function activeTab( ref: number ) {
    return () => {
      setTab( ref );
    }
  }

  function updateLinks() {
    ic10encode( mipsCode, setIC10Sharelink );
  }
  useEffect( updateLinks, [ mipsCode ] );

/*
          <button className="btn btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
            My Projects
          </button>
*/

  return (
    <div className="App h-screen w-screen flex flex-col">
      <div className="flex flex-row space-x-2 space-y-2 ml-2 mr-2">
        <div className="grow">
          <h1 className="font-bold text-xl inline">MIPSly - A Stationeers MIPS Blockly Editor</h1>
        </div>
        <span className='light grow font-bold'>Build: {__GIT_BRANCH__}/{__GIT_HASH__}</span>

        <a className="btn btn-sm" href='https://github.com/JohnVidler/MIPSly' target='_blank'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
          </svg>
          &nbsp; Source Code
        </a>
        

        <div className="flex flex-row space-x-2">
          <a href='https://ko-fi.com/K3K8L32E3' target='_blank'><img className='h-8' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' alt='Buy Me a Coffee at ko-fi.com' /></a>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted ml-4 mr-auto">
        <a onClick={activeTab(0)} role="tab" className={getTab == 0 ? "tab tab-active" : "tab"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
          </svg>
          &nbsp; Code Editor
        </a>
        
        <a onClick={activeTab(1)} role="tab" className={getTab == 1 ? "tab tab-active" : "tab"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
          </svg>
          &nbsp; Network Wiring
        </a>
        
        <a role="tab" className={getTab == 2 ? "tab tab-active" : "tab tab-disabled"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          &nbsp; Configuration
        </a>
        
        <a onClick={activeTab(3)} role="tab" className={getTab == 3 ? "tab tab-active" : "tab"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
          </svg>
          &nbsp; Internals and Debug
        </a>
      </div>

      {getTab == 0 && (
        <div className="grow flex flex-col tabContent">
          <div className="grow flex flex-row">
            <div className="p-4 w-1/3">
              { mipsCode && (
                <div className="card">
                  <h3>Generated Code</h3>
                  <div className="code-render"><code><pre>{mipsCode}</pre></code></div>

                  <a className="btn btn-sm" id="ic10emu-button" href={ic10Sharelink} target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                    Share with ic10emu.dev!
                  </a>
                </div>
              )}

              { buildLog && (
                <div className="card">
                  <h3>Extra Build Information</h3>
                  <div id="output"><code>{buildLog}</code></div>
                </div>
              )}
            </div>
            <BlocklyEditor logHook={setBuildLog} dataHook={setJsonInternals} codeHook={setMipsCode} />
          </div>
        </div>
      )}

      {getTab == 1 && (
        <div className="grow flex flex-col tabContent p-5">
          <NetworkWiringTab />
        </div>
      )}

      {getTab == 2 && (
        <div className="grow flex flex-row tabContent p-5">
          <p>This is content for TAB 2!</p>
        </div>
      )}

      {getTab == 3 && (
        <div className="grow tabContent">
          <div className="container ml-auto mr-auto p-5">
            <p>You <i>probably</i> don't need anything on this tab unless you're reporting a bug...</p>
            <div className="flex flex-col space-y-2">
              
              {jsonInternals && (<div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-200">
                <div class="collapse-title text-xl font-medium">
                  JSON State Data
                </div>
                <div class="collapse-content">
                  <code>
                    <pre className="text-xs font-mono text-wrap">{ JSON.stringify(JSON.parse(jsonInternals),null,2) }</pre>
                  </code>
                </div>
              </div>)}

              {ic10Sharelink && (<div tabindex="1" class="collapse collapse-arrow border border-base-300 bg-base-200">
                <div class="collapse-title text-xl font-medium">
                IC10.dev Share Link Data
                </div>
                <div class="collapse-content">
                  <code>
                    <pre className="text-xs font-mono text-wrap">{ ic10Sharelink }</pre>
                  </code>
                </div>
              </div>)}
            </div>
          </div>
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