<template>
  <section id="skills" class="skills section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('profile.skillsTitle') }}</h2>

      <div class="skills-grid">
        <article v-for="category in skills" :key="category.id" class="skill-card surface-card">
          <h3 class="skill-heading">{{ category.content[currentLocale].title }}</h3>
          <ul class="skill-list">
            <li
              v-for="item in category.content[currentLocale].items"
              :key="item.text"
              class="skill-item"
            >
              <span :class="['skill-item-label', { 'skill-item-label-joke': item.isJoke }]">
                {{ item.text }}
              </span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSkillsData } from '../../content/data/skills'

const { locale } = useI18n()
const { skills } = useSkillsData()

const currentLocale = computed<'en' | 'fr'>(() => (locale.value === 'fr' ? 'fr' : 'en'))
</script>

<style scoped src="./Skills.css"></style>
