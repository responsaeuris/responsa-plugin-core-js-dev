require('jest-extended')
const sut = require('./../../../logger/filters/logger-filter')

describe('log filtering', () => {
  const testCalls = (input, expected, cb) => {
    const actual = sut(input)

    expect(!!actual).toEqual(expected)

    if (cb) cb(actual)
  }

  const getCalled = (input, cb) => testCalls(input, true, cb)
  const notCalled = (input) => testCalls(input, false)

  it('calls logger when res is present', () => {
    getCalled([{ res: {} }])
    getCalled([{ res: {} }, 'some string'])
  })

  it('calls logger with correct input', () => {
    const aResponse = { res: { key: 'value' } }
    const cb = (data) => {
      expect(data).toEqual(aResponse)
    }

    getCalled([aResponse], cb)
    getCalled([aResponse, 'some string'], cb)
  })

  it('skips call to logger if is not an array', () => {
    notCalled({ res: {} })
  })

  it('skips call when array is empty', () => {
    notCalled([])
  })
  it('a string is present at 0 it call first string element and nothing more', () => {
    const cb = (data) => {
      expect(data).toEqual('hello world')
    }

    getCalled(['hello world', { res: {} }], cb)
  })

  it('call logger when a single string is passed', () => {
    const cb = (data) => {
      expect(data).toEqual('hello world')
    }
    getCalled(['hello world'], cb)
  })

  it('skips error responseTime', () => {
    const error = { res: { statusCode: 500 }, err: {} }
    const cb = (data) => {
      expect(data).toEqual(error)
    }
    getCalled([error], cb)
  })

  it('skips when 500', () => {
    notCalled([{ res: { statusCode: 500 } }])
  })
})
