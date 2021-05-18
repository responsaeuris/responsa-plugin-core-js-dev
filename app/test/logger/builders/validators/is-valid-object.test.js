require('jest-extended')
const sut = require('../../../../logger/builders/validators/is-valid-object')

describe('Logger Builder Validators - Is Valid Object', () => {
  it('correctly states that the given input is a valid Object', async () => {
    const actual = sut({ key: 'value' })
    expect(actual).toEqual(true)
  })

  it('correctly states that the given input is not a valid Object - empty', async () => {
    const actual = sut({})
    expect(actual).toEqual(false)
  })

  it('correctly states that the given input is not a valid Object - null', async () => {
    const actual = sut({})
    expect(actual).toEqual(false)
  })

  it('correctly states that the given input is not a valid Object - string', async () => {
    const actual = sut('string')
    expect(actual).toEqual(false)
  })
})
