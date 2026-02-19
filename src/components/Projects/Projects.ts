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

const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch('content/projects/projects.json')
    if (!response.ok) {
      throw new Error('Failed to load projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}



export function useProjectsData() {
  const projects = ref<Project[]>([])


  onMounted( async () => {
    projects.value = await getProjects()
  });

  return { projects }
}
