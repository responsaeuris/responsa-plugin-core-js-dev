require('jest-extended')
require('dotenv').config({ path: './test/.env' })
const sut = require('./../../logger/logger')
const helper = require('../helper')
const { Client } = require('@elastic/elasticsearch')

describe('logger factory', () => {
  const elasticOptions = {
    uri: 'https://localhost:9200',
    user: 'newboss',
    password: 'newboss',
    index: 'some-index'
  }

  const getLoggerStreams = (logger) =>
    logger[Reflect.ownKeys(logger).find((key) => key.toString() === 'Symbol(pino.stream)')]

  it('creates a logger with 2 streams', async () => {
    const logger = sut(elasticOptions)
    const actual = getLoggerStreams(logger)

    expect(actual.streams).toBeDefined()
    expect(actual.streams.length).toEqual(2)
  })

  it('creates a logger with 1 stream', async () => {
    const logger = sut()
    const actual = getLoggerStreams(logger)

    expect(actual.streams).toBeDefined()
    expect(actual.streams.length).toEqual(1)
  })
})

describe('Logger - Log writing check ', () => {
  it('Search for log', async () => {
    const elasticOptions = {
      uri: process.env.ELASTIC_URI,
      user: process.env.ELASTIC_USER,
      password: process.env.ELASTIC_PASSWORD,
      index: process.env.ELASTIC_INDEX
    }

    const loggerInstance = sut(elasticOptions)
    const app = await helper.setupApp(null, { logger: loggerInstance })
    const qsValue = `euris-test-${Date.now()}`
    const path = `required-querystring-param?param1=${qsValue}`
    const response = await helper.doGet(app, path, helper.requiredHeaders)
    expect(response).toBeDefined()
    expect(response.statusCode).toEqual(200)

    // creates ELK client
    const client = new Client({ node: elasticOptions.uri, auth: { username: elasticOptions.user, password: elasticOptions.password } })
    // waits 5 seconds so that the log has been pushed
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // checks that the request has been logged on ELK
    const { body } = await client.search({
      index: `${elasticOptions.index}-%{DATE}`.replace('%{DATE}', new Date().toISOString().substring(0, 10)),
      body: { query: { match: { requestPath: `/required-querystring-param?param1=${qsValue}` } } }
    })

    let count = 0
    const actual = body.hits.hits
    actual.every(item => {
      if (item._source.requestQueryString.param1 === qsValue) {
        count++
        return count <= 1
      } else {
        return true
      }
    })
    expect(actual.length).toBeGreaterThan(0)
    expect(count).toEqual(1)
  })
})
