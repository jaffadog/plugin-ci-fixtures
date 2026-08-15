const test = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

test('no install-time script ever executed anywhere in this pipeline', () => {
  const logPath = path.join(__dirname, '..', 'install-scripts-ran.log')
  const ran = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').trim() : ''
  assert.strictEqual(
    ran,
    '',
    `these install-time scripts ran when they should not have: [${ran.split('\n').join(', ')}] — ` +
      'some install step in the pipeline did not honor --ignore-scripts'
  )
})
