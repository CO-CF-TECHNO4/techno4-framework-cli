import path from 'path';
import fs from 'fs';

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, '../www');

const localCore = path.resolve(__dirname, '../../../TECHNO4FRAMEWORK2/packages/techno4-framework2-core');
const localDom64 = path.resolve(__dirname, '../../../TECHNO4FRAMEWORK2/packages/techno4-framework2-dom64');

const alias = {
  '@': SRC_DIR,
};
if (fs.existsSync(localCore)) {
  alias['techno4/css'] = path.resolve(localCore, 'dist/techno4.bundle.css');
  alias['techno4'] = path.resolve(localCore, 'dist/techno4.esm.js');
}
if (fs.existsSync(localDom64)) {
  alias.dom64 = path.resolve(localDom64, 'package/dom64.esm.js');
}


export default {
  plugins: [],
  root: SRC_DIR,
  base: '/',
  publicDir: PUBLIC_DIR,
  build: {
    outDir: BUILD_DIR,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    rollupOptions: {
      treeshake: false,
    },
  },
  resolve: {
    alias,
  },
  server: {
    host: true,
  },
};
