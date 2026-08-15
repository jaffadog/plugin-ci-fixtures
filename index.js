// Deliberately not wrapped in try/catch — a real plugin declaring bcrypt
// optional but requiring it unconditionally like this would crash on
// install via the App Store (--ignore-scripts means bcrypt's native
// binding never gets compiled there).
const bcrypt = require('bcrypt')

module.exports = function (app) {
  const plugin = {
    id: 'native-optional-broken',
    name: 'Native Optional Broken (CI fixture)',
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
