<template>
  <main class="project-page">
    <div class="project-page-shell">
      <div class="project-topbar">
        <RouterLink class="project-back-link" :to="{ name: 'home', hash: '#projects' }">
          {{ $t('projectPage.backToProjects') }}
        </RouterLink>

        <div class="project-language-switcher" role="group" aria-label="Language switcher">
          <button
            type="button"
            :class="['language-pill', { active: currentLocale === 'en' }]"
            aria-label="Switch to English"
            :aria-pressed="currentLocale === 'en'"
            @click="switchLanguage('en')"
          >
            EN
          </button>
          <button
            type="button"
            :class="['language-pill', { active: currentLocale === 'fr' }]"
            aria-label="Passer en français"
            :aria-pressed="currentLocale === 'fr'"
            @click="switchLanguage('fr')"
          >
            FR
          </button>
        </div>
      </div>

      <article v-if="project" class="project-article surface-card">
        <header class="project-header">
          <div class="project-hero-media">
            <img
              :src="getProjectImageOrFallback(project.image, $t('projects.imageUnavailable'))"
              :alt="project.content[currentLocale].title"
              class="project-hero-image"
            />
          </div>
          <div class="project-heading">
            <p class="project-eyebrow">{{ $t('projectPage.projectEyebrow') }}</p>
            <h2 class="project-title">{{ project.content[currentLocale].title }}</h2>
            <p class="project-intro">{{ project.content[currentLocale].description }}</p>
          </div>
        </header>

        <section v-if="showMeta" class="project-facts" aria-label="Project metadata">
          <div v-if="hasLocation" class="project-fact-row">
            <p class="fact-label">{{ $t('projectPage.locationTitle') }}</p>
            <p class="fact-value">{{ localizedLocation }}</p>
          </div>

          <div v-if="hasTechnologies" class="project-fact-row">
            <p class="fact-label">{{ $t('projectPage.technologiesTitle') }}</p>
            <div class="chip-list">
              <span v-for="technology in normalizedTechnologies" :key="technology" class="meta-chip">
                {{ technology }}
              </span>
            </div>
          </div>

          <div v-if="hasKeywords" class="project-fact-row">
            <p class="fact-label">{{ $t('projectPage.keywordsTitle') }}</p>
            <div class="chip-list">
              <span v-for="keyword in normalizedKeywords" :key="keyword" class="meta-chip meta-chip-subtle">
                {{ keyword }}
              </span>
            </div>
          </div>

          <div v-if="hasLinks" class="project-fact-row">
            <p class="fact-label">{{ $t('projectPage.linksTitle') }}</p>
            <div class="project-links">
              <a
                v-for="link in validLinks"
                :key="link.url"
                :href="link.url"
                class="meta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.label[currentLocale] }}
              </a>
            </div>
          </div>
        </section>

        <section class="project-copy">
          <p class="project-paragraph">{{ articleText }}</p>
        </section>

        <section v-if="hasGallery" class="project-gallery">
          <div class="gallery-carousel">
            <button
              v-if="showGalleryControls"
              class="gallery-control gallery-control-prev"
              type="button"
              :aria-label="$t('misc.previous')"
              @click="goToPreviousImage"
            >
              ‹
            </button>

            <div
              class="gallery-viewport"
              aria-live="polite"
              @touchstart="handleGalleryTouchStart"
              @touchmove="handleGalleryTouchMove"
              @touchend="handleGalleryTouchEnd"
              @touchcancel="handleGalleryTouchCancel"
              @mousedown="handleGalleryMouseDown"
              @mousemove="handleGalleryMouseMove"
              @mouseup="handleGalleryMouseUp"
              @mouseleave="handleGalleryMouseLeave"
            >
              <div :class="['gallery-track', { 'is-dragging': isMouseDown }]" :style="galleryTrackStyle">
                <figure
                  v-for="(image, index) in galleryImages"
                  :key="`${project.slug}-${index}`"
                  class="gallery-slide"
                >
                  <img
                    :src="getProjectImageOrFallback(image, $t('projects.imageUnavailable'))"
                    :alt="project.content[currentLocale].title"
                  />
                </figure>
              </div>
            </div>

            <button
              v-if="showGalleryControls"
              class="gallery-control gallery-control-next"
              type="button"
              :aria-label="$t('misc.next')"
              @click="goToNextImage"
            >
              ›
            </button>

            <div v-if="showGalleryControls" class="gallery-dots" aria-hidden="true">
              <button
                v-for="(_, index) in galleryImages"
                :key="`dot-${index}`"
                type="button"
                :class="['gallery-dot', { 'is-active': galleryIndex === index }]"
                @click="setGalleryIndex(index)"
              ></button>
            </div>
          </div>
        </section>
      </article>

      <section v-else class="project-not-found surface-card">
        <h1>{{ $t('projectPage.notFoundTitle') }}</h1>
        <p>{{ $t('projectPage.notFoundDescription') }}</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getProjectImageOrFallback } from '../../content/data/projects'
import { useProjectView } from './useProjectView'

const {
  currentLocale,
  project,
  validLinks,
  normalizedTechnologies,
  normalizedKeywords,
  localizedLocation,
  hasLocation,
  hasTechnologies,
  hasKeywords,
  hasLinks,
  showMeta,
  articleText,
  galleryImages,
  hasGallery,
  showGalleryControls,
  galleryTrackStyle,
  galleryIndex,
  isMouseDown,
  switchLanguage,
  setGalleryIndex,
  goToPreviousImage,
  goToNextImage,
  handleGalleryTouchStart,
  handleGalleryTouchMove,
  handleGalleryTouchEnd,
  handleGalleryTouchCancel,
  handleGalleryMouseDown,
  handleGalleryMouseMove,
  handleGalleryMouseUp,
  handleGalleryMouseLeave
} = useProjectView()
</script>

<style scoped src="./ProjectView.css"></style>
