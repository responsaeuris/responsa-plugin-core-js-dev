# responsa-plugin-core-js

`responsa-plugin-core-js` provides logging, open api documentation and Responsa objects for Responsa Plugins

## Install

```
npm i responsa-plugin-core-js
```

## Usage

```js
const fastify = require('fastify')()
const pluginCore = require('responsa-plugin-core-js')

const app = fastify({ logger: pluginCore.loggerFactory(elasticOptions) })

app.register(pluginCore, { prefix: '/core' })
```

## Schemas
The core automatically fetches the schemas added to the instance of fastify on which it has been initialized and adds the schemas you want to the Swagger documentation.
To specify the schemas that you want to be visible in Swagger, you have to add the property `addToSwagger: true` on each schema definition.

## Security

Secured plugin routes require you to pass an `x-secret` header with the proper value in order to automatically authenticate requests from Responsa to plugin.
The swagger exposed by the core and, consequentially, by the plugin states that the routes could be authenticated via the `x-secret` header. In order to set the authentication as mandatory on a specific route you will have to add the `security` option to the route schema:

```js
app.get('/needs-auth', {
  schema: {
    tags: ['auth'],
    summary: 'Sample route to test auth schema security options',
    description: 'Tests that security schema options are working as expected',
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  }
}, async (req, reply) => {
  reply.code(200).send()
})
```

If you specify this `security` option, fastify will automatically answer with a 401 status code if the `x-secret` header is missing in the request.

## How to update core in you plugin

When a newer release of core is published and you want to update the version used by you plugin, you simply need to run this npm command:

```
npm update responsa-plugin-core-js
```

... and you're done.
