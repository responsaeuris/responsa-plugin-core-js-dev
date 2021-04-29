const stdoutFactory = require('./stdout/stdout-stream-factory')
const esFactory = require('./es/es-stream-factory')

module.exports = (opts) => {
  const streams = [{ stream: stdoutFactory() }]

  if (opts) {
    streams.push(esFactory(opts))
  }

  return streams
}
