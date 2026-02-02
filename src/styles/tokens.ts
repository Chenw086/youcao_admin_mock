import tokens from '../../design-tokens.json'

export interface ThemeTokens {
  colors: Record<string, string>
  spacing: Record<string, string>
  radius: Record<string, string>
  typography: Record<string, string>
}

export const themeTokens = tokens as ThemeTokens

function ensureTokenValue(
  value: string | undefined,
  token: string,
  group: keyof ThemeTokens,
): string {
  if (typeof value === 'undefined') {
    throw new Error(`[tokens] Missing ${String(group)} token: ${token}`)
  }

  return value
}

export type ColorToken = keyof ThemeTokens['colors']
export type SpacingToken = keyof ThemeTokens['spacing']
export type RadiusToken = keyof ThemeTokens['radius']

export function getColorValue(token: ColorToken): string {
  return ensureTokenValue(themeTokens.colors[token], String(token), 'colors')
}

export function getSpacingValue(token: SpacingToken): string {
  return ensureTokenValue(themeTokens.spacing[token], String(token), 'spacing')
}

export function getRadiusValue(token: RadiusToken): string {
  return ensureTokenValue(themeTokens.radius[token], String(token), 'radius')
}
