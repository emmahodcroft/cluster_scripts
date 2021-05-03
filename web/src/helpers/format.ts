import { DateTime } from 'luxon'

export const formatProportion = (value: number) => value.toFixed(2)

export const formatInteger = (value: number) => value.toFixed(0)

export const formatDate = (date: number) => DateTime.fromSeconds(date).toISODate()

export const formatDateBiweekly = (weekTimestamp: number) => {
  const begin = DateTime.fromSeconds(weekTimestamp)
  const end = begin.plus({ weeks: 2 })
  return `${begin.toFormat('dd MMM yyyy')} - ${end.toFormat('dd MMM yyyy')}`
}

export const formatDateHumanely = (date: number) => DateTime.fromSeconds(date).toFormat('MMM yyyy').replace(' ', '\n')

export function dateStringToSeconds(date: string): number {
  return DateTime.fromFormat(date, 'yyyy-MM-dd').toSeconds()
}
