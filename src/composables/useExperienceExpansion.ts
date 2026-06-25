import { computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toFlagCode, getFlagSvgByCode } from '../content/data/experiences'
import { useExpansionState } from './useExpansionState'

export interface ExperienceCard {
  id: string
  title: string
  company: string
  languages?: string[]
  technologies?: string[]
  description: string
}

export interface ExperienceGroup {
  id: number
  period: string
  location?: string
  cards: ExperienceCard[]
}

/**
 * Manages experience data transformation and expansion state
 * Handles locale-specific content and card grouping
 */
export function useExperienceExpansion(experiences: Ref<any[]>) {
  const { locale } = useI18n()
  const { expanded, isExpanded, toggleExpanded } = useExpansionState(false)

  const currentLocale = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))

  const experienceGroups = computed<ExperienceGroup[]>(() => {
    const localeKey = currentLocale.value

    return experiences.value.map((experience) => {
      const localizedContent = experience.content[localeKey]
      const sections = localizedContent.sections ?? []

      if (sections.length > 1) {
        return {
          id: experience.id,
          period: localizedContent.period,
          location: localizedContent.location,
          cards: sections.map((section: any, sectionIndex: number) => ({
            id: `${experience.id}-section-${sectionIndex}`,
            title: section.title,
            company: localizedContent.company,
            languages: localizedContent.languages,
            technologies: section.technologies,
            description: section.description,
          })),
        }
      }

      return {
        id: experience.id,
        period: localizedContent.period,
        location: localizedContent.location,
        cards: [{
          id: String(experience.id),
          title: localizedContent.role,
          company: localizedContent.company,
          languages: localizedContent.languages,
          technologies: localizedContent.technologies ?? sections[0]?.technologies,
          description: localizedContent.description ?? sections[0]?.description ?? '',
        }],
      }
    })
  })

  function getLanguageFlags(languages?: string[]) {
    return (
      (languages ?? [])
        .map(toFlagCode)
        .filter((code): code is string => Boolean(code))
        .map((code) => ({ code, src: getFlagSvgByCode(code) }))
        .filter((flag): flag is { code: string; src: string } => Boolean(flag.src))
    )
  }

  return {
    currentLocale,
    experienceGroups,
    getLanguageFlags,
    isExpanded,
    toggleExpanded,
    expandedExperienceIds: expanded as Ref<string[]>
  }
}
