export const parseNumberToOneDecimalText = (number: number): string => {
  if (Number.isInteger(number)) return `${number}.0`
  return `${number}`
}
