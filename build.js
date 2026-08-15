// Simulates a real build step (e.g. tsc/vite) while leaving a trail: every
// time this runs, it increments build-count.txt. A plugin's own "prepare"
// script runs on a bare `npm install`, so if any install step in the
// pipeline drops --ignore-scripts, this fires an extra time on top of the
// pipeline's own explicit build-command invocation.
const fs = require('fs')
const path = require('path')

const counterPath = path.join(__dirname, 'build-count.txt')
const current = parseInt(fs.readFileSync(counterPath, 'utf8').trim() || '0', 10)
fs.writeFileSync(counterPath, String(current + 1))

// Diagnostic trail (temporary): record exactly where/when each invocation
// happened, since the counter alone doesn't say which install step it
// came from.
const tracePath = path.join(__dirname, 'build-trace.log')
const line = `[${new Date().toISOString()}] cwd=${process.cwd()} __dirname=${__dirname} npm_lifecycle_event=${process.env.npm_lifecycle_event} npm_config_argv=${process.env.npm_config_argv || ''}\n`
fs.appendFileSync(tracePath, line)
