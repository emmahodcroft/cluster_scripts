/* eslint-disable camelcase */
import React, { useMemo } from 'react'

import { get } from 'lodash'
import { parseVariant } from 'src/components/Common/parseVariant'
import styled from 'styled-components'

import type { Mutation, MutationColors } from 'src/types'
import { theme } from 'src/theme'
import { AMINOACID_COLORS, CLADE_COLORS, GENE_COLORS, NUCLEOTIDE_COLORS } from 'src/colors'
import { getClusterNames, getClusters } from 'src/io/getClusters'
import { LinkSmart } from 'src/components/Link/LinkSmart'
import { parseAminoacidMutation } from 'src/components/Common/parseAminoacidMutation'
import { parseNucleotideMutation } from 'src/components/Common/parseNucleotideMutation'
import { formatMutation } from 'src/components/Common/formatMutation'
import { AMINOACID_NAMES, GENE_NAMES, NUCELOTIDE_NAMES } from 'src/names'
import { colorHash } from 'src/helpers/colorHash'

const clusters = getClusters()
const clusterNames = getClusterNames()

const DEFAULT_COLOR = theme.gray700

export const MutationBadgeBox = styled.span`
  display: inline-block;
  font-size: 0.75rem;
`

export const MutationWrapper = styled.span`
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadows.lighter};

  font-family: ${(props) => props.theme.font.monospace};

  & > span:first-child {
    padding-left: 4px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  & > span:last-child {
    padding-right: 4px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`

export const PrefixText = styled.span`
  padding: 1px 5px;
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme.gray550};
`

export const ParentText = styled.span<{ $color: string }>`
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 5px;
  padding-right: 1px;
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.$color};
`

export const GeneText = styled.span<{ $color: string }>`
  padding: 1px 2px;
  background-color: ${(props) => props.$color};
  color: ${(props) => props.theme.gray100};
  font-weight: 700;
`

export const ColoredText = styled.span<{ $color: string }>`
  padding: 1px 2px;
  background-color: ${(props) => props.$color};
`

export const PositionText = styled.span`
  padding: 1px 2px;
  background-color: ${(props) => props.theme.gray300};
  color: ${(props) => props.theme.gray800};
`

export const VersionText = styled.span`
  padding: 1px 2px;
  background-color: ${(props) => props.theme.gray400};
  color: ${(props) => props.theme.gray800};
`

export function nucleotideMutationFromStringMaybe(mutation: Mutation | string): Mutation | undefined {
  if (typeof mutation === 'string') {
    return parseNucleotideMutation(mutation)
  }
  return mutation
}

export function aminoacidMutationFromStringMaybe(mutation: Mutation | string): Mutation | undefined {
  if (typeof mutation === 'string') {
    return parseAminoacidMutation(mutation)
  }
  return mutation
}

export function formatMutationMaybe(mutation: Mutation | string) {
  if (typeof mutation === 'string') {
    return mutation
  }
  return formatMutation(mutation)
}

export function formatVariantUrl(mutation: string) {
  const cluster = clusters.find(({ display_name }) => display_name === mutation)
  if (!cluster) {
    console.warn(`Variant not recognized: ${mutation}. Known variants: ${clusterNames.join(', ')}`)
    return undefined
  }

  return `/variants/${cluster.build_name}`
}

export interface MutationBadgeProps {
  prefix?: string
  mutation: Mutation
  colors: MutationColors
  tooltip?: string
}

export function MutationBadge({ prefix, mutation, colors, tooltip }: MutationBadgeProps) {
  const { parent, parentDelimiter, gene, left, pos, right, version, note } = mutation

  const parentColor = get(CLADE_COLORS, parent ?? '', DEFAULT_COLOR)
  const geneColor = get(GENE_COLORS, gene ?? '', DEFAULT_COLOR)
  const leftColor = get(colors, left ?? '', DEFAULT_COLOR)
  const rightColor = get(colors, right ?? '', DEFAULT_COLOR)

  const parentDelimiterStr = parentDelimiter ?? ''

  return (
    <MutationBadgeBox title={tooltip}>
      <MutationWrapper>
        {prefix && <PrefixText>{prefix}</PrefixText>}
        {parent && <ParentText $color={parentColor}>{`${parent}${parentDelimiterStr}`}</ParentText>}
        {gene && (
          <>
            <GeneText $color={geneColor}>
              {gene}
              <span>{':'}</span>
            </GeneText>
          </>
        )}
        {left && <ColoredText $color={leftColor}>{left}</ColoredText>}
        {pos && <PositionText>{pos}</PositionText>}
        {right && <ColoredText $color={rightColor}>{right}</ColoredText>}
        {version && <VersionText>{version}</VersionText>}
      </MutationWrapper>
      {note && <span>{note}</span>}
    </MutationBadgeBox>
  )
}

export interface NucleotideMutationBadgeProps {
  mutation: Mutation | string
}

