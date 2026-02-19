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
            <img :src="`/content/projects/${project.image}`" :alt="project.title" />
          </div>
          <div class="card-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.shortDescription }}</p>
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  shortDescription: string
}

const { t: $t } = useI18n()
const projects = ref<Project[]>([])

defineEmits<{
  selectProject: [project: Project]
}>()

onMounted(async () => {
  try {
    const response = await fetch('/content/projects/projects.json')
    if (!response.ok) {
      throw new Error('Failed to load projects')
    }
    projects.value = await response.json()
  } catch (error) {
    console.error('Error loading projects:', error)
  }
})
</script>

<style scoped src="../styles/components/Projects.css"></style>
