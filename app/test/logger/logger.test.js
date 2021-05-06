require('jest-extended')
require('dotenv').config()
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
  const requiredHeaders = {
    'X-ConversationId': 4,
    'X-ResponsaTS': 12312315648974,
    'x-secret': 'secret'
  }

  const elasticOptions = {
    uri: process.env.ELASTIC_URI,
    user: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
    index: process.env.ELASTIC_INDEX
  }

  it('Search for log', async () => {
    const loggerInstance = sut(elasticOptions)
    const app = await helper.setupApp({ logger: loggerInstance })
    const qsValue = `EurisTest${Date.now()}`

    await helper.doGet(app, `/required-querystring-param?param1=${qsValue}`, requiredHeaders)

    const client = new Client({
      node: elasticOptions.uri,
      auth: {
        username: elasticOptions.user,
        password: elasticOptions.password
      }
    })

    const testFunction = (resolve) => {
      const time = new Date().toISOString()
      const indexName = `${elasticOptions.index}-%{DATE}`.replace('%{DATE}', time.substring(0, 10))

      client.search({
        index: indexName,
        body: {
          query: { match: { requestPath: `/required-querystring-param?param1=${qsValue}` } }
        }
      }, (err, result) => {
        if (!err) {
          let count = 0
          const actual = result.body.hits.hits
          actual.every(item => {
            if (item._source.requestQueryString.param1 === qsValue) {
              count++
              if (count > 1) {
                return false
              } else {
                return true
              }
            } else {
              return true
            }
          })
          expect(actual.length).toBeGreaterThan(0)
          expect(count).toEqual(1)
          resolve()
        } else {
          resolve()
          throw err
        }
      })
    }
    const wait = (timeOut) => new Promise((resolve) => setTimeout(testFunction, 2000, resolve))
    await wait(1)
  })
})
