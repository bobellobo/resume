<template>
  <main class="ensc-page">
    <div class="ensc-page-shell">
      <div class="ensc-topbar">
        <RouterLink class="ensc-back-link" :to="{ name: 'home' }">
          <Icon icon="lucide:arrow-left" aria-hidden="true" />
          <span class="sr-only">{{ $t('enscPage.backToHome') }}</span>
        </RouterLink>

        <div class="ensc-language-switcher" role="group" aria-label="Language switcher">
          <button
            type="button"
            :class="['language-pill', { active: currentLocale === 'en' }]"
            aria-label="Switch to English"
            :aria-pressed="currentLocale === 'en'"
            @click="switchLanguage('en')"
          >
            <Icon icon="flag:gb-4x3" aria-hidden="true" />
            <span class="sr-only">EN</span>
          </button>
          <button
            type="button"
            :class="['language-pill', { active: currentLocale === 'fr' }]"
            aria-label="Passer en français"
            :aria-pressed="currentLocale === 'fr'"
            @click="switchLanguage('fr')"
          >
            <Icon icon="flag:fr-4x3" aria-hidden="true" />
            <span class="sr-only">FR</span>
          </button>
        </div>
      </div>

      <article class="ensc-article">
        <header class="ensc-header">
          <p class="ensc-eyebrow">{{ content.eyebrow }}</p>
          <h1 class="ensc-title">{{ content.title }}</h1>
          <p class="ensc-intro">{{ content.description }}</p>

          <a
            class="ensc-website-link"
            :href="website"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="lucide:graduation-cap" aria-hidden="true" />
            <span>{{ $t('enscPage.visitWebsite') }}</span>
            <Icon icon="lucide:arrow-up-right" aria-hidden="true" />
          </a>
        </header>

        <section class="ensc-facts" aria-label="School facts">
          <div class="ensc-fact-row">
            <p class="fact-label">{{ $t('enscPage.locationTitle') }}</p>
            <p class="fact-value">{{ content.location }}</p>
          </div>

          <div class="ensc-fact-row">
            <p class="fact-label">{{ $t('enscPage.foundedTitle') }}</p>
            <p class="fact-value">{{ content.founded }}</p>
          </div>

          <div class="ensc-fact-row">
            <p class="fact-label">{{ $t('enscPage.programsTitle') }}</p>
            <div class="chip-list">
              <span v-for="program in content.programs" :key="program" class="tech-badge ensc-chip-program">
                {{ program }}
              </span>
            </div>
          </div>
        </section>

        <section class="ensc-copy">
          <p class="ensc-paragraph">{{ articleText }}</p>
        </section>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useEnscView } from './useEnscView'

const {
  currentLocale,
  content,
  website,
  articleText,
  switchLanguage
} = useEnscView()
</script>

<style scoped src="./EnscView.css"></style>
