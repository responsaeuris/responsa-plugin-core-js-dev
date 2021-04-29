const pinoElastic = require('pino-elasticsearch')

module.exports = (options) => ({
  stream: pinoElastic({
    index: `${options.index.toLowerCase()}-%{DATE}`,
    consistency: 'one',
    node: options.uri,
    auth: {
      username: options.user,
      password: options.password
    },
    rejectUnauthorized: false,
    'es-version': 7,
    'flush-bytes': 10
  })
})
