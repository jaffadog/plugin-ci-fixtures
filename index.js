const bcrypt = require('bcrypt')

module.exports = function (app) {
  const plugin = {
    id: 'native-required',
    name: 'Native Required (CI fixture)',
    schema: {
      type: 'object',
      properties: {}
    },
    start: function () {
      app.setPluginStatus('Started, sample hash: ' + bcrypt.hashSync('test', 4))
    },
    stop: function () {}
  }

  return plugin
}
