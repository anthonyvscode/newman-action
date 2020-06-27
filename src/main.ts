import * as core from '@actions/core'
import * as newman from 'newman'
import * as runner from './runner'

async function run(): Promise<void> {
  try {
    const options: newman.NewmanRunOptions = await runner.createOptions()
    const summary: newman.NewmanRunSummary = await runner.run(options)
    await outputSummary(summary)
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function outputSummary(summary: newman.NewmanRunSummary): Promise<void> {
  core.setOutput('summary_full', JSON.stringify(summary))

  // Just pull out the miminum parts for each failure
  const failures: FailureSummary[] = []

  for (let i = 0, len = summary.run.failures.length; i < len; i++) {
    failures.push({
      Parent: {
        Name: summary.run.failures[i].parent.name,
        Id: summary.run.failures[i].parent.id
      },
      Source: {
        Name: summary.run.failures[i].source?.name ?? ''
      },
      Error: {
        Message: summary.run.failures[i].error.message,
        Test: summary.run.failures[i].error.test
      }
    })
  }

  // Build main object with just the bits needed plus the slimmed down failures
  const result = {}
  Object.assign(result, {
    Collection: {
      Info: {
        Name: summary.collection.name,
        Id: summary.collection.id
      }
    },
    Run: {
      Stats: {
        Requests: summary.run.stats.requests,
        Assertions: summary.run.stats.assertions
      },
      Failures: failures
    }
  })

  core.setOutput('summary', JSON.stringify(result))
}

export interface FailureSummary {
  Parent: object
  Source: object
  Error: object
}

run()
