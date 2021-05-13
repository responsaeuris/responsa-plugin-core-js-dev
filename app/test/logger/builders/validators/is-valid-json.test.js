require('jest-extended')
const sut = require('../../../../logger/builders/validators/is-valid-json')

describe('Logger Builder Validators - Is Valid JSON', () => {
  it('correctly states that the given input is a valid JSON', async () => {
    const actual = sut('{"key": "value"}')
    expect(actual).toEqual(true)
  })

  it('correctly states that the given input is a valid JSON - null', async () => {
    const actual = sut(null)
    expect(actual).toEqual(true)
  })

  it('correctly states that the given input is not a valid JSON - invalid JSON', async () => {
    const actual = sut('{"key": "value}')
    expect(actual).toEqual(false)
  })

  it('correctly states that the given input is not a valid JSON - simple string', async () => {
    const actual = sut('string')
    expect(actual).toEqual(false)
  })
})
