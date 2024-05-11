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
      <BlocklyEditor />
    </div>
  );
}

export default App;
