const fp = require('fastify-plugin')
const autoload = require('fastify-autoload')
const path = require('path')
const cache = require('./cache/cache')
const { status } = require('./routes/status/statusRoute')
const { toSingle, ResponsaSingleChoiceResource } = require('./models/singleChoice')
const { toRich, ResponsaRichMessageResource } = require('./models/richMessage')
const errorSchema = require('./models/error')
const config = require('./config/constants')
const checkHeaders = require('./filters/requiredHeaders')
const setupDocumentation = require('./documentation/setup')
const logger = require('./logger/logger')

let unrestrictedRoutes = null

const defaultOptions = {
  appName: 'Application Name',
  apiVersion: 'v1',
  esIndex: 'app-name-v1',
  servers: [
    { url: 'server1 url', description: 'server1 description' },
    { url: 'server2 url', description: 'server2 description' }
  ],
  translationsKeys: [],
  unrestrictedRoutes: []
}

const isUnrestrictedRoute = (url) => {
  const found = unrestrictedRoutes.filter((route) => url.includes(route))
  return found.length > 0
}

module.exports = fp(
  async (fastify, opts, next) => {
    const f = fastify
    const options = { ...defaultOptions, ...opts, cache }

    unrestrictedRoutes = [...['/documentation', '/status'], ...options.unrestrictedRoutes]

    f.register(autoload, {
      dir: path.join(__dirname, 'routes'),
      options: { ...opts }
    })

    f.addHook('preHandler', (request, reply, done) => {
      if (!isUnrestrictedRoute(request.url) && f.auth) {
        f.auth(request, reply, done)
      } else {
        done()
      }
    })

    f.addHook('onRequest', (request, reply, done) => {
      if (!isUnrestrictedRoute(request.url)) checkHeaders(request.headers)
      done()
    })

    f.addHook('onSend', (request, reply, payload, done) => {
      if (!isUnrestrictedRoute(request.url)) {
        if (!reply.raw.getHeader(config.HEADER_CONVERSATION_ID)) {
          reply.raw.setHeader(
            config.HEADER_CONVERSATION_ID,
            request.headers[config.HEADER_CONVERSATION_ID.toLowerCase()]
          )
        }
        if (!reply.raw.getHeader(config.HEADER_RESPONSA_TS)) {
          reply.raw.setHeader(
            config.HEADER_RESPONSA_TS,
            request.headers[config.HEADER_RESPONSA_TS.toLowerCase()]
          )
        }
        reply.raw.setHeader(config.HEADER_CLIENT_TS, Date.now())
      }
      Object.assign(reply.raw, { payload })
      done()
    })

    f.decorate('coreStatus', status)
    f.decorate('cache', cache)
    f.decorate('singleChoice', toSingle)
    f.decorate('richMessage', toRich)

    setupDocumentation(f, options)

    next()
  },
  { fastify: '3.x', name: 'responsa-plugin-core' }
)

module.exports.loggerFactory = logger
module.exports.errorSchema = errorSchema
module.exports.ResponsaSingleChoiceResource = ResponsaSingleChoiceResource
module.exports.ResponsaRichMessageResource = ResponsaRichMessageResource
