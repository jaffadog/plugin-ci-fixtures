const url = process.env.SIGNALK_URL

if (!url) {
  console.error('SIGNALK_URL not set — this script must run via the signalk-integration job')
  process.exit(1)
}

fetch(`${url}/signalk/v1/api/`)
  .then((res) => {
    if (!res.ok) {
      console.error(`Unexpected status ${res.status} from ${url}`)
      process.exit(1)
    }
    console.log('Reached SignalK server OK:', url)
    process.exit(0)
  })
  .catch((err) => {
    console.error('Failed to reach SignalK server:', err.message)
    process.exit(1)
  })
