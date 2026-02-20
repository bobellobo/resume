<template>
  <section id="about" class="about section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('about.title') }}</h2>
      <i18n-t keypath="about.description" tag="p" class="about-description">
        <template #university>
          <a
            class="inline-link"
            href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('about.universityLabel') }}
          </a>
        </template>
      </i18n-t>

      <div class="skills-block">
        <h3 class="skills-title">{{ $t('about.skillsTitle') }}</h3>

        <div class="skills-grid">
          <article v-for="category in skillCategories" :key="category.titleKey" class="skill-card surface-card">
            <h4 class="skill-heading">{{ $t(category.titleKey) }}</h4>
            <ul class="skill-list">
              <li v-for="itemKey in category.itemKeys" :key="itemKey" class="skill-item">
                {{ $t(itemKey) }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()

const skillCategories = [
  {
    titleKey: 'about.skills.development.title',
    itemKeys: [
      'about.skills.development.item1',
      'about.skills.development.item2',
      'about.skills.development.item3',
      'about.skills.development.item4',
      'about.skills.development.item5'
    ]
  },
  {
    titleKey: 'about.skills.cognitiveScience.title',
    itemKeys: [
      'about.skills.cognitiveScience.item1',
      'about.skills.cognitiveScience.item2',
      'about.skills.cognitiveScience.item3',
      'about.skills.cognitiveScience.item4'
    ]
  },
  {
    titleKey: 'about.skills.languages.title',
    itemKeys: [
      'about.skills.languages.item1',
      'about.skills.languages.item2',
      'about.skills.languages.item3',
      'about.skills.languages.item4'
    ]
  },
  {
    titleKey: 'about.skills.softSkills.title',
    itemKeys: [
      'about.skills.softSkills.item1',
      'about.skills.softSkills.item2',
      'about.skills.softSkills.item3',
      'about.skills.softSkills.item4'
    ]
  }
]
</script>

<style scoped src="./About.css"></style>
