<template>
  <main class="resume-page print-preview">
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
      <div class="toolbar-scale-shell">
      <div class="toolbar-scale" role="group" aria-label="Scale controls">
        <button
          type="button"
          class="toolbar-button toolbar-button-compact"
          title="Decrease scale"
          aria-label="Decrease scale"
          @click="decreaseScale"
        >
          -
        </button>
        <span class="toolbar-scale-value" aria-live="polite">{{ scalePercent }}%</span>
        <button
          type="button"
          class="toolbar-button toolbar-button-compact"
          title="Increase scale"
          aria-label="Increase scale"
          @click="increaseScale"
        >
          +
        </button>
        <button
          type="button"
          class="toolbar-button"
          title="Reset scale"
          aria-label="Reset scale"
          @click="resetScale"
        >
          Reset
        </button>
        <span
          :class="['toolbar-scale-indicator', { 'is-overflowing': isOverflowing }]"
          role="img"
          :aria-label="isOverflowing ? 'Content exceeds one page' : 'Content fits one page'"
          :title="isOverflowing ? 'Content exceeds one page' : 'Content fits one page'"
        ></span>
        <button
          type="button"
          :class="[
            'toolbar-button',
            'toolbar-button-fit',
            {
              'toolbar-button-fit-pulse': isFitFeedbackActive,
              'toolbar-button-fit-pulse-success': isFitFeedbackActive && !isOverflowing,
              'toolbar-button-fit-pulse-overflow': isFitFeedbackActive && isOverflowing,
            },
          ]"
          title="Fit to one page"
          aria-label="Fit to one page"
          @click="fitToSinglePage"
        >
          <span>Fit page</span>
          <span
            :class="['toolbar-fit-indicator', { 'is-overflowing': isOverflowing }]"
            role="img"
            :aria-label="isOverflowing ? 'Content exceeds one page' : 'Content fits one page'"
            :title="isOverflowing ? 'Content exceeds one page' : 'Content fits one page'"
          ></span>
        </button>
      </div>
      </div>
      <button type="button" class="toolbar-button" @click="printExport">{{ $t('exportView.exportPdfJpeg') }}</button>
    </div>

    <article ref="resumeSheetRef" class="resume-sheet" :aria-label="profileContent.exportDocumentLabel">
      <div ref="resumeSheetContentRef" class="resume-sheet-content" :style="resumeSheetStyle">
      <header class="resume-header">
        <div class="resume-identity">
          <img
            class="resume-photo"
            :src="profilePhoto"
            :alt="profileContent.photoAlt"
            loading="eager"
            decoding="async"
          >
          <div>
            <h1 class="resume-name">{{ profileContent.fullName }}</h1>
            <p class="resume-role">{{ profileContent.exportRole }}</p>
          </div>
        </div>
        <ul class="resume-links" :aria-label="$t('exportView.contactLinks')">
          <li><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
          <li><a :href="`tel:${contact.phone}`">{{ contact.phone }}</a></li>
          <li>
            <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li><a :href="contact.github" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </header>

      <section class="resume-section resume-profile">
        <p class="resume-text">
          {{ exportProfileDescriptionParts.before }}
          <a
            class="inline-link"
            href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ profileContent.universityLabel }}
          </a>
          {{ exportProfileDescriptionParts.after }}
        </p>
      </section>

      <section class="resume-section">
        <h2>{{ $t('experience.title') }}</h2>
        <article v-for="item in experiences" :key="item.id" class="experience-item">
          <div class="experience-heading">
            <div class="experience-role-group">
              <h3>{{ item.content[currentLocale].role }}</h3>
              <ul
                v-if="item.content[currentLocale].languages?.length"
                class="experience-languages"
                :aria-label="$t('experience.languagesLabel')"
              >
                <li
                  v-for="(languageFlag, index) in getLanguageFlags(item.content[currentLocale].languages)"
                  :key="`${item.id}-export-language-${index}`"
                  class="experience-language"
                  :aria-label="languageFlag.code.toUpperCase()"
                >
                  <img class="flag-icon" :src="languageFlag.src" alt="" aria-hidden="true">
                </li>
              </ul>
            </div>
            <p class="experience-period">{{ item.content[currentLocale].period }}</p>
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
          <p class="experience-company">{{ item.content[currentLocale].company }}<span v-if="item.content[currentLocale].location" class="experience-location"> · {{ item.content[currentLocale].location }}</span></p>

          <template v-if="item.content[currentLocale].sections && item.content[currentLocale].sections!.length > 1">
            <p v-if="item.content[currentLocale].description" class="resume-text">{{ item.content[currentLocale].description }}</p>
            <div class="experience-sections">
              <div
                v-for="(section, index) in item.content[currentLocale].sections"
                :key="index"
                class="experience-section"
              >
                <div class="experience-section-head">
                  <h4 class="experience-section-title">{{ section.title }}</h4>
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
                <p class="resume-text">{{ section.description }}</p>
              </div>
            </div>
          </template>
          <p v-else class="resume-text">{{ item.content[currentLocale].description ?? item.content[currentLocale].sections?.[0]?.description }}</p>
        </article>
      </section>

      <section class="resume-section">
        <h2>{{ profileContent.skillsTitle }}</h2>
        <div class="skills-grid">
          <article v-for="category in exportSkills" :key="category.id" class="skill-category">
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
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiencesData, toFlagCode, getFlagSvgByCode } from '../../content/data/experiences'
import { useSkillsData } from '../../content/data/skills'
import { getProfileContent, getContactInfo, splitUniversityPlaceholder } from '../../content/data/profile'
import { getSupportedLocale } from '../../content/locale'
import profilePhoto from '@content/images/bibi.jpeg'

