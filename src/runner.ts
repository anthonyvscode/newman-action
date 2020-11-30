import * as core from '@actions/core'
import * as newman from 'newman'
import * as utils from './utils'

export async function run(
  options: newman.NewmanRunOptions
): Promise<newman.NewmanRunSummary> {
  return new Promise(resolve => {    
    core.debug(`Started. suppressExitCode: ${options.suppressExitCode}`)
    newman
      .run(options)
      .on('start', (): void => {
        core.debug(`beginning collection run`)
      })
      .on('done', (err: Error, summary: newman.NewmanRunSummary): void => {
        if (!options.suppressExitCode && (err || summary.error || summary.run.failures.length)) {
          core.setFailed(`Newman run failed! ${err || ''}`)
        } else {
          core.debug('collection run completed.')
        }
        resolve(summary)
      })
  })
}

export async function createOptions(): Promise<newman.NewmanRunOptions> {
  return new Promise(resolve => {
    // Validate the required field of collection.
    if (!core.getInput('collection')) {
      throw new Error('collection is required')
    }

    const options: newman.NewmanRunOptions = {
      collection: getCollection(
        core.getInput('apiKey'),
        core.getInput('collection')
      ),
      environment: getEnvironment(
        core.getInput('apiKey'),
        core.getInput('environment')
      ),
      globals: core.getInput('globals'),
      iterationCount: getNumberResultAndValidate('iterationCount'),
      iterationData: core.getInput('iterationData'),
      folder: utils.getStringOrUndefined(core.getInput('folder')),
      workingDir: core.getInput('workingDir'),
      insecureFileRead: utils.getBooleanOrUndefined(
        core.getInput('insecureFileRead')
      ),
      timeout: getNumberResultAndValidate(core.getInput('timeout')),
      timeoutRequest: getNumberResultAndValidate('timeoutRequest'),
      timeoutScript: getNumberResultAndValidate('timeoutScript'),
      delayRequest: getNumberResultAndValidate('delayRequest'),
      ignoreRedirects: utils.getBooleanOrUndefined(
        core.getInput('ignoreRedirects')
      ),
      insecure: utils.getBooleanOrUndefined(core.getInput('insecure')),
      bail: getBailValue(core.getInput('bail')),
      suppressExitCode: utils.getBooleanOrUndefined(
        core.getInput('suppressExitCode')
      ),
      reporters: utils.getStringOrUndefined(core.getInput('reporters')),
      reporter: core.getInput('reporter'),
      color: getColor(core.getInput('color')),
      sslClientCert: core.getInput('sslClientCert'),
      sslClientKey: core.getInput('sslClientKey'),
      sslClientPassphrase: core.getInput('sslClientPassphrase')
    }

    resolve(options)
  })
}

export function getBailValue(
  value: string
): boolean | ['folder'] | ['failure'] | undefined {
  if (!value || value === '') return undefined

  if (value === 'folder') return ['folder']

  if (value === 'failure') return ['failure']

  return utils.getBooleanOrUndefined(value)
}

export function getNumberResultAndValidate(
  propertyName: string
): number | undefined {
  const value = core.getInput(propertyName)
  const number = Number(value)
  if (isNaN(number)) throw new Error(`${propertyName} needs to be a number`)

  return utils.getNumberOrUndefined(value)
}

export function getCollection(apiKey: string, collection: string): string {
  const apiBase = 'https://api.getpostman.com'
  const idRegex = new RegExp(/[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}/g)

  if (collection.match(idRegex)) {
    if (!apiKey)
      throw new Error('apiKey is required when using collection_uuid')

    return `${apiBase}/collections/${collection}?apikey=${apiKey}`
  }

  return collection
}

export function getEnvironment(apiKey: string, environment: string): string {
  const idRegex = new RegExp(/[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}/g)

  if (environment.match(idRegex)) {
    if (!apiKey)
      throw new Error('apiKey is required when using environment_uuid')

    return `https://api.getpostman.com/environments/${environment}?apikey=${apiKey}`
  }

  return environment
}

export function getColor(color: string): 'on' | 'off' | 'auto' {
  if (color === 'on') return 'on'
  if (color === 'off') return 'off'
  return 'auto'
}
