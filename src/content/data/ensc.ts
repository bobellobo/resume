import rawEnsc from '@content/json/ensc.json'
import type { SupportedLocale } from '../locale'

export interface EnscContent {
  eyebrow: string
  title: string
  shortTitle: string
  description: string
  article: string
  location: string
  founded: string
  programs: string[]
}

interface EnscData {
  website: string
  content: {
    en: EnscContent
    fr: EnscContent
  }
}

const enscData = rawEnsc as EnscData

export const getEnscContent = (locale: SupportedLocale): EnscContent => (
  locale === 'fr' ? enscData.content.fr : enscData.content.en
)

export const getEnscWebsite = (): string => enscData.website
