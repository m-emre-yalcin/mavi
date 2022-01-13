// Default server configuration
const $config = require('../../config')

module.exports = function (config) {
  return new Promise((resolve, reject) => {
    if (!config) {
      reject(new Error('config is not defined'))
    }

    // assign default configs if not provided
    for (const key in $config) {
      if (!config[key]) config[key] = $config[key]
    }

    // check missing configs:

    if (!config.api) {
      reject(new Error('config.api is not defined'))
    }

    // assign default api configs if not provided
    for (const key in $config.api) {
      switch (key) {
        case 'static':
          // include default static path by default
          // *default static path includes a welcome screen
          if (config.api["static"]) config.api["static"] = $config.api["static"].concat(config.api["static"])
        default:
          // assign default api configs if not provided
          if (!config.api[key]) config.api[key] = $config.api[key]
      }

      if (!config.api[key]) config.api[key] = $config.api[key]
    }

    if (!config.api.base) {
      reject(new Error('config.api.base is not defined'))
    }

    if (!config.api.routes) {
      reject(new Error('config.api.routes is not defined'))
    }

    if (typeof config.api.routes !== 'object') {
      throw new Error('config.api.routes must be an object')
    }

    if (!config.api.define) {
      reject(new Error('config.api.define is not defined'))
    }

    if (!config.api.static) {
      reject(new Error('config.api.static is not defined'))
    }

    for (const static of config.api.static) {
      if (!(static.fullpath || static.folder)) {
        reject(new Error('config.api.static > invalid static options'))
      }
    }

    if (!config.database) {
      reject(new Error('config.database is not defined'))
    }

    if (config.database && !(config.database.development || config.database.production)) {
      reject(new Error('config.database is invalid'))
    }

    resolve(config)
  })
}