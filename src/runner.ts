import * as core from '@actions/core'
import * as newman from 'newman'

export async function run(
  options: newman.NewmanRunOptions
): Promise<newman.NewmanRunSummary> {
  return new Promise(resolve => {
    newman
      .run(options)
      .on('start', (): void => {
        core.debug(`beginning collection run`)
      })
      .on('done', (err: Error, summary: newman.NewmanRunSummary): void => {
        if (err || summary.error || summary.run.failures.length) {
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
        core.getInput('apiKey') || '',
        core.getInput('collection') || ''
      ),
      environment: getEnvironment(
        core.getInput('apiKey') || '',
        core.getInput('environment') || ''
      ),
      globals: core.getInput('globals'),
      iterationCount: Number(core.getInput('iterationCount')) || 1,
      iterationData: core.getInput('iterationData'),
      folder: (core.getInput('folder') || '').split(','),
      workingDir: core.getInput('workingDir'),
      insecureFileRead: Boolean(core.getInput('insecureFileRead')),
      timeout: Number(core.getInput('timeout')),
      timeoutRequest: Number(core.getInput('timeoutRequest')),
      timeoutScript: Number(core.getInput('timeoutScript')),
      delayRequest: Number(core.getInput('delayRequest')) || 0,
      ignoreRedirects: Boolean(core.getInput('ignoreRedirects')),
      insecure: Boolean(core.getInput('insecure')),
      bail: Boolean(core.getInput('bail')),
      suppressExitCode: Boolean(core.getInput('suppressExitCode')),
      reporters: (core.getInput('reporters') || '').split(','),
      reporter: core.getInput('reporter'),
      color: getColor(core.getInput('color')),
      sslClientCert: core.getInput('sslClientCert'),
      sslClientKey: core.getInput('sslClientKey'),
      sslClientPassphrase: core.getInput('sslClientPassphrase')
    }

    resolve(options)
  })
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
