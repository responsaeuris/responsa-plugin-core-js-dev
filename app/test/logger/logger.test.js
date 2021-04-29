require('jest-extended')
const sut = require('./../../logger/logger')

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
