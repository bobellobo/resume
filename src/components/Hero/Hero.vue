<template>
  <section id="home" class="hero">
    <div class="hero-content">
      <div class="hero-main">
        <div class="hero-copy">
          <!-- <p class="hero-subtitle">{{ $t('hero.subtitle') }}</p> -->
          <p class="hero-about">
            {{ profileDescriptionParts.before }}
            <a
              class="inline-link"
              href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ profileContent.universityLabel }}
            </a>
            {{ profileDescriptionParts.after }}
          </p>
        </div>
        <div class="hero-side">
          <img class="hero-photo" :src="heroPhoto" alt="Bibi photo" />
          <ul class="hero-contact-links" aria-label="Contact links">
            <li>
              <a class="hero-contact-link hero-contact-link-social" :href="contact.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M16.5 8.5a3.5 3.5 0 0 1 3.5 3.5V19h-4v-6.2a1.8 1.8 0 0 0-3.6 0V19h-4V9h4v1.2A4 4 0 0 1 16.5 8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4 9h4v10H4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a class="hero-contact-link hero-contact-link-social" :href="contact.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 19c-4 1.2-4-2-6-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 22v-3.1a3.2 3.2 0 0 0-.9-2.5c3.2-.4 6.6-1.6 6.6-7.1A5.6 5.6 0 0 0 19 5.4 5.2 5.2 0 0 0 18.9 2S17.7 1.6 15 3.4a10.6 10.6 0 0 0-6 0C6.3 1.6 5.1 2 5.1 2A5.2 5.2 0 0 0 5 5.4a5.6 5.6 0 0 0-1.7 3.9c0 5.5 3.4 6.7 6.6 7.1a3.2 3.2 0 0 0-.9 2.5V22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a class="hero-contact-link" :href="`tel:${contact.phone}`" :aria-label="contact.phone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5A14 14 0 0 0 13.5 15L15 12.5l5 2v4a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 6.2 2 2 0 0 1 5 4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ contact.phone }}</span>
              </a>
            </li>
            <li>
              <a class="hero-contact-link" :href="`mailto:${contact.email}`" :aria-label="contact.email">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ contact.email }}</span>
              </a>
            </li>
          </ul>
        </div>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import heroPhoto from '@content/images/bibi.jpeg'
import { getProfileContent, getContactInfo, splitUniversityPlaceholder } from '../../content/data/profile'
import { getSupportedLocale } from '../../content/locale'

const { locale } = useI18n()
const contact = getContactInfo()

const currentLocale = computed(() => getSupportedLocale(locale.value))
const profileContent = computed(() => getProfileContent(currentLocale.value))
const profileDescription = computed(() => profileContent.value.description)
const profileDescriptionParts = computed(() => splitUniversityPlaceholder(profileDescription.value))

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
