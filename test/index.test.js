const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('build only ran once, centrally — prepare did not double it', () => {
  const count = fs.readFileSync(path.join(__dirname, '..', 'build-count.txt'), 'utf8').trim()
  const tracePath = path.join(__dirname, '..', 'build-trace.log')
  if (fs.existsSync(tracePath)) {
    console.log('--- build-trace.log ---')
    console.log(fs.readFileSync(tracePath, 'utf8'))
    console.log('--- end build-trace.log ---')
  }
  assert.strictEqual(
    count,
    '1',
    `expected build.js to have run exactly once (via build-command), got ${count} — ` +
      'this means "prepare" also ran, i.e. some install step in the pipeline dropped --ignore-scripts'
  )
})
