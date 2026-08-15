#!/usr/bin/env node
// Triggers every fixture branch's CI run, waits for all of them to
// complete, and prints a table comparing each run's actual conclusion
// against its expected one (fixtures.json) — some fixtures are SUPPOSED
// to fail, so "red" isn't automatically a problem.
//
// Usage: node scripts/run-all.js
// Requires: gh CLI (authenticated). Run from anywhere in a checkout of
// main — fixtures.json only exists there.
//
// Note: this is Node, not bash, deliberately — macOS ships bash 3.2 by
// default, which doesn't support associative arrays (declare -A) at all;
// it silently mis-parses the syntax instead of erroring, which would
// have made an earlier bash version of this script quietly corrupt data
// on exactly the platform this repo's own CI matrix tests against.
//
// Known gap: this only checks each run's overall conclusion. A few
// fixtures (see any "note" field in fixtures.json) can't be fully
// verified this way — e.g. an advisory-only check that warns but never
// fails will always show "success" whether or not the warning still
// fires. Read the notes; a green run isn't automatically a green fixture.

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const REPO = 'jaffadog/plugin-ci-fixtures'
const POLL_INTERVAL_MS = 30000
const MAX_WAIT_MS = 40 * 60 * 1000

const manifestPath = path.join(__dirname, '..', 'fixtures.json')
if (!fs.existsSync(manifestPath)) {
  console.error(`fixtures.json not found at ${manifestPath} (are you on main?)`)
  process.exit(1)
}
const fixtures = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log('=== Triggering all fixture branches ===')
  for (const { branch } of fixtures) {
    console.log(`  -> ${branch}`)
    gh(['workflow', 'run', 'signalk-ci.yml', '--repo', REPO, '--ref', branch])
  }

  console.log('\nWaiting 15s for runs to register...')
  await sleep(15000)

  console.log('\n=== Collecting run IDs ===')
  const runIds = {}
  for (const { branch } of fixtures) {
    let id = null
    for (let attempt = 0; attempt < 5 && !id; attempt++) {
      const out = gh(['run', 'list', '--repo', REPO, '--branch', branch, '--limit', '1', '--json', 'databaseId']).trim()
      const parsed = JSON.parse(out)
      if (parsed.length > 0) id = parsed[0].databaseId
      else await sleep(5000)
    }
    if (!id) {
      console.error(`  ${branch} -> FAILED TO FIND A RUN`)
      continue
    }
    runIds[branch] = id
    console.log(`  ${branch} -> run ${id}`)
  }

  console.log(`\n=== Waiting for all runs to complete (polling every ${POLL_INTERVAL_MS / 1000}s) ===`)
  const conclusions = {}
  let pending = Object.keys(runIds)
  const start = Date.now()
  while (pending.length > 0 && Date.now() - start < MAX_WAIT_MS) {
    const stillPending = []
    for (const branch of pending) {
      const id = runIds[branch]
      const status = JSON.parse(gh(['run', 'view', String(id), '--repo', REPO, '--json', 'status']).trim()).status
      if (status === 'completed') {
        const conclusion = JSON.parse(
          gh(['run', 'view', String(id), '--repo', REPO, '--json', 'conclusion']).trim()
        ).conclusion
        conclusions[branch] = conclusion
        console.log(`  done: ${branch} (${conclusion})`)
      } else {
        stillPending.push(branch)
      }
    }
    pending = stillPending
    if (pending.length > 0) await sleep(POLL_INTERVAL_MS)
  }
  for (const branch of pending) conclusions[branch] = 'TIMEOUT'

  console.log('\n=== Results ===')
  const pad = (s, n) => String(s).padEnd(n)
  console.log(pad('BRANCH', 42) + pad('EXPECTED', 10) + pad('ACTUAL', 10) + 'RESULT')
  let overallOk = true
  for (const { branch, expected } of fixtures) {
    const actual = conclusions[branch] || 'MISSING'
    const result = actual === expected ? 'OK' : 'MISMATCH'
    if (result === 'MISMATCH') overallOk = false
    console.log(pad(branch, 42) + pad(expected, 10) + pad(actual, 10) + result)
  }

  console.log('')
  for (const f of fixtures) {
    if (f.note) console.log(`NOTE (${f.branch}): ${f.note}`)
  }

  console.log('')
  if (overallOk) {
    console.log('All fixtures matched their expected conclusion.')
    process.exit(0)
  } else {
    console.log('One or more fixtures did NOT match — see MISMATCH rows above.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
