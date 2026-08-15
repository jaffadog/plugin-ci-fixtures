const test = require('node:test')
const assert = require('node:assert')
const entryExport = require('../index.js')

test('entry point deliberately exports a plain object, not a constructor function', () => {
  assert.strictEqual(typeof entryExport, 'object')
})
