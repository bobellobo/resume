<template>
  <section id="home" class="hero">
    <div class="hero-content">
      <img class="hero-photo" :src="heroPhoto" alt="Bibi photo" />
      <p>{{ $t('hero.subtitle') }}</p>
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
  const aboutSection = document.getElementById('about')

  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  const heroSection = document.getElementById('home')
  const nextSection = heroSection?.nextElementSibling as HTMLElement | null
  nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped src="./Hero.css"></style>
