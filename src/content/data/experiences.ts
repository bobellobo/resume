import { ref } from 'vue'
import rawExperiences from '@content/experiences/experiences.json'
import flagFr from 'flag-icons/flags/4x3/fr.svg'
import flagGb from 'flag-icons/flags/4x3/gb.svg'
import flagIt from 'flag-icons/flags/4x3/it.svg'

const LANGUAGE_TO_COUNTRY_CODE: Record<string, string> = {
  en: 'gb',
  es: 'es',
  fr: 'fr',
  it: 'it'
}

const REGIONAL_INDICATOR_START = 0x1f1e6
const REGIONAL_INDICATOR_END = 0x1f1ff

const FLAG_SVG_BY_COUNTRY_CODE: Record<string, string> = {
  fr: flagFr,
  gb: flagGb,
  it: flagIt,
}

export interface ExperienceSection {
  title: string
  description: string
  technologies?: string[]
}

export interface ExperienceContent {
  period: string
  role: string
  company: string
  location?: string
  description?: string
  technologies?: string[]
  languages?: string[]
  sections?: ExperienceSection[]
}

export interface Experience {
  id: number
  languages?: string[]
  content: {
    en: ExperienceContent
    fr: ExperienceContent
  }
}

const toCountryCodeFromEmoji = (value: string): string | null => {
  const codePoints = Array.from(value).map((char) => char.codePointAt(0) ?? 0)

  if (
    codePoints.length !== 2
    || codePoints.some((codePoint) => codePoint < REGIONAL_INDICATOR_START || codePoint > REGIONAL_INDICATOR_END)
  ) {
    return null
  }

  return String.fromCharCode(
    codePoints[0] - REGIONAL_INDICATOR_START + 65,
    codePoints[1] - REGIONAL_INDICATOR_START + 65,
  ).toLowerCase()
}

export const toFlagCode = (value: string): string | null => {
  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    return null
  }

  const emojiCountryCode = toCountryCodeFromEmoji(normalized)
  if (emojiCountryCode) {
    return emojiCountryCode
  }

  if (!/^[a-z]{2}$/.test(normalized)) {
    return null
  }

  return LANGUAGE_TO_COUNTRY_CODE[normalized] ?? normalized
}

export const getFlagSvgByCode = (code: string): string | null => (
  FLAG_SVG_BY_COUNTRY_CODE[code] ?? null
)

export function useExperiencesData() {
  return { experiences: ref<Experience[]>(rawExperiences as Experience[]) }
}