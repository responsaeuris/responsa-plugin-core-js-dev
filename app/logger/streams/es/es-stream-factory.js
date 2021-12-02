const pinoElastic = require('pino-elasticsearch')
const indexFactory = require('./es-index-factory')

module.exports = (options) => {
  const esStream = pinoElastic({
    index: indexFactory(options),
    consistency: 'one',
    node: options.uri,
    auth: { apiKey: options.apiKey },
    rejectUnauthorized: false,
    'es-version': 7,
    'flush-bytes': 10
  })

  // esStream.on('unknown', (obj) => {
  //   console.log('unknown -> ' + JSON.stringify(obj))
  // })
  // esStream.on('insertError', (obj) => {
  //   console.log('insertError -> ' + JSON.stringify(obj))
  // })
  // esStream.on('insert', (obj) => {
  //   console.log('insert -> ' + JSON.stringify(obj))
  // })
  // esStream.on('error', (obj) => {
  //   console.log('error -> ' + JSON.stringify(obj))
  // })

  return { stream: esStream }
}
