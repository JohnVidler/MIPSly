import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import * as child from 'child_process';

const gitHash   = child.execSync('git rev-parse --short HEAD').toString().trim();
const gitBranch = child.execSync('git branch --show-current').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist'
  },
  define: {
    __GIT_HASH__: JSON.stringify(gitHash),
    __GIT_BRANCH__: JSON.stringify(gitBranch),
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({ include: '**/*.svg?react' }),
  ]
})
