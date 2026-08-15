module.exports = function (app) {
  const plugin = {
    id: 'malicious-install-scripts',
    name: 'Malicious Install Scripts (CI fixture)',
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
