const test = require('node:test')
const assert = require('node:assert')

test('constructs and exposes the plugin contract', () => {
  const createPlugin = require('../index.js')
  const plugin = createPlugin({ setPluginStatus: () => {} })
  assert.strictEqual(typeof plugin.start, 'function')
  assert.strictEqual(typeof plugin.stop, 'function')
})
