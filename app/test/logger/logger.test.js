require('jest-extended')
require('dotenv').config({ path: './test/.env' })
const sut = require('./../../logger/logger')
const helper = require('../helper')
const { Client } = require('@elastic/elasticsearch')

const elasticOptions = {
  uri: process.env.ELASTIC_URI,
  user: process.env.ELASTIC_USERNAME,
  password: process.env.ELASTIC_PASSWORD,
  index: process.env.ELASTIC_INDEX
}

describe('logger factory', () => {
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
  it('Search for log - cloud', async () => {
    const loggerInstance = sut(elasticOptions)
    const app = await helper.setupApp(null, { logger: loggerInstance })
    const qsValue = `euris-test-${Date.now()}`
    const path = `required-querystring-param?param1=${qsValue}`
    const response = await helper.doGet(app, path, helper.requiredHeaders)
    expect(response).toBeDefined()
    expect(response.statusCode).toEqual(200)

    // creates ELK client
    const client = new Client({ cloud: { id: elasticOptions.uri }, auth: { username: elasticOptions.user, password: elasticOptions.password } })
    // waits 5 seconds so that the log has been pushed
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // checks that the request has been logged on ELK
    const index = `${elasticOptions.index}-${new Date().toISOString().substring(0, 7)}`
    const { body } = await client.search({
      index,
      body: { query: { term: { 'requestPath.keyword': { value: `/required-querystring-param?param1=${qsValue}` } } } }
    })

    await client.indices.delete({ index })

    let count = 0
    const actual = body.hits.hits
    actual.every(item => {
      if (item._source.requestQueryString === `{"param1":"${qsValue}"}`) {
        count++
        return count <= 1
      } else {
        return true
      }
    })
    expect(actual.length).toBeGreaterThan(0)
    expect(count).toBeGreaterThan(0)
  })
})
