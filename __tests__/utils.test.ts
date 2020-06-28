import * as utils from '../src/utils'

test('successfully parses number', () => {
  var input = '123'
  var result = utils.getNumberOrUndefined(input)
  expect(result).toBe(123)
})

test('successfully parses invalid number as undefined', () => {
  var input = 'abcd123'
  var result = utils.getNumberOrUndefined(input)
  expect(result).toBe(undefined)
})

test('successfully parses empty string as undefined', () => {
  var result = utils.getNumberOrUndefined('')
  expect(result).toBe(undefined)
})