export function NucleotideMutationBadge({ mutation }: NucleotideMutationBadgeProps) {
  const mutationObj = nucleotideMutationFromStringMaybe(mutation)
  if (!mutationObj) {
    return <span>{`Invalid mutation: '${JSON.stringify(mutation)}'`}</span>
  }

  const { left, right, pos } = mutationObj
  const wildTypeBase = get(NUCELOTIDE_NAMES, left ?? '', '')
  const variantBase = get(NUCELOTIDE_NAMES, right ?? '', '')
  const posStr = pos ?? ''
  const tooltip = `Mutation of nucleotide ${posStr} from ${wildTypeBase} to ${variantBase}`

  return <MutationBadge mutation={mutationObj} colors={NUCLEOTIDE_COLORS} tooltip={tooltip} />
}

export interface AminoacidMutationBadgeProps {
  mutation: Mutation | string
}

export function AminoacidMutationBadge({ mutation }: AminoacidMutationBadgeProps) {
  const mutationObj = aminoacidMutationFromStringMaybe(mutation)
  if (!mutationObj) {
    return <span>{`Invalid mutation: '${JSON.stringify(mutation)}'`}</span>
  }

  const { gene, left, pos, right } = mutationObj
  const wildTypeAA = get(AMINOACID_NAMES, left ?? '', '')
  const variantAA = right ? get(AMINOACID_NAMES, right, '') : 'one of several alternatives'
  const geneName = gene ? get(GENE_NAMES, gene, gene) : ''
  const posStr = pos ?? ''
  const tooltip = `Mutation of amino acid ${posStr} in ${geneName} from ${wildTypeAA} to ${variantAA}`

  return <MutationBadge mutation={mutationObj} colors={AMINOACID_COLORS} tooltip={tooltip} />
}

export const LinkUnstyled = styled(LinkSmart)`
  color: unset;
  text-decoration: none;

  &:active,
  &:focus,
  &:hover {
    color: unset;
    text-decoration: none;
  }
`

export function variantToObjectAndString(mutation: Mutation | string) {
  let mutationObj: Mutation | undefined
  let mutationStr: string | undefined

  if (typeof mutation === 'string') {
    mutationObj = parseVariant(mutation)
    mutationStr = mutation
  } else {
    mutationObj = mutation
    mutationStr = formatMutation(mutation)
  }

  return { mutationObj, mutationStr }
}

export interface VariantLinkBadgeProps {
  name: Mutation | string
  href?: string
  prefix?: string
}

export function VariantLinkBadge({ name, href, prefix }: VariantLinkBadgeProps) {
  const { mutationObj, mutationStr } = useMemo(() => variantToObjectAndString(name), [name])
  const url = useMemo(() => href ?? formatVariantUrl(mutationStr), [href, mutationStr])

  if (!mutationObj) {
    return <span className="text-danger">{`VariantLinkBadge: Invalid mutation: ${JSON.stringify(name)}`}</span>
  }

  if (!url) {
    return (
      <span className="text-danger">
        {
          // prettier-ignore
          `VariantLinkBadge: Variant not recognized: ${JSON.stringify(name)}.` +
        `Known variants: ${clusterNames.join(', ')}`
        }
      </span>
    )
  }

  return (
    <LinkUnstyled href={url} icon={null}>
      <MutationBadge prefix={prefix} mutation={mutationObj} colors={AMINOACID_COLORS} />
    </LinkUnstyled>
  )
}

export const ColoredComponent = styled.span<{ $color: string }>`
  background-color: ${(props) => props.$color};
`

export interface LineageLinkBadgeProps {
  name: string
  href?: string
  prefix?: string
  report?: boolean
}

export function LineageLinkBadge({ name, href, prefix, report }: LineageLinkBadgeProps) {
  const url = useMemo(
    // prettier-ignore
    () => (href ?? report ? `https://cov-lineages.org/global_report_${name}.html` : ''),
    [href, report, name],
  )
  const tooltip = useMemo(() => `Pango Lineage ${name}`, [name])
  const components = useMemo(() => name.split('.'), [name])

  return (
    <LinkUnstyled href={url}>
      <MutationBadgeBox title={tooltip}>
        <MutationWrapper>
          {prefix && <PrefixText>{prefix}</PrefixText>}
          {components.map((component, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ColoredComponent $color={colorHash(component)} key={`${component}-${i}`}>
              {component}
              {i < components.length - 1 && <span>{'.'}</span>}
            </ColoredComponent>
          ))}
        </MutationWrapper>
      </MutationBadgeBox>
    </LinkUnstyled>
  )
}

/** Shorter convenience alias for NucleotideMutationBadge */
export function NucMut({ mut }: { mut: string }) {
  return <NucleotideMutationBadge mutation={mut} />
}

/** Shorter convenience alias for AminoacidMutationBadge */
export function AaMut({ mut }: { mut: string }) {
  return <AminoacidMutationBadge mutation={mut} />
}

/** Shorter convenience alias for VariantLinkBadge */
export function Var({ name, href, prefix = 'Variant' }: { name: string; href?: string; prefix?: string }) {
  return <VariantLinkBadge name={name} href={href} prefix={prefix} />
}

/** Shorter convenience alias for VariantLinkBadge */
export function Mut({ name, href, prefix = 'Mutation' }: { name: string; href?: string; prefix?: string }) {
  return <VariantLinkBadge name={name} href={href} prefix={prefix} />
}

/** Shorter convenience alias for LineageLinkBadge */
export function Lin({ name, href, prefix = '', report }: LineageLinkBadgeProps) {
  return <LineageLinkBadge name={name} href={href} prefix={prefix} report={report} />
}
