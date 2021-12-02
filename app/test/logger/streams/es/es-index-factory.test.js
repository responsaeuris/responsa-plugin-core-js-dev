require('jest-extended')
require('dotenv').config({ path: './test/.env' })
const sut = require('./../../../../logger/streams/es/es-index-factory')

describe('ES Index Factory', () => {
  const elasticOptions = {
    uri: 'https://localhost:9200',
    user: 'newboss',
    password: 'newboss',
    index: 'some-index'
  }

  it('creates index correctly', async () => {
    const actual = sut(elasticOptions)
    expect(actual).toBeTruthy()
    expect(actual).toMatch(/^some-index-\d{4}-\d{2}$/)
  })

  it('creates index correctly - bis', async () => {
    const date = new Date('2021-4-2')
    const actual = sut(elasticOptions, date)
    expect(actual).toBeTruthy()
    expect(actual).toEqual('some-index-2021-04')
  })
})
