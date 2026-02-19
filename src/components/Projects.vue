<template>
  <section id="projects" class="projects">
    <div class="container">
      <h2>{{ $t('projects.title') }}</h2>
      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
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

<style scoped>
.projects {
  padding: 6rem 20px;
  background-color: var(--bg-white);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  color: var(--text-dark);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: var(--bg-white);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.card-content p {
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  display: inline-block;
  background-color: var(--bg-light);
  color: var(--primary-color);
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.card-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.card-link:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .projects {
    padding: 4rem 20px;
  }
}
</style>
