require('jest-extended')
const helper = require('../../helper')
const sut = require('../../../logger/builders/logger-builder')

describe('Logger Formatter', () => {
  it('logs message with res, req and elapsed', async () => {
    const qryStr = 'param1=1'
    const qryObj = { param1: 1 }
    const app = await helper.setupApp()
    const response = await helper.doGet(
      app,
      `required-querystring-param-and-response?${qryStr}`,
      helper.requiredHeaders
    )
    response.raw.req.query = qryObj
    const actual = sut(response.raw.req, response.raw.res, null, 1.98975)
    expect(actual).toBeDefined()
    expect(actual.conversationId).toBeDefined()
    expect(actual.responsaTS).toBeDefined()
    expect(actual.clientTS).toBeDefined()
    expect(actual.requestBody).toBeDefined()
    expect(actual.requestBody).toEqual({})
    expect(actual.requestHasBody).toBeDefined()
    expect(actual.requestHasBody).toBeBoolean()
    expect(actual.requestHasBody).toBeFalse()
    expect(actual.requestIsHttps).toBeDefined()
    expect(actual.requestIsHttps).toBeBoolean()
    expect(actual.requestContentLength).toBeDefined()
    expect(actual.requestQueryString).toBeDefined()
    expect(actual.requestQueryString).toEqual(JSON.stringify(qryObj))
    expect(actual.requestQueryStringHasValue).toBeDefined()
    expect(actual.requestQueryStringHasValue).toBeTrue()
    expect(actual.requestHeaders).toBeDefined()
    expect(actual.requestHeaders).toBeObject()
    expect(actual.responseBody).toBeDefined()
    expect(actual.responseBody).toEqual(JSON.stringify({ field: 'value' }))
    expect(actual.responseHasBody).toBeDefined()
    expect(actual.responseHasBody).toBeTrue()
    expect(actual.requestMethod).toBeDefined()
    expect(actual.requestMethod).toEqual('GET')
    expect(actual.requestPath).toBeDefined()
    expect(actual.requestPath).toEqual(`/required-querystring-param-and-response?${qryStr}`)
    expect(actual.statusCode).toBeDefined()
    expect(actual.statusCode).toEqual('200')
    expect(actual.elapsed).toBeDefined()
    expect(actual.elapsed).toEqual(1.98975)
    expect(actual.exceptionMessage).toBeDefined()
    expect(actual.exceptionMessage).toEqual('')
    expect(actual.exceptionStackTrace).toBeDefined()
    expect(actual.exceptionStackTrace).toEqual('')
  })
})
