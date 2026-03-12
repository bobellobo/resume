import { ref } from 'vue'
import rawProjects from '@content/projects/projects.json'
import { makeImageMap, createFallbackProjectImage } from '../../components/Projects/utils/loadImages'
import { resolveProjectImage } from '../../components/Projects/utils/utils'

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

export const getProjectImageOrFallback = (image: string, fallbackLabel: string): string => (
  image ? image : createFallbackProjectImage(fallbackLabel)
)

export function useProjectsData() {
  const imagesMap = makeImageMap()
  const projectsData: Project[] = (rawProjects as Project[])
    .map((project) => ({
      ...project,
      image: resolveProjectImage(imagesMap)(project.image)
    }))

  return { projects: ref<Project[]>(projectsData) }
}