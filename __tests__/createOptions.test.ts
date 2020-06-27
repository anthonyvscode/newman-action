import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as core from '@actions/core'
import * as runner from '../src/runner'
import * as newman from 'newman'

// Inputs for mock @actions/core
let inputs = {} as any

describe('createOptions tests', () => {
  beforeAll(() => {
    // Mock getInput
    jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      return inputs[name]
    })

    // Mock error/warning/info/debug
    jest.spyOn(core, 'error').mockImplementation(jest.fn())
    jest.spyOn(core, 'warning').mockImplementation(jest.fn())
    jest.spyOn(core, 'info').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    // Reset inputs
    inputs = {}
  })

  afterAll(() => {
    // Restore
    jest.restoreAllMocks()
  })

  test('sets defaults', async () => {
    inputs.collection = './collection.json'
    const options: newman.NewmanRunOptions = await runner.createOptions()
    expect(options).toBeTruthy()
    expect(options.iterationCount).toBe(1)
    expect(options.color).toBe('auto')
    //TODO: Rest of the fields in here
  })

  /* Collection Property Tests */

  test('collection: check required', async () => {
    await expect(runner.createOptions()).rejects.toThrow(
      'collection is required'
    )
  })

  test('collection: assigns property to local file', async () => {
    inputs.collection = './collection.json'
    const options = await runner.createOptions()
    await expect(options.collection).toEqual(inputs.collection)
  })

  test('collection: assigns property to external url', async () => {
    inputs.collection = 'http://example.com/collection.json'
    const options = await runner.createOptions()
    await expect(options.collection).toEqual(inputs.collection)
  })

  test('collection: requires apiKey when collection is set to uuid', async () => {
    inputs.collection = 'bab22df3-0221-0251-5849-b34eab2bfa49'
    await expect(runner.createOptions()).rejects.toThrow(
      `apiKey is required when using collection_uuid`
    )
  })

  test('collection: creates postman url when collection_uuid is set', async () => {
    inputs.collection = 'bab22df3-0221-0251-5849-b34eab2bfa49'
    inputs.apiKey = 'test123'
    const options = await runner.createOptions()
    await expect(options.collection).toEqual(
      `https://api.getpostman.com/collections/${inputs.collection}?apikey=${inputs.apiKey}`
    )
  })

  /* Environment Property Tests */

  test('environment: assigns property to local file', async () => {
    inputs.collection = './collection.json'
    inputs.environment = './environment.json'
    const options = await runner.createOptions()
    await expect(options.environment).toEqual(inputs.environment)
  })

  test('environment: assigns property to external url', async () => {
    inputs.collection = './collection.json'
    inputs.environment = 'http://example.com/environment.json'
    const options = await runner.createOptions()
    await expect(options.environment).toEqual(inputs.environment)
  })

  test('environment: requires apiKey when environment is set to uuid', async () => {
    inputs.collection = './collection.json'
    inputs.environment = 'bab22df3-0221-0251-5849-b34eab2bfa49'
    await expect(runner.createOptions()).rejects.toThrow(
      `apiKey is required when using environment_uuid`
    )
  })

  test('environment: creates postman url when environment_uuid is set', async () => {
    inputs.collection = './collection.json'
    inputs.environment = 'bab22df3-0221-0251-5849-b34eab2bfa49'
    inputs.apiKey = 'test123'
    const options = await runner.createOptions()
    await expect(options.environment).toEqual(
      `https://api.getpostman.com/environments/${inputs.environment}?apikey=${inputs.apiKey}`
    )
  })
})
