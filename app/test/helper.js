const fastify = require('fastify')
const schemas = require('../examples/basic/schemas')
const cache = require('../cache/cache')

const doGet = async (fastifyInstance, path, headers) => {
  const serverResponse = await fastifyInstance.inject({
    url: path,
    method: 'GET',
    headers
  })
  return serverResponse
}

const doPost = async (fastifyInstance, path) => {
  const serverResponse = await fastifyInstance.inject({
    url: path,
    method: 'POST'
  })
  return serverResponse
}

const addSampleSchemas = (app) => {
  app.addSchema(schemas.sample0)
  app.addSchema(schemas.sample1)
}

const addErrorRoutes = (app) => {
  const mandatoryQueryParamSchema = {
    querystring: {
      type: 'object',
      properties: {
        param1: { type: 'string', description: 'Mandatory querystring param' }
      },
      required: ['param1']
    }
  }

  const responseSchema = {
    response: {
      200: {
        type: 'object',
        properties: { field: { type: 'string' } }
      }
    }
  }

  app.get(
    '/required-querystring-param',
    { schema: mandatoryQueryParamSchema },
    async (req, reply) => {
      reply.code(200).send('OK')
    }
  )

  app.get(
    '/required-querystring-param-and-response',
    { schema: { ...mandatoryQueryParamSchema, ...responseSchema } },
    async (req, reply) => {
      reply.code(200).send({ field: 'value' })
    }
  )

  app.get('/throws-error', async () => {
    throw new Error('Voluntary error')
  })

  app.get('/invalid-response-schema', { schema: responseSchema }, async (req, reply) => {
    reply.send({ wrong_field: 'value' })
  })

  app.get('/valid-response-schema', { schema: responseSchema }, async (req, reply) => {
    reply.send({ field: 'value' })
  })

  app.get('/verify-auth', async (req, reply) => {
    reply.code(200).send()
  })
}

/* eslint-disable global-require */
const setupApp = async (config) => {
  cache.nuke()

  const conf = config || {}
  conf.prefix = '/core'

  const app = fastify()
  app.decorate('auth', (req, res, next) => {
    if (req.headers['x-secret'] !== undefined && req.headers['x-secret'].toString() === 'secret') {
      return next()
    }
    res.code(401)

    return next(new Error('Unauthorized'))
  })
  app.register(require('..'), conf)

  addSampleSchemas(app)
  addErrorRoutes(app)

  return app.ready()
}

module.exports = { doGet, doPost, setupApp }
