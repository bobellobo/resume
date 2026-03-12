export type SupportedLocale = 'en' | 'fr'

export const getSupportedLocale = (locale: string): SupportedLocale => (
  locale === 'fr' ? 'fr' : 'en'
)