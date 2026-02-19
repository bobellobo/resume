<template>
  <section id="projects" class="projects section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('projects.title') }}</h2>
      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card surface-card hover-lift"
          @click="$emit('selectProject', project)"
        >
          <div class="card-image">
            <img :src="`/content/projects/${project.image}`" :alt="project.content[currentLocale].title" />
          </div>
          <div class="card-content">
            <h3>{{ project.content[currentLocale].title }}</h3>
            <p>{{ project.content[currentLocale].shortDescription }}</p>
            <div class="card-tags">
              <span v-for="tech in project.technologies" :key="tech" class="tag">
                {{ tech }}
              </span>
            </div>
            <a href="#" class="card-link" @click.prevent>
              {{ $t('projectCard.viewProject') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectsData, type Project } from './Projects'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value as 'en' | 'fr')

const { projects } = useProjectsData()

defineEmits<{
  selectProject: [project: Project]
}>()
</script>

<style scoped src="./Projects.css"></style>
