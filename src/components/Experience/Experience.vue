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
            <h3 class="timeline-role">{{ item.content[currentLocale].role }}</h3>
            <p class="timeline-company">{{ item.content[currentLocale].company }}</p>
            <p v-if="item.content[currentLocale].location" class="timeline-location">{{ item.content[currentLocale].location }}</p>
            <p class="timeline-description">{{ item.content[currentLocale].description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExperiencesData } from './Experience'

const { locale } = useI18n()
const { experiences } = useExperiencesData()

const currentLocale = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
</script>

<style scoped src="./Experience.css"></style>