const LANGUAGE_STORAGE_KEY = 'language'
const SCALE_STEP = 2
const MIN_SCALE_PERCENT = 60
const MAX_SCALE_PERCENT = 125

const { locale, t } = useI18n()
const { experiences } = useExperiencesData()
const { skills } = useSkillsData()
const contact = getContactInfo()
const scalePercent = ref(100)
const isOverflowing = ref(false)
const isFitFeedbackActive = ref(false)
const resumeSheetRef = ref<HTMLElement | null>(null)
const resumeSheetContentRef = ref<HTMLElement | null>(null)
let fitFeedbackTimer: number | null = null

const currentLocale = computed(() => getSupportedLocale(locale.value))
const exportSkills = computed(() => (
  skills.value
    .map((category) => ({
      ...category,
      content: {
        en: {
          ...category.content.en,
          items: category.content.en.items.filter((item) => !item.isJoke),
        },
        fr: {
          ...category.content.fr,
          items: category.content.fr.items.filter((item) => !item.isJoke),
        },
      },
    }))
    .filter((category) => (
      category.content.en.items.length > 0 || category.content.fr.items.length > 0
    ))
))
const exportProfileDescription = computed(() => getProfileContent(currentLocale.value).exportDescription)
const profileContent = computed(() => getProfileContent(currentLocale.value))
const exportProfileDescriptionParts = computed(() => splitUniversityPlaceholder(exportProfileDescription.value))

const languageSwitchLabel = computed(() => (locale.value === 'fr' ? 'EN' : 'FR'))
const languageSwitchTitle = computed(() => (
  locale.value === 'fr' ? t('exportView.switchToEnglish') : t('exportView.switchToFrench')
))
const resumeSheetStyle = computed(() => ({
  '--export-scale': String(scalePercent.value / 100),
}))

const getLanguageFlags = (languages?: string[]) => (
  (languages ?? [])
    .map(toFlagCode)
    .filter((code): code is string => Boolean(code))
    .map((code) => ({ code, src: getFlagSvgByCode(code) }))
    .filter((flag): flag is { code: string; src: string } => Boolean(flag.src))
)

const toggleLanguage = () => {
  const nextLanguage = locale.value === 'fr' ? 'en' : 'fr'
  locale.value = nextLanguage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
}

const clampScale = (value: number) => Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, value))

const setScale = (value: number) => {
  scalePercent.value = clampScale(value)
}

const isContentOverflowing = () => {
  const sheet = resumeSheetRef.value
  const content = resumeSheetContentRef.value

  if (!sheet || !content) {
    return false
  }

  const sheetStyles = window.getComputedStyle(sheet)
  const paddingTop = Number.parseFloat(sheetStyles.paddingTop) || 0
  const paddingBottom = Number.parseFloat(sheetStyles.paddingBottom) || 0
  const availableHeight = sheet.clientHeight - paddingTop - paddingBottom
  const currentScale = scalePercent.value / 100
  const renderedHeight = content.scrollHeight * currentScale

  return renderedHeight > availableHeight + 0.5
}

const updateOverflowState = async () => {
  await nextTick()
  isOverflowing.value = isContentOverflowing()
}

const increaseScale = () => {
  setScale(scalePercent.value + SCALE_STEP)
}

const decreaseScale = () => {
  setScale(scalePercent.value - SCALE_STEP)
}

const resetScale = () => {
  setScale(100)
}

const triggerFitFeedback = () => {
  isFitFeedbackActive.value = false

  requestAnimationFrame(() => {
    isFitFeedbackActive.value = true
  })

  if (fitFeedbackTimer !== null) {
    window.clearTimeout(fitFeedbackTimer)
  }

  fitFeedbackTimer = window.setTimeout(() => {
    isFitFeedbackActive.value = false
    fitFeedbackTimer = null
  }, 520)
}

const fitToSinglePage = async () => {
  // Find the largest scale that still fits the A4 frame.
  const initialScale = scalePercent.value
  let candidate = MAX_SCALE_PERCENT
  let guard = 0

  setScale(candidate)

  while (guard < 120) {
    await nextTick()

    if (!isContentOverflowing()) {
      break
    }

    if (candidate <= MIN_SCALE_PERCENT) {
      setScale(MIN_SCALE_PERCENT)
      break
    }

    candidate -= 1
    setScale(candidate)
    guard += 1
  }

  await updateOverflowState()

  if (scalePercent.value !== initialScale) {
    triggerFitFeedback()
  }
}

const printExport = () => {
  window.print()
}

const handleWindowResize = () => {
  void fitToSinglePage()
}

watch(currentLocale, async () => {
  await fitToSinglePage()
})

watch(scalePercent, () => {
  void updateOverflowState()
})

onMounted(async () => {
  window.addEventListener('resize', handleWindowResize)
  await fitToSinglePage()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize)

  if (fitFeedbackTimer !== null) {
    window.clearTimeout(fitFeedbackTimer)
  }
})
</script>

<style scoped src="./Export.css"></style>
