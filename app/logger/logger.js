const pino = require('pino')
const pinoms = require('pino-multi-stream')
const streamsFactory = require('./streams/factory')
const filter = require('./filters/logger-filter')
const formatters = require('./formatters/logger-formatters')

module.exports = (elasticOptions) => {
  const hooks = {
    logMethod (inputArgs, method) {
      const data = filter(inputArgs)
      if (data) return method.apply(this, inputArgs)
      return null
    }
  }

  const logFormatters = {
    bindings: formatters.bindings,
    log: formatters.log
  }

  return pino(
    { level: 'info', hooks, logFormatters },
    pinoms.multistream(streamsFactory(elasticOptions))
  )
}
