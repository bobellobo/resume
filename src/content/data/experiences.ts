import { ref } from 'vue'
import rawExperiences from '@content/experiences/experiences.json'

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

export function useExperiencesData() {
  return { experiences: ref<Experience[]>(rawExperiences as Experience[]) }
}