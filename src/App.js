import './App.css';
import {BlocklyEditor} from './components/BlocklyEditor';

function App() {
  return (
    <div className="App">
      <div id="headerContainer">
        <h1>MIPSly - A Stationeers MIPS Blockly Editor</h1>
        <div id="extra"></div>
        <div className="last light">
          Version: <span id="git-branch">unknown</span>/<span id="git-hash">unknown</span>
        </div>
      </div>
      <div id="pageContainer">
        <div id="outputPane">
          <p>The code generator for this tool is incomplete, and very much a work-in-progress, but it should <i>mostly</i> generate valid MIPS code.</p>
          <p>If you find this useful, consider buying me a coffee:</p>

          <h3>Generated Code</h3>
          <pre id="generatedCode"><code></code></pre>
          <div className="center">
            <a className="button" id="ic10emu-button" href="https://ic10emu.dev/" target="_blank">Open in ic10emu.dev!</a>
          </div>

          <h3>Extra Build Information</h3>
          <div id="output"><code></code></div>
        </div>
        <BlocklyEditor />
      </div>
    </div>
  );
}

export default App;
