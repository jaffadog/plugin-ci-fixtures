module.exports = function (app) {
  const plugin = {
    id: 'stray-files',
    name: 'Stray Files (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      app.setPluginStatus('Started')
    },
    stop: function () {}
  }

  return plugin
}
