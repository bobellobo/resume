<template>
  <section id="experience" class="home-stack-section experience">
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
              class="experience-zigzag-content"
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
                      class="tech-badge"
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
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useExperiencesData } from '../../content/data/experiences'
import { useExperienceExpansion } from '../../composables/useExperienceExpansion'

const { experiences } = useExperiencesData()
const { experienceGroups, getLanguageFlags, isExpanded, toggleExpanded } = useExperienceExpansion(experiences)
</script>

<style scoped src="./Experience.css"></style>
