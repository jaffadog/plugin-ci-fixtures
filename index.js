module.exports = function (app) {
  const plugin = {
    id: 'malicious-postinstall',
    name: 'Malicious Postinstall (CI fixture)',
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
