<template>
  <main :class="['resume-page', { 'print-preview': isPrintPreview }]">
    <div class="resume-toolbar" role="toolbar" :aria-label="$t('exportView.actionsLabel')">
      <a class="toolbar-link" href="/resume/">{{ $t('exportView.backToPortfolio') }}</a>
      <button
        type="button"
        class="toolbar-button"
        :title="languageSwitchTitle"
        :aria-label="languageSwitchTitle"
        @click="toggleLanguage"
      >
        {{ languageSwitchLabel }}
      </button>
      <button
        type="button"
        :class="['toolbar-button', { 'toolbar-button-active': isPrintPreview }]"
        :title="printPreviewTitle"
        :aria-label="printPreviewTitle"
        @click="togglePrintPreview"
      >
        {{ printPreviewLabel }}
      </button>
      <button type="button" class="toolbar-button" @click="printExport">{{ $t('exportView.exportPdfJpeg') }}</button>
    </div>

    <article class="resume-sheet" :aria-label="$t('exportView.documentLabel')">
      <header class="resume-header">
        <div class="resume-identity">
          <img
            class="resume-photo"
            :src="profilePhoto"
            :alt="$t('exportView.photoAlt')"
            loading="eager"
            decoding="async"
          >
          <div>
            <h1 class="resume-name">Titouan Guedon</h1>
            <p class="resume-role">{{ $t('exportView.role') }}</p>
          </div>
        </div>
        <ul class="resume-links" :aria-label="$t('exportView.contactLinks')">
          <li><a href="mailto:titouanguedon@proton.me">titouanguedon@proton.me</a></li>
          <li>
            <a href="https://www.linkedin.com/in/titouan-guedon-150438198/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li><a href="https://github.com/bobellobo" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </header>

      <section class="resume-section">
        <h2>{{ $t('exportView.profile') }}</h2>
        <p class="resume-text">
          {{ exportProfileDescriptionParts.before }}
          <a
            class="inline-link"
            href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('profile.universityLabel') }}
          </a>
          {{ exportProfileDescriptionParts.after }}
        </p>
      </section>

      <section class="resume-section">
        <h2>{{ $t('experience.title') }}</h2>
        <article v-for="item in experiences" :key="item.id" class="experience-item">
          <div class="experience-heading">
            <h3>{{ item.content[currentLocale].role }}</h3>
            <p class="experience-period">{{ item.content[currentLocale].period }}</p>
          </div>
          <p class="experience-company">{{ item.content[currentLocale].company }}</p>
          <p v-if="item.content[currentLocale].location" class="experience-location">{{ item.content[currentLocale].location }}</p>
          <p class="resume-text">{{ item.content[currentLocale].description }}</p>
        </article>
      </section>

      <section class="resume-section">
        <h2>{{ $t('profile.skillsTitle') }}</h2>
        <div class="skills-grid">
          <article v-for="category in skills" :key="category.id" class="skill-category">
            <h3>{{ category.content[currentLocale].title }}</h3>
            <ul>
              <li v-for="item in category.content[currentLocale].items" :key="item.text">{{ item.text }}</li>
            </ul>
          </article>
        </div>
      </section>

      <p class="export-attribution">
        <i18n-t keypath="exportView.attribution" tag="span">
          <template #link>
            <a
              href="https://bobellobo.github.io/resume/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://bobellobo.github.io/resume/
            </a>
          </template>
        </i18n-t>
      </p>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiencesData } from '../../content/data/experiences'
import { useSkillsData } from '../../content/data/skills'
import { getProfileContent, splitUniversityPlaceholder } from '../../content/data/profile'
import { getSupportedLocale } from '../../content/locale'
import profilePhoto from '../../../content/projects/images/bibi.jpeg'

const LANGUAGE_STORAGE_KEY = 'language'

const { locale, t } = useI18n()
const isPrintPreview = ref(false)
const { experiences } = useExperiencesData()
const { skills } = useSkillsData()

const currentLocale = computed(() => getSupportedLocale(locale.value))
const exportProfileDescription = computed(() => getProfileContent(currentLocale.value).exportDescription)
const exportProfileDescriptionParts = computed(() => splitUniversityPlaceholder(exportProfileDescription.value))

const languageSwitchLabel = computed(() => (locale.value === 'fr' ? 'EN' : 'FR'))
const languageSwitchTitle = computed(() => (
  locale.value === 'fr' ? t('exportView.switchToEnglish') : t('exportView.switchToFrench')
))
const printPreviewLabel = computed(() => (
  isPrintPreview.value ? t('exportView.previewOff') : t('exportView.previewOn')
))
const printPreviewTitle = computed(() => (
  isPrintPreview.value ? t('exportView.previewOffHint') : t('exportView.previewOnHint')
))

const toggleLanguage = () => {
  const nextLanguage = locale.value === 'fr' ? 'en' : 'fr'
  locale.value = nextLanguage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
}

const togglePrintPreview = () => {
  isPrintPreview.value = !isPrintPreview.value
}

const printExport = () => {
  window.print()
}
</script>

<style scoped src="./Export.css"></style>
