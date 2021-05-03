import React from 'react'

import { get, sortBy, reverse, uniqBy } from 'lodash'
import { useSelector } from 'react-redux'
import { ColoredHorizontalLineIcon } from 'src/components/Common/ColoredHorizontalLineIcon'
import { theme } from 'src/theme'
import styled from 'styled-components'

import type { ClusterDistributionDatum } from 'src/components/ClusterDistribution/ClusterDistributionPlot'
import type { Props as DefaultTooltipContentProps } from 'recharts/types/component/DefaultTooltipContent'
import { selectPerCountryTooltipSortBy, selectPerCountryTooltipSortReversed } from 'src/state/ui/ui.selectors'
import { formatDateBiweekly, formatProportion } from 'src/helpers/format'
import { getCountryColor, getCountryStrokeDashArray } from 'src/io/getCountryColor'

const EPSILON = 1e-2

const Tooltip = styled.div`
  display: flex;
  flex-direction: column;

  padding: 5px 10px;
  background-color: ${(props) => props.theme.plot.tooltip.background};
  box-shadow: ${(props) => props.theme.shadows.slight};
  border-radius: 3px;
`

const TooltipTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  margin: 5px auto;
`

const TooltipTable = styled.table`
  padding: 30px 35px;
  font-size: 0.9rem;
  border: none;
  min-width: 250px;

  background-color: ${(props) => props.theme.plot.tooltip.table.backgroundEven};

  & > tbody > tr:nth-child(odd) {
    background-color: ${(props) => props.theme.plot.tooltip.table.backgroundOdd};
  }
`

const TooltipFooter = styled.div`
  margin: 5px;
`

const TooltipTableBody = styled.tbody``

export type ClusterDistributionPlotTooltipProps = DefaultTooltipContentProps<number, string>

export function ClusterDistributionPlotTooltip(props: ClusterDistributionPlotTooltipProps) {
  const perCountryTooltipSortBy = useSelector(selectPerCountryTooltipSortBy)
  const perCountryTooltipSortReversed = useSelector(selectPerCountryTooltipSortReversed)

  const { payload } = props
  if (!payload || payload.length === 0) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = payload[0]?.payload as ClusterDistributionDatum

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const week = formatDateBiweekly(data?.week)

  let payloadSorted = sortBy(payload, perCountryTooltipSortBy === 'country' ? 'name' : 'value')

  // sortBy sorts in ascending order, but if sorting by frequency the natural/non-reversed order is descending

  if (
    (perCountryTooltipSortBy !== 'frequency' && perCountryTooltipSortReversed) ||
    (perCountryTooltipSortBy === 'frequency' && !perCountryTooltipSortReversed)
  ) {
    payloadSorted = reverse(payloadSorted)
  }

  const payloadUnique = uniqBy(payloadSorted, (payload) => payload.name)

  return (
    <Tooltip>
      <TooltipTitle>{week}</TooltipTitle>

      <TooltipTable>
        <thead>
          <tr className="w-100">
            <th className="px-2 text-left">{'Country'}</th>
            <th />
            <th className="px-2 text-right">{'Frequency'}</th>
          </tr>
        </thead>
        <TooltipTableBody>
          {/* @ts-ignore */}
          {payloadUnique.map(({ name, value, payload }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const interpolated = !get(payload?.orig, name, false) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
            const country = name ?? '?'
            return (
              <tr key={name}>
                <td className="px-2 text-left">
                  <ColoredHorizontalLineIcon
                    width={theme.plot.country.legend.lineIcon.width}
                    height={theme.plot.country.legend.lineIcon.height}
                    stroke={getCountryColor(country)}
                    strokeWidth={theme.plot.country.legend.lineIcon.thickness}
                    strokeDasharray={getCountryStrokeDashArray(country)}
                  />
                  <span className="ml-2">{country}</span>
                </td>
                <td>{interpolated && '*'}</td>
                <td className="px-2 text-right">
                  {value !== undefined && value > EPSILON ? formatProportion(value) : '-'}
                </td>
              </tr>
            )
          })}
        </TooltipTableBody>
      </TooltipTable>

      <TooltipFooter>
        <small>{'* Interpolated values'}</small>
      </TooltipFooter>
    </Tooltip>
  )
}
