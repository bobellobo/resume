<template>
  <section id="skills" class="skills section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('profile.skillsTitle') }}</h2>

      <div class="skills-grid">
        <article v-for="category in skillCategories" :key="category.titleKey" class="skill-card surface-card">
          <h3 class="skill-heading">{{ $t(category.titleKey) }}</h3>
          <ul class="skill-list">
            <li v-for="itemKey in category.itemKeys" :key="itemKey" class="skill-item">
              {{ $t(itemKey) }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()

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
      'profile.skills.softSkills.item5',
      'profile.skills.softSkills.item6'
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
</script>

<style scoped src="./Skills.css"></style>
