<template>
  <section id="experience" class="experience section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('experience.title') }}</h2>

      <div class="timeline" role="list">
        <article
          v-for="item in experiences"
          :key="item.id"
          class="timeline-item"
          role="listitem"
        >
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="timeline-card surface-card">
            <p class="timeline-period">{{ item.content[currentLocale].period }}</p>

            <p class="timeline-company">{{ item.content[currentLocale].company }}<span v-if="item.content[currentLocale].location" class="timeline-location"> · {{ item.content[currentLocale].location }}</span></p>

            <div class="timeline-role-row">
              <div class="timeline-role-title-group">
                <h3 class="timeline-role">{{ item.content[currentLocale].role }}</h3>
                <ul
                  v-if="item.content[currentLocale].languages?.length"
                  class="experience-languages"
                  :aria-label="$t('experience.languagesLabel')"
                >
                  <li
                    v-for="(languageFlag, index) in item.content[currentLocale].languages"
                    :key="`${item.id}-language-${index}`"
                    class="experience-language"
                    :aria-label="languageFlag"
                  >
                    {{ languageFlag }}
                  </li>
                </ul>
              </div>
              <ul
                v-if="item.content[currentLocale].technologies?.length"
                class="experience-tags"
                :aria-label="$t('experience.technologiesLabel')"
              >
                <li
                  v-for="technology in item.content[currentLocale].technologies"
                  :key="`${item.id}-${technology}`"
                  class="experience-tag"
                >
                  {{ technology }}
                </li>
              </ul>
            </div>

            <template v-if="item.content[currentLocale].sections && item.content[currentLocale].sections!.length > 1">
              <p v-if="item.content[currentLocale].description" class="timeline-description">{{ item.content[currentLocale].description }}</p>
              <div class="timeline-sections">
                <div
                  v-for="(section, index) in item.content[currentLocale].sections"
                  :key="index"
                  class="timeline-section"
                >
                  <div class="timeline-section-head">
                    <h4 class="timeline-section-title">{{ section.title }}</h4>
                    <ul
                      v-if="section.technologies?.length"
                      class="experience-tags experience-tags-inline"
                      :aria-label="$t('experience.technologiesLabel')"
                    >
                      <li
                        v-for="technology in section.technologies"
                        :key="`${item.id}-${index}-${technology}`"
                        class="experience-tag"
                      >
                        {{ technology }}
                      </li>
                    </ul>
                  </div>
                  <p class="timeline-description">{{ section.description }}</p>
                </div>
              </div>
            </template>
            <p v-else class="timeline-description">{{ item.content[currentLocale].description ?? item.content[currentLocale].sections?.[0]?.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiencesData } from '../../content/data/experiences'

const { locale } = useI18n()
const { experiences } = useExperiencesData()

const currentLocale = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
</script>

<style scoped src="./Experience.css"></style>
