const config = require('../../config/constants')
const hasValue = require('./validators/has-value')
const isValidObject = require('./validators/is-valid-object')
const isValidJSON = require('./validators/is-valid-json')

module.exports = (req, res, err, elapsed) => ({
  conversationId: req.headers[config.HEADER_CONVERSATION_ID.toLowerCase()],
  responsaTS: req.headers[config.HEADER_RESPONSA_TS.toLowerCase()],
  clientTS: res.getHeader(config.HEADER_CLIENT_TS),
  requestBody: isValidObject(req.body) ? req.body : {},
  requestHasBody: isValidObject(req.body),
  requestIsHttps: req.protocol === 'https',
  requestContentLength: req.headers['content-length'] ? req.headers['content-length'] : 0,
  requestContentType: req.headers['content-type'] ? req.headers['content-type'] : '',
  requestQueryString: isValidObject(req.query) ? req.query : {},
  requestQueryStringHasValue: isValidObject(req.query),
  requestHeaders: req.headers,
  requestHeadersCount: req.headers.length,
  responseBody: hasValue(res.payload) ? (isValidJSON(res.payload) ? JSON.parse(res.payload) : { payload: res.payload }) : {},
  responseHasBody: hasValue(res.payload),
  requestMethod: req.method,
  requestPath: req.url,
  statusCode: res.statusCode,
  elapsed: elapsed || 0,
  exceptionMessage: err ? err.message : '',
  exceptionStackTrace: err ? err.stack : ''
})
