import { ref } from 'vue'
import rawSkills from '@content/skills/skills.json'

export interface SkillItem {
  text: string
  isJoke?: boolean // will strike out the text
}

export interface SkillCategoryContent {
  title: string
  items: SkillItem[]
}

export interface SkillCategory {
  id: string
  content: {
    en: SkillCategoryContent
    fr: SkillCategoryContent
  }
}

export function useSkillsData() {
  return { skills: ref<SkillCategory[]>(rawSkills as SkillCategory[]) }
}