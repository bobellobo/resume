import rawProfile from '@content/profile/profile.json'
import type { SupportedLocale } from '../locale'

export interface ProfileTextContent {
  description: string
  exportDescription: string
}

interface ProfileData {
  content: {
    en: ProfileTextContent
    fr: ProfileTextContent
  }
}

const UNIVERSITY_TOKEN = '{university}'
const profileData = rawProfile as ProfileData

export const getProfileContent = (locale: SupportedLocale): ProfileTextContent => (
  locale === 'fr' ? profileData.content.fr : profileData.content.en
)

export const splitUniversityPlaceholder = (text: string) => {
  const tokenIndex = text.indexOf(UNIVERSITY_TOKEN)

  if (tokenIndex < 0) {
    return {
      before: text,
      after: ''
    }
  }

  return {
    before: text.slice(0, tokenIndex),
    after: text.slice(tokenIndex + UNIVERSITY_TOKEN.length)
  }
}