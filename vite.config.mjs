import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Library-mode build: bundles src/index.js (the plugin's server-side
// entry point) into dist/index.js as CommonJS, since SignalK server
// loads plugins via require(). `target: 'node18'` keeps the *output*
// syntax Node-18-safe even though Vite itself refuses to run on Node 18
// (see package.json's devDependencies — Vite's own engines.node is
// "^20.19.0 || >=22.12.0"). That split is the whole point of this
// fixture: the tool that builds the plugin needs a modern Node, but the
// plugin it produces does not.
export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      formats: ['cjs'],
      fileName: () => 'index.js'
    },
    outDir: 'dist',
    target: 'node18',
    minify: false
  }
})
