require('jest-extended')
const sut = require('../../../../logger/builders/validators/has-value')

describe('Logger Builder Validators - Has value', () => {
  it('correctly states that the given input has a value - object', async () => {
    const actual = sut({ property: 'some silly value' })
    expect(actual).toEqual(true)
  })

  it('correctly states that the given input has a value - string', async () => {
    const actual = sut('some silly value')
    expect(actual).toEqual(true)
  })

  it('correctly states that the given input has no value - null', async () => {
    const actual = sut(null)
    expect(actual).toEqual(false)
  })

  it('correctly states that the given input has no value - undefined', async () => {
    const actual = sut(undefined)
    expect(actual).toEqual(false)
  })
})
