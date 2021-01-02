/* eslint-disable camelcase */
import clustersJson from 'src/../data/clusters.json'

const CLUSTER_COLOR_UNKNOWN = '#555555' as const

export type ClusterDatum = {
  build_name: string
  build_url: string
  cluster_data: unknown[]
  col: string
  country_info: unknown[]
  display_name: string
  snps: number[]
}

export function getClusters(): ClusterDatum[] {
  return clustersJson.clusters
}

export function getClusterNames() {
  return getClusters().map((cluster) => cluster.display_name)
}

export function getClusterColor(clusterName: string) {
  const clusters = getClusters()
  const found = clusters.find(({ display_name }) => display_name === clusterName)
  return found ? found.col : CLUSTER_COLOR_UNKNOWN
}