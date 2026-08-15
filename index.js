module.exports = function (app) {
  const plugin = {
    id: 'good-plugin',
    name: 'Good Plugin (CI fixture)',
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
