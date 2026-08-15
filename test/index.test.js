const test = require('node:test')
const assert = require('node:assert')
const createPlugin = require('../dist/index.js')

test('constructs and exposes the plugin contract from the vite-built output', () => {
  const plugin = createPlugin({ setPluginStatus: () => {} })
  assert.strictEqual(typeof plugin.start, 'function')
  assert.strictEqual(typeof plugin.stop, 'function')
})
