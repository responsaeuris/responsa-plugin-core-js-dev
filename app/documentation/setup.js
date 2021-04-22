const { ResponsaSingleChoiceResource } = require('../models/singleChoice')
const { ResponsaRichMessageResource } = require('../models/richMessage')
const errorSchema = require('../models/error')
const oas = require('fastify-oas')

const getSchemas = (f) => {
  const schemas = f.getSchemas()

  const schemasToAdd = {}
  Object.entries(schemas).forEach(([key, value]) => {
    if (value.addToSwagger === true) {
      const schema = JSON.parse(JSON.stringify(value))
      if (schema.$id) {
        delete schema.$id
      }
      delete schema.addToSwagger
      schemasToAdd[key] = schema
    }
  })

  return {
    ResponsaSingleChoiceResource,
    Error: errorSchema,
    ResponsaRichMessageResource,
    ...schemasToAdd
  }
}

module.exports = (f, options) => {
  f.register(oas, {
    swagger: {
      info: {
        title: options.appName,
        version: options.apiVersion,
        'x-translations': options.translationsKeys,
        'x-log-index': options.esIndex.toLowerCase()
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      servers: options.servers,
      components: {
        schemas: getSchemas(f),
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-secret'
          }
        }
      }
    },
    exposeRoute: true,
    openapi: '3.0.3'
  })
}
