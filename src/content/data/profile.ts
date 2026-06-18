import rawProfile from '@content/json/profile.json'
import type { SupportedLocale } from '../locale'
import type { Experience } from './experiences'
import type { SkillCategory } from './skills'

export interface ProfileTextContent {
  universityLabel: string
  skillsTitle: string
  exportRole: string
  exportDocumentLabel: string
  photoAlt: string
  footerCopyright: string
  description: string
  exportDescription: string
}

export interface ContactInfo {
  email: string
  phone: string
  linkedin: string
  github: string
}

export interface TemplateInfo {
  showNotice: boolean
  repoUrl: string
}

interface ProfileData {
  contact: ContactInfo
  template?: TemplateInfo
  content: {
    en: ProfileTextContent
    fr: ProfileTextContent
  }
  experiences: Experience[]
  skills: SkillCategory[]
}

const UNIVERSITY_TOKEN = '{university}'
const profileData = rawProfile as ProfileData

export const getProfileContent = (locale: SupportedLocale): ProfileTextContent => (
  locale === 'fr' ? profileData.content.fr : profileData.content.en
)

export const getContactInfo = (): ContactInfo => profileData.contact

export const getTemplateInfo = (): TemplateInfo => ({
  showNotice: profileData.template?.showNotice ?? false,
  repoUrl: profileData.template?.repoUrl ?? ''
})

export const getExperiences = (): Experience[] => profileData.experiences

export const getSkills = (): SkillCategory[] => profileData.skills

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