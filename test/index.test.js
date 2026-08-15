const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('postinstall never executed anywhere in this pipeline', () => {
  const markerPath = path.join(__dirname, '..', 'postinstall-ran.marker')
  assert.strictEqual(
    fs.existsSync(markerPath),
    false,
    'postinstall ran and wrote its marker file — some install step in the pipeline did not honor --ignore-scripts'
  )
})
