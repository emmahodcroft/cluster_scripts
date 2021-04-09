import React from 'react'

import { get } from 'lodash'
import urljoin from 'url-join'
import { ServerStyleSheet } from 'styled-components'
import NextDocument, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'

import {
  DOMAIN,
  URL_MANIFEST_JSON,
  URL_FAVICON,
  TWITTER_USERNAME_FRIENDLY,
  SOCIAL_IMAGE_WIDTH,
  SOCIAL_IMAGE_HEIGHT,
} from 'src/constants'
import { SEO_DEFAULT, SEO_OVERRIDES } from 'src/seo/seoMetadata'

const lang = 'en'
const localeFull = 'en-US'

export const GenericIcons = [16, 32, 96, 128, 196].map((size) => {
  const sizes = `${size}x${size}`
  return <link key={size} rel="icon" type="image/png" sizes={sizes} href={`${DOMAIN}/icons/favicon-${sizes}.png`} />
})

export const AppleIcons = [57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => {
  const sizes = `${size}x${size}`
  return (
    <React.Fragment key={size}>
      <link rel="apple-touch-icon" sizes={sizes} href={`${DOMAIN}/icons/apple-touch-icon-${sizes}.png`} />
      <link
        rel="apple-touch-icon-precomposed"
        sizes={sizes}
        href={`${DOMAIN}/icons/apple-touch-icon-${sizes}-precomposed.png`}
      />
    </React.Fragment>
  )
})

export const MicrosoftIcons = (
  <>
    <meta name="msapplication-config" content={`${DOMAIN}/browserconfig.xml`} />
    <meta name="msapplication-TileColor" content="#2b5797" />
    <meta name="msapplication-square70x70logo" content={`${DOMAIN}/icons/mstile-70x70.png`} />
    <meta name="msapplication-TileImage" content={`${DOMAIN}/icons/mstile-144x144.png`} />
    <meta name="msapplication-square150x150logo" content={`${DOMAIN}/icons/mstile-150x150.png`} />
    <meta name="msapplication-wide310x150logo" content={`${DOMAIN}/icons/mstile-310x150.png`} />
    <meta name="msapplication-square310x310logo" content={`${DOMAIN}/icons/mstile-310x310.png`} />
  </>
)

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({ enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />) })

      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const pathname = this.props.dangerousAsPath
    const url = urljoin(DOMAIN, pathname)

    // eslint-disable-next-line prefer-const
    let { name, description, image } = { ...SEO_DEFAULT, ...get(SEO_OVERRIDES, pathname, SEO_DEFAULT) }

    if (image) {
      image = urljoin(DOMAIN, image)
    }

    return (
      <Html lang={lang}>
        <Head>
          <meta charSet="UTF-8" />

          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href={URL_MANIFEST_JSON} />
          <link rel="shortcut icon" href={URL_FAVICON} />

          {GenericIcons}

          {AppleIcons}
          <link rel="mask-icon" href={`${DOMAIN}/icons/safari-pinned-tab.svg" color="#555555`} />

          {MicrosoftIcons}

          <title>{name}</title>

          <meta name="description" content={description} />
          <meta name="application-name" content={name} />

          <meta key="description" itemProp="description" content={description} />
          <meta key="image" itemProp="image" content={image} />
          <meta key="name" itemProp="name" content={name} />
          <meta key="og:description" property="og:description" content={description} />
          <meta key="og:image" property="og:image" content={image} />
          <meta key="og:image:secure_url" property="og:image:secure_url" content={image} />
          <meta key="og:image:type" property="og:image:type" content="image/png" />
          <meta key="og:image:width" property="og:image:width" content={SOCIAL_IMAGE_WIDTH} />
          <meta key="og:image:height" property="og:image:height" content={SOCIAL_IMAGE_HEIGHT} />
          <meta key="og:locale" property="og:locale" content={localeFull} />
          <meta key="og:title" property="og:title" content={name} />
          <meta key="og:type" property="og:type" content="website" />
          <meta key="og:url" property="og:url" content={url} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:image:alt" content={description} />
          <meta name="twitter:title" content={name} />
          <meta name="twitter:url" content={url} />
          <meta name="twitter:site" content={TWITTER_USERNAME_FRIENDLY} />
          <script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossOrigin="anonymous" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
