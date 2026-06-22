<template>
  <section id="experience" class="experience section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('experience.title') }}</h2>

      <div class="experience-zigzag" role="list">
        <article
          v-for="(group, index) in experienceGroups"
          :key="group.id"
          class="experience-zigzag-item"
          :class="{ 'is-even': index % 2 === 1 }"
          role="listitem"
        >
          <span class="experience-zigzag-dot" aria-hidden="true"></span>
          <div class="experience-zigzag-meta">
            <time class="experience-period">{{ group.period }}</time>
            <p v-if="group.location" class="experience-location">{{ group.location }}</p>
          </div>

          <div class="experience-zigzag-cards">
            <div
              v-for="card in group.cards"
              :key="card.id"
              class="experience-zigzag-content surface-card"
            >
              <button
                type="button"
                class="experience-card-head"
                :aria-expanded="isExpanded(card.id)"
                :aria-controls="`experience-panel-${card.id}`"
                @click="toggleExpanded(card.id)"
              >
                <div class="experience-card-title-section">
                  <h3 class="experience-card-role">{{ card.title }}</h3>
                  <div class="experience-card-company-row">
                    <span class="experience-company-label">{{ card.company }}</span>
                    <ul
                      v-if="card.languages?.length"
                      class="experience-languages-list"
                      :aria-label="$t('experience.languagesLabel')"
                    >
                      <li
                        v-for="(languageFlag, languageIndex) in getLanguageFlags(card.languages)"
                        :key="`${card.id}-language-${languageIndex}`"
                        class="experience-language-item"
                        :aria-label="languageFlag.code.toUpperCase()"
                      >
                        <img class="flag-icon" :src="languageFlag.src" alt="" aria-hidden="true">
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="experience-card-toggle">
                  <Icon :icon="isExpanded(card.id) ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="experience-card-toggle-icon" />
                </div>
              </button>

              <Transition name="experience-expand">
                <div
                  v-if="isExpanded(card.id)"
                  :id="`experience-panel-${card.id}`"
                  class="experience-card-details"
                >
                  <ul
                    v-if="card.technologies?.length"
                    class="experience-technologies-list"
                    :aria-label="$t('experience.technologiesLabel')"
                  >
                    <li
                      v-for="technology in card.technologies"
                      :key="`${card.id}-${technology}`"
                      class="experience-tech-badge"
                    >
                      {{ technology }}
                    </li>
                  </ul>
                  <p class="experience-details-text">{{ card.description }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useExperiencesData, toFlagCode, getFlagSvgByCode } from '../../content/data/experiences'

const { locale } = useI18n()
const { experiences } = useExperiencesData()
const expandedExperienceIds = ref<string[]>([])

interface ExperienceCard {
  id: string
  title: string
  company: string
  languages?: string[]
  technologies?: string[]
  description: string
}

interface ExperienceGroup {
  id: number
  period: string
  location?: string
  cards: ExperienceCard[]
}

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
        cards: sections.map((section, sectionIndex) => ({
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

const getLanguageFlags = (languages?: string[]) => (
  (languages ?? [])
    .map(toFlagCode)
    .filter((code): code is string => Boolean(code))
    .map((code) => ({ code, src: getFlagSvgByCode(code) }))
    .filter((flag): flag is { code: string; src: string } => Boolean(flag.src))
)

const isExpanded = (id: string) => expandedExperienceIds.value.includes(id)

const toggleExpanded = (id: string) => {
  expandedExperienceIds.value = isExpanded(id)
    ? expandedExperienceIds.value.filter((currentId) => currentId !== id)
    : [...expandedExperienceIds.value, id]
}
</script>

<style scoped src="./Experience.css"></style>
