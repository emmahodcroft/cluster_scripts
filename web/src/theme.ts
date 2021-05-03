import { rgba } from 'polished'

const gridBreakpoints = {
  xs: '0',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '2000px',
}

const containerMaxWidths = {
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  xxl: '1950px',
}

export const white = '#ffffff'
export const gray100 = '#f8f9fa'
export const gray150 = '#eff1f3'
export const gray200 = '#e9ecef'
export const gray250 = '#e5e8ea'
export const gray300 = '#dee2e6'
export const gray400 = '#ced4da'
export const gray500 = '#adb5bd'
export const gray550 = '#979fa7'
export const gray600 = '#7b838a'
export const gray650 = '#626a71'
export const gray700 = '#495057'
export const gray800 = '#343a40'
export const gray900 = '#212529'
export const black = '#000'

export const blue = '#2196f3'
export const indigo = '#6610f2'
export const purple = '#6f42c1'
export const pink = '#e83e8c'
export const red = '#e51c23'
export const orange = '#fd7e14'
export const yellow = '#ff9800'
export const green = '#4caf50'
export const teal = '#20c997'
export const cyan = '#9c27b0'

export const primary = blue
export const secondary = gray100
export const success = green
export const info = cyan
export const warning = yellow
export const danger = red
export const light = white
export const dark = gray700

export const basicColors = {
  white,
  gray100,
  gray150,
  gray200,
  gray250,
  gray300,
  gray400,
  gray500,
  gray550,
  gray600,
  gray650,
  gray700,
  gray800,
  gray900,
  black,
  blue,
  indigo,
  purple,
  pink,
  red,
  orange,
  yellow,
  green,
  teal,
  cyan,
}

export const themeColors = {
  primary,
  secondary,
  success,
  info,
  warning,
  danger,
  light,
  dark,
}

export const font = {
  sansSerif: `'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'system-ui', 'system-sans', 'sans-serif'`,
  monospace: `'Roboto Mono', 'system-mono'`,
  default: 'sans-serif',
}

export const shadows = {
  lighter: `1px 1px 1px 1px ${rgba(gray500, 0.2)}`,
  light: `1px 1px 2px 2px ${rgba(gray600, 0.2)}`,
  slight: `2px 2px 2px 2px ${rgba(gray700, 0.25)}`,
  medium: `2px 2px 3px 3px ${rgba(gray700, 0.25)}`,
  normal: `2px 2px 3px 3px ${rgba(gray900, 0.25)}`,
  thick: `3px 3px 3px 5px ${rgba(gray900, 0.33)}`,
  filter: {
    slight: `1px 1px 1px ${rgba(gray700, 0.25)}`,
    medium: `2px 2px 3px ${rgba(gray900, 0.33)}`,
  },
}

export const plot = {
  titleFontSize: '1.25rem',
  aspectRatio: 1.88,
  margin: { left: -20, top: 5, bottom: 5, right: 10 },
  tickStyle: { fontSize: 12 },
  tickWidthMin: 70,
  tooltip: {
    background: white,
    table: {
      backgroundEven: gray100,
      backgroundOdd: gray200,
    },
  },
  country: {
    legend: {
      lineIcon: {
        thickness: 2,
        width: 20,
        height: 20,
      },
    },
  },
  cartesianGrid: {
    stroke: '#2222',
  },
}

export const link = {
  dim: {
    color: basicColors.gray650,
    iconColor: basicColors.gray600,
  },
}

export const iframe = {
  nextstrain: {
    aspectRatio: {
      small: 9 / 16,
      big: 16 / 9,
    },
  },
}

export const code = {
  pre: {
    background: gray300,
  },
}

export const clusters = {
  color: {
    unknown: '#aaaaaa',
    others: '#cccccc',
  },
}

export const theme = {
  ...basicColors,
  ...themeColors,
  ...gridBreakpoints,
  link,
  containerMaxWidths,
  font,
  shadows,
  plot,
  iframe,
  code,
  clusters,
}

export type Theme = typeof theme
