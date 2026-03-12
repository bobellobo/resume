import { ref } from 'vue'
import rawExperiences from '@content/experiences/experiences.json'

export interface ExperienceContent {
  period: string
  role: string
  company: string
  location: string
  description: string
}

export interface Experience {
  id: number
  content: {
    en: ExperienceContent
    fr: ExperienceContent
  }
}

export function useExperiencesData() {
  return { experiences: ref<Experience[]>(rawExperiences as Experience[]) }
}