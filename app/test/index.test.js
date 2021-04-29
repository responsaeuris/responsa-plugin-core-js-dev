require('jest-extended')
const helper = require('./helper')

describe('plugin registration', () => {
  it('should register the correct decorators', async () => {
    expect.assertions(4)

    const sut = await helper.setupApp()

    expect(sut.coreStatus).toBeDefined()
    expect(sut.cache).toBeDefined()
    expect(sut.singleChoice).toBeDefined()
    expect(sut.richMessage).toBeDefined()
  })
})

describe('options loading', () => {
  const getSwagger = async (opt) => {
    const sut = await helper.setupApp(opt)

    const response = await helper.doGet(sut, 'documentation/json')

    const actual = JSON.parse(response.payload)

    return actual
  }

  const getSwaggerInfo = async (opt) => {
    const actual = await getSwagger(opt)
    expect(actual.info).toBeDefined()
    return actual.info
  }

  it('loads appName', async () => {
    const actual = await getSwaggerInfo({ appName: 'some-app-name' })

    expect(actual.title).toEqual('some-app-name')
  })

  it('loads version', async () => {
    const actual = await getSwaggerInfo({ apiVersion: 'v1' })

    expect(actual.version).toEqual('v1')
  })

  it('loads x-log-index', async () => {
    const actual = await getSwaggerInfo({ esIndex: 'some-index-name' })

    expect(actual['x-log-index']).toEqual('some-index-name')
  })

  it('loads x-log-index lower case', async () => {
    const actual = await getSwaggerInfo({ esIndex: 'soMe-inDex-naMe' })

    expect(actual['x-log-index']).toEqual('some-index-name')
  })
  it('loads translations', async () => {
    const response = await getSwaggerInfo({
      translationsKeys: ['key1', 'key2']
    })

    const actual = response['x-translations']

    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Array)

    expect(actual.length).toEqual(2)

    expect(actual[0]).toEqual('key1')
    expect(actual[1]).toEqual('key2')
  })

  it('loads components with models schemas', async () => {
    const response = await getSwagger()

    expect(response.components).toBeDefined()
    expect(response.components).toBeInstanceOf(Object)

    expect(response.components.schemas).toBeDefined()
    expect(response.components.schemas).toBeInstanceOf(Object)

    const actual = response.components.schemas.ResponsaSingleChoiceResource
    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Object)
  })

  it('loads external schemas with addToSwagger === true', async () => {
    const response = await getSwagger()
    const actual = response.components.schemas.sample1
    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Object)
  })

  it('doesn\'t load external schemas without addToSwagger', async () => {
    const response = await getSwagger()
    const actual = response.components.schemas.sample0
    expect(actual).not.toBeDefined()
  })
})

describe('single choice resource', () => {
  const validate = (output) => {
    expect(output.text).toBeDefined()
    expect(output.payload).toBeDefined()
  }

  it('translate a simple string', async () => {
    const sut = await helper.setupApp()
    const data = 'hello'

    const actual = sut.singleChoice(data)

    validate(actual)
  })
})
