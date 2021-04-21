const { ResponsaSingleChoiceResource } = require('../models/singleChoice')
const { ResponsaRichMessageResource } = require('../models/richMessage')
const errorSchema = require('../models/error')
const oas = require('fastify-oas')

const getSchemas = (f) => {
  const schemas = f.getSchemas()

  const schemasToAdd = {}
  Object.entries(schemas).forEach(([key, value]) => {
    if (value.addToSwagger === true) {
      schemasToAdd[key] = value
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
        schemas: getSchemas(f)
      }
    },
    exposeRoute: true,
    openapi: '3.0.3'
  })
}
