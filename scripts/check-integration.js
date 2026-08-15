const fs = require('fs')
const path = require('path')

const url = process.env.SIGNALK_URL
if (!url) {
  console.error('SIGNALK_URL not set — this script must run via the signalk-integration job')
  process.exit(1)
}

// The signalk-integration job always installs the test server at this
// fixed path (mkdir -p /tmp/sk-test in plugin-ci.yml) — hardcoding it here
// is fine since this script only ever runs inside that specific harness.
const REQUIRED_PKG_NAME = 'signalk-plugin-ci-fixture-requires-cascade-dep'
const markerPath = path.join('/tmp/sk-test/node_modules', REQUIRED_PKG_NAME, 'postinstall-ran.marker')

async function main() {
  const res = await fetch(`${url}/signalk/v1/api/`)
  if (!res.ok) {
    console.error(`Unexpected status ${res.status} from ${url}`)
    process.exit(1)
  }
  console.log('Reached SignalK server OK:', url)

  if (fs.existsSync(markerPath)) {
    console.error(
      `signalk.requires dependency's postinstall ran — --ignore-scripts was not honored for it: ${markerPath}`
    )
    process.exit(1)
  }
  console.log('signalk.requires dependency installed without running postinstall — OK')
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
