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
