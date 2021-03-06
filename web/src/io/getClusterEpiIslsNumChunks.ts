import { get } from 'lodash'

import acknowledgements from 'src/../data/acknowledgements/acknowledgements_keys.json'

export function getAcknowledgementsKeys(): Set<string> {
  const acks = get(acknowledgements, 'acknowledgements')
  if (!acks) {
    console.warn(`Acknowledgements not found`)
    return new Set()
  }

  return new Set(Object.keys(acknowledgements.acknowledgements))
}

export function getClusterEpiIslsNumChunks(clusterBuildName: string): number {
  const acks = get(acknowledgements, 'acknowledgements')
  if (!acks) {
    console.warn(`Acknowledgements not found`)
  }

  const ack = get<Record<string, { numChunks: number } | undefined>, string>(acks, clusterBuildName)
  if (!ack) {
    throw new Error(`Acknowledgements not found for ${clusterBuildName}`)
  }

  return ack.numChunks
}
