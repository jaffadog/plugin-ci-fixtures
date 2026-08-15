module.exports = function (app) {
  const plugin = {
    id: 'bad-lifecycle',
    name: 'Bad Lifecycle (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      app.setPluginStatus('Started')
    },
    stop: function () {
      // Not one of the "mock gap" patterns (e.g. "X is not a function",
      // "Cannot read propert...") the lifecycle check downgrades to a
      // warning — this is meant to read as a genuine plugin bug.
      throw new Error('intentional stop() failure for CI fixture testing')
    }
  }

  return plugin
}
