import { ref, onMounted } from 'vue'

export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  shortDescription: string
}

export function useProjectsData() {
  const projects = ref<Project[]>([])

  const loadProjects = async () => {
    try {
      const response = await fetch('/content/projects.json')
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
