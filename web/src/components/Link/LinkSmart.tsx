import React, { useMemo } from 'react'

import type { StrictOmit } from 'ts-essentials'
import isAbsoluteUrl from 'is-absolute-url'

import { Link, LinkProps } from './Link'
import { LinkExternal, LinkExternalProps } from './LinkExternal'

export interface LinkSmartProps extends StrictOmit<LinkProps, 'href'> {
  href?: string
}

export function LinkSmart({ href, ...restProps }: LinkSmartProps & LinkExternalProps) {
  const external = useMemo(() => isAbsoluteUrl(href ?? ''), [href])

  if (!href) {
    return <span {...restProps} />
  }

  if (external) {
    return <LinkExternal href={href} {...restProps} />
  }

  return <Link href={href} {...restProps} />
}
