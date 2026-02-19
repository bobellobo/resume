import { ref, onMounted } from 'vue'

export interface ProjectContent {
  title: string
  description: string
  shortDescription: string
}

export interface Project {
  id: number
  content: {
    en: ProjectContent
    fr: ProjectContent
  }
  image: string
  technologies: string[]
  link: string
}

export function useProjectsData() {
  const projects = ref<Project[]>([])

  const loadProjects = async () => {
    try {
      const response = await fetch('content/projects/projects.json')
      if (!response.ok) {
        throw new Error('Failed to load projects')
      }
      projects.value = await response.json()
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  onMounted(() => {
    loadProjects()
  })

  return {
    projects
  }
}
