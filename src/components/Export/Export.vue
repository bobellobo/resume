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
        <div>
          <h1 class="resume-name">Titouan Guedon</h1>
          <p class="resume-role">{{ $t('exportView.role') }}</p>
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
        <i18n-t keypath="exportView.profileDescription" tag="p" class="resume-text">
          <template #university>
            <a
              class="inline-link"
              href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('profile.universityLabel') }}
            </a>
          </template>
        </i18n-t>
      </section>

      <section class="resume-section">
        <h2>{{ $t('experience.title') }}</h2>
        <article v-for="item in experienceItems" :key="item" class="experience-item">
          <div class="experience-heading">
            <h3>{{ $t(`${item}.role`) }}</h3>
            <p class="experience-period">{{ $t(`${item}.period`) }}</p>
          </div>
          <p class="experience-company">{{ $t(`${item}.company`) }}</p>
          <p class="resume-text">{{ $t(`${item}.description`) }}</p>
        </article>
      </section>

      <section class="resume-section">
        <h2>{{ $t('profile.skillsTitle') }}</h2>
        <div class="skills-grid">
          <article v-for="category in skillCategories" :key="category.titleKey" class="skill-category">
            <h3>{{ $t(category.titleKey) }}</h3>
            <ul>
              <li v-for="itemKey in category.itemKeys" :key="itemKey">{{ $t(itemKey) }}</li>
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

const LANGUAGE_STORAGE_KEY = 'language'

const { locale, t } = useI18n()
const isPrintPreview = ref(false)

const experienceItems = [
  'experience.items.item1',
  'experience.items.item2',
  'experience.items.item3'
]

const skillCategories = [
  {
    titleKey: 'profile.skills.development.title',
    itemKeys: [
      'profile.skills.development.item1',
      'profile.skills.development.item2',
      'profile.skills.development.item3',
      'profile.skills.development.item4',
      'profile.skills.development.item5'
    ]
  },
  {
    titleKey: 'profile.skills.softSkills.title',
    itemKeys: [
      'profile.skills.softSkills.item1',
      'profile.skills.softSkills.item2',
      'profile.skills.softSkills.item3',
      'profile.skills.softSkills.item4',
      'profile.skills.softSkills.item5'
    ]
  },
  {
    titleKey: 'profile.skills.cognitiveScience.title',
    itemKeys: [
      'profile.skills.cognitiveScience.item1',
      'profile.skills.cognitiveScience.item2',
      'profile.skills.cognitiveScience.item3',
      'profile.skills.cognitiveScience.item4',
      'profile.skills.cognitiveScience.item5'
    ]
  },
  {
    titleKey: 'profile.skills.languages.title',
    itemKeys: [
      'profile.skills.languages.item1',
      'profile.skills.languages.item2',
      'profile.skills.languages.item3',
      'profile.skills.languages.item4'
    ]
  }
]

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
