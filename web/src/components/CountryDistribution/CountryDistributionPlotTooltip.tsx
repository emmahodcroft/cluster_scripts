import React from 'react'

import { sortBy, reverse } from 'lodash'
import styled from 'styled-components'
import { Props as DefaultTooltipContentProps } from 'recharts/types/component/DefaultTooltipContent'

import { formatDateBiweekly, formatInteger, formatProportion } from 'src/helpers/format'
import { getClusterColor } from 'src/io/getClusters'
import { ColoredBox } from '../Common/ColoredBox'

const EPSILON = 1e-2

const Tooltip = styled.div`
  display: flex;
  flex-direction: column;

  padding: 5px 10px;
  background-color: ${(props) => props.theme.gray100};
  box-shadow: ${(props) => props.theme.shadows.slight};
  border-radius: 3px;
`

const TooltipTitle = styled.h1`
  font-size: 1rem;
  margin: 5px auto;
`

const TooltipTable = styled.table`
  padding: 30px 35px;
  font-size: 0.9rem;
  border: none;
  min-width: 250px;

  & > tbody > tr:nth-child(odd) {
    background-color: ${(props) => props.theme.gray200};
  }
`

const TooltipTableBody = styled.tbody``

export function CountryDistributionPlotTooltip(props: DefaultTooltipContentProps<number, string>) {
  const { payload } = props
  if (!payload || payload.length === 0) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const week = formatDateBiweekly(payload[0]?.payload.week)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const total: number = formatInteger(payload[0]?.payload.total ?? 0)

  const payloadSorted = reverse(sortBy(payload, 'value'))

  return (
    <Tooltip>
      <TooltipTitle>{week}</TooltipTitle>

      <TooltipTable>
        <thead>
          <tr className="w-100">
            <th className="px-2 text-left">{'Variant'}</th>
            <th className="px-2 text-right">{'Num seq'}</th>
            <th className="px-2 text-right">{'Freq'}</th>
          </tr>
        </thead>
        <TooltipTableBody>
          {payloadSorted.map(({ name, value }) => (
            <tr key={name}>
              <td className="px-2 text-left">
                <ColoredBox $color={getClusterColor(name ?? '')} $size={10} $aspect={1.66} />
                <span>{name}</span>
              </td>
              <td className="px-2 text-right">{value !== undefined && value > EPSILON ? formatInteger(value) : '-'}</td>
              <td className="px-2 text-right">
                {value !== undefined && value > EPSILON ? formatProportion(value / total) : '-'}
              </td>
            </tr>
          ))}

          <tr>
            <td className="px-2 text-left">
              <span>
                <b>{'Total'}</b>
              </span>
            </td>
            <td className="px-2 text-right">{total}</td>
            <td className="px-2 text-right">{'1.00'}</td>
          </tr>
        </TooltipTableBody>
      </TooltipTable>
    </Tooltip>
  )
}
