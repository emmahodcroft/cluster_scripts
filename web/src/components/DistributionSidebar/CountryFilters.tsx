import React, { useCallback, useMemo } from 'react'

import {
  Button,
  CardBody as CardBodyBase,
  Col,
  Container,
  Form as FormBase,
  FormGroup as FormGroupBase,
  Input,
  Label,
  Row,
} from 'reactstrap'
import styled from 'styled-components'

import type { CountryState } from 'src/components/CountryDistribution/CountryDistributionPage'
import { theme } from 'src/theme'
import { getCountryColor, getCountryFlag, getCountryStrokeDashArray } from 'src/io/getCountryColor'
import { CardCollapsible } from 'src/components/Common/CardCollapsible'
import { ColoredHorizontalLineIcon } from '../Common/ColoredHorizontalLineIcon'

export const CardBody = styled(CardBodyBase)``

export const FormGroup = styled(FormGroupBase)`
  flex: 1 0 265px;
`

export const Form = styled(FormBase)`
  display: flex;
  flex-wrap: wrap;
`

export interface CountryFilterCheckboxProps {
  country: string
  enabled: boolean
  withIcons?: boolean
  onFilterChange(country: string): void
}

export function CountryFilterCheckbox({ country, enabled, withIcons, onFilterChange }: CountryFilterCheckboxProps) {
  const onChange = useCallback(() => onFilterChange(country), [country, onFilterChange])

  return (
    <FormGroup check>
      <Label htmlFor={CSS.escape(country)} check>
        <Input id={CSS.escape(country)} type="checkbox" checked={enabled} onChange={onChange} />
        {withIcons ? (
          <span>{getCountryFlag(country)}</span>
        ) : (
          <ColoredHorizontalLineIcon
            width={theme.plot.country.legend.lineIcon.width}
            height={theme.plot.country.legend.lineIcon.height}
            stroke={getCountryColor(country)}
            strokeWidth={theme.plot.country.legend.lineIcon.thickness}
            strokeDasharray={getCountryStrokeDashArray(country)}
          />
        )}
        <span className="ml-2">{country}</span>
      </Label>
    </FormGroup>
  )
}

export interface CountryFiltersProps {
  countries: CountryState
  collapsed: boolean
  withIcons?: boolean
  onFilterChange(country: string): void
  onFilterSelectAll(): void
  onFilterDeselectAll(): void
  setCollapsed(collapsed: boolean): void
}

export function CountryFilters({
  countries,
  collapsed,
  withIcons,
  onFilterSelectAll,
  onFilterDeselectAll,
  onFilterChange,
  setCollapsed,
}: CountryFiltersProps) {
  const filters = useMemo(() => Object.entries(countries), [countries])

  return (
    <CardCollapsible className="m-2" title={'Countries'} collapsed={collapsed} setCollapsed={setCollapsed}>
      <CardBody>
        <Container fluid>
          <Row noGutters>
            <Col className="d-flex">
              <FormGroup className="flex-grow-0 mx-auto">
                <Button type="button" color="link" onClick={onFilterSelectAll}>
                  {'Select all'}
                </Button>
                <Button type="button" color="link" onClick={onFilterDeselectAll}>
                  {'Deselect all'}
                </Button>
              </FormGroup>
            </Col>
          </Row>

          <Row noGutters>
            <Col>
              <Form>
                {filters.map(([country, { enabled }]) => (
                  <CountryFilterCheckbox
                    key={country}
                    country={country}
                    enabled={enabled}
                    withIcons={withIcons}
                    onFilterChange={onFilterChange}
                  />
                ))}
              </Form>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </CardCollapsible>
  )
}
