require('jest-extended')
const helper = require('../helper')

describe('error handling', () => {
  it('400 - answers with an error with invalid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/required-querystring-param', helper.requiredHeaders)
    expect(response.statusCode).toEqual(400)
  })

  it('200 - answers with an ok with valid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(
      sut,
      '/required-querystring-param?param1=1',
      helper.requiredHeaders
    )
    expect(response.statusCode).toEqual(200)
  })

  it('500 - answers with an error with unhandled exception', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/throws-error', helper.requiredHeaders)
    expect(response.statusCode).toEqual(500)
    expect(response.payload).toEqual(
      '{"statusCode":500,"error":"Internal Server Error","message":"Voluntary error"}'
    )
  })
  it('404 on invalid route', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/non-existant', helper.requiredHeaders)
    expect(response.statusCode).toEqual(404)
    expect(response.payload).toEqual(
      '{"message":"Route GET:/non-existant not found","error":"Not Found","statusCode":404}'
    )
  })

  it('gets an empty object when schema is wrong', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/invalid-response-schema', helper.requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{}')
  })

  it('gets a valid object with valid schema', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', helper.requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{"field":"value"}')
  })
})

describe('responsa headers', () => {
  it('200 with correct responsa headers', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', helper.requiredHeaders)
    expect(response.statusCode).toEqual(200)
  })

  it('400 w/o conversationId', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', {
      'X-ResponsaTS': Date.now()
    })
    expect(response.statusCode).toEqual(400)
  })

  it('400 w/o responsaTS', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', { 'X-ConversationId': '55' })
    expect(response.statusCode).toEqual(400)
  })

  // TODO timestamp formatting

  it('answers with all three headers', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', helper.requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.raw.res.getHeader('X-ConversationId')).toEqual(
      helper.requiredHeaders['X-ConversationId'].toString()
    )
    expect(response.raw.res.getHeader('X-ResponsaTS')).toEqual(
      helper.requiredHeaders['X-ResponsaTS'].toString()
    )
    expect(response.raw.res.getHeader('X-ClientTS')).toBeDefined()
    expect(response.raw.res.getHeader('X-ClientTS')).toBeNumber()
  })
})

describe('auth secret', () => {
  it('authenticate request with correct secret', async () => {
    const app = await helper.setupApp()
    const response = await helper.doGet(app, '/verify-auth', helper.requiredHeaders)

    expect(response.statusCode).toEqual(200)
  })

  it('returns unauthorized with invalid secret', async () => {
    const app = await helper.setupApp()
    const response = await helper.doGet(app, '/verify-auth', {
      'X-ConversationId': 4,
      'X-ResponsaTS': 12312315648974,
      'x-secret': 'invalid-secret'
    })

    expect(response.statusCode).toEqual(401)
  })

  it('returns unauthorized with missing secret headers', async () => {
    const app = await helper.setupApp()
    const response = await helper.doGet(app, '/verify-auth', {
      'X-ConversationId': 4,
      'X-ResponsaTS': 12312315648974
    })

    expect(response.statusCode).toEqual(401)
  })
})
