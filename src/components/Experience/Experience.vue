<template>
  <section id="experience" class="experience section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('experience.title') }}</h2>

      <div class="timeline" role="list">
        <article
          v-for="item in experienceItems"
          :key="item"
          class="timeline-item"
          role="listitem"
        >
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="timeline-card surface-card">
            <p class="timeline-period">{{ $t(`${item}.period`) }}</p>
            <h3 class="timeline-role">{{ $t(`${item}.role`) }}</h3>
            <p class="timeline-company">{{ $t(`${item}.company`) }}</p>
            <p class="timeline-description">{{ $t(`${item}.description`) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()

const experienceItems = [
  'experience.items.item1',
  'experience.items.item2',
  'experience.items.item3'
]
</script>

<style scoped src="./Experience.css"></style>
