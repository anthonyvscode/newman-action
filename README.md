# Newman CLI Postman Collection Runner

![build-test](https://github.com/anthonyvscode/newman-action/workflows/build-test/badge.svg)

[Newman](https://learning.postman.com/docs/postman/collection-runs/command-line-integration-with-newman/) is a command line Collection Runner for [Postman](https://www.postman.com/). It allows you to run and test a Postman Collection directly from the command line, or in this case, from a github action.

## Usage

### Local collection file

```yaml
- name: Run API Tests
  id: run-newman
  uses: ./anthonyvscode/newman-action@master
  with:
    collection: collection.json
    reporters: cli

- name: Output Summary JSON
  run: echo "${{ steps.create.run-newman.summary }}"
```

### Hosted collection file

```yaml
- name: Run API Tests
  id: run-newman
  uses: ./anthonyvscode/newman-action@master
  with:
    collection: http://example.com/collection.json
    reporters: cli

- name: Output Summary JSON
  run: echo "${{ steps.create.run-newman.summary }}"
```

### Postman API

See [Postman API](https://docs.api.getpostman.com/?version=latest) for full functionality.

```yaml
- name: Run API Tests
  id: run-newman
  uses: ./anthonyvscode/newman-action@master
  with:
    apiKey: ${{ secrets.postmanApiKey }}
    collection: bab22df3-0221-0251-5849-b34eab2bfa49
    reporters: cli

- name: Output Summary JSON
  run: echo "${{ steps.create.run-newman.summary }}"
```

----
## Action Spec:

### Environment variables
- None

### Inputs

This action is able to set all parameters listed in the [Newman API Reference documentation](https://www.npmjs.com/package/newman#api-reference)

- `apiKey` (required if collection_uuid is set) - Postman API key
- `collection` (required) - Path to the JSON, URL or a collection_uuid to query on the newman hosted api
- `environment` (optional) - Path to the JSON, URL or an environment_uuid to query on the newman hosted api
- `globals` (optional) - Path to the JSON or URL where the global JSON is hosted
- `iterationCount` (optional, default value: `1`) - Number of iterations to run on the collection
- `iterationData` (optional) - Path to the JSON or CSV file or URL to be used as data source when running multiple iterations on a collection.
- `folder` (optional) - Name/ID of folders to run instead of entire collection
- `workingDir` (optional, default value: `.`) - Path to be used as working directory
- `insecureFileRead` (optional, default value: `true`) - Allow reading files outside of working directory
- `timeout` (optional, default value: `Infinity`) - Time to wait for the collection run to complete
- `timeoutRequest` (optional, default value: `Infinity`) - Time to wait for scripts to return a response
- `timeoutScript` (optional, default value: `Infinity`) - Time to wait for scripts to return a response
- `delayRequest` (optional, default value: `0`) - Time to wait between subsequent requests
- `ignoreRedirects` (optional) - Follow 3xx responses
- `insecure` (optional) - Disable SSL verification and allow self-signed SSL
- `bail` (optional) - Stop collection run gracefully on error
- `suppressExitCode` (optional) - Always exit cleanly
- `reporters` (optional) - Reporter to use
- `reporter` (optional) - Reporter options
- `color` (optional, default value: `auto`) - Modify colored CLI output
- `sslClientCert` (optional) - Path to public client certificate
- `sslClientKey` (optional) - Path to secret client key file
- `sslClientPassphrase` (optional) - Secret client key passphrase

### Outputs

- `summary_full` (JSON object) - Full summary as returned from the run. JSON string.
- `summary` (JSON object) - condensed summary consisting of these summary items only

```
Collection.Info.Name
Collection.Info.Id
Run.Stats.Requests.*
Run.Stats.Assertions.*
Run.Failures[n].Parent.Name
Run.Failures[n].Parent.Id
Run.Failures[n].Source.Name
Run.Failures[n].Error.Message
Run.Failures[n].Error.Test
```

![https://giphy.com/gifs/seinfeld-door-get-out-DbSZni6xAW2Ws](https://media0.giphy.com/media/DbSZni6xAW2Ws/giphy.gif?cid=ecf05e47774b1f8235d1a899ca217f5d086d9d04ed2dc5c3&rid=giphy.gif)