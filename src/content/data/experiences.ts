import { ref } from 'vue'
import { getExperiences } from './profile'
import { getFlagSvgByCode, toFlagCode } from './languageFlags'

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

export { getFlagSvgByCode, toFlagCode }

export function useExperiencesData() {
  return { experiences: ref<Experience[]>(getExperiences()) }
}