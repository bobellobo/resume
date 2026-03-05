<template>
  <section id="home" class="hero">
    <div class="hero-content">
      <div class="hero-main">
        <div class="hero-copy">
          <!-- <p class="hero-subtitle">{{ $t('hero.subtitle') }}</p> -->
          <i18n-t keypath="profile.description" tag="p" class="hero-about">
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
        </div>
        <img class="hero-photo" :src="heroPhoto" alt="Bibi photo" />
      </div>
      <button
        class="scroll-next-btn"
        type="button"
        aria-label="Scroll to next section"
        @click="scrollToNextSection"
      >
        <span class="scroll-next-icon" aria-hidden="true">↓</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import heroPhoto from '@content/projects/images/bibi.jpeg'

useI18n()

const scrollToNextSection = () => {
  const skillsSection = document.getElementById('skills')

  if (skillsSection) {
    skillsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const heroSection = document.getElementById('home')
  const nextSection = heroSection?.nextElementSibling as HTMLElement | null
  nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped src="./Hero.css"></style>
