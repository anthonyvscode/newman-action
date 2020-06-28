export function getNumberOrUndefined(value: string): number | undefined {
  if (!value || value === '') return undefined

  const result = Number(value)
  if (isNaN(result)) return undefined
  return result
}

export function getStringOrUndefined(
  value: string
): string | string[] | undefined {
  if (!value || value === '') return undefined

  if (value.includes(',')) return value.split(',')
  return value
}

export function getBooleanOrUndefined(value: string): boolean | undefined {
  if (!value || value === '') return undefined

  switch (value) {
    case 'true':
    case '1':
    case 'on':
    case 'yes':
      return true
    default:
      return false
  }
}
