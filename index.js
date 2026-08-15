module.exports = function (app) {
  const plugin = {
    id: 'bad-schema',
    name: 'Bad Schema (CI fixture)',
    schema: function () {
      throw new Error('intentional schema() failure for CI fixture testing')
    },
    start: function () {
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
