import { ref } from 'vue'
import rawProjects from '@content/json/projects.json'
import { makeImageMap, createFallbackProjectImage } from '../../components/Projects/utils/loadImages'
import { resolveProjectImage } from '../../components/Projects/utils/utils'

export interface ProjectContent {
  title: string
  description: string
  shortDescription: string
  article: string
}

export interface LocalizedText {
  en: string
  fr: string
}

export interface ProjectExternalLink {
  label: LocalizedText
  url: string
}

export interface Project {
  id: number
  slug: string
  content: {
    en: ProjectContent
    fr: ProjectContent
  }
  location: LocalizedText
  icon: string
  thumbnail: string
  gallery: string[]
  technologies: string[]
  keywords: string[]
  links: ProjectExternalLink[]
}

export const getProjectImageOrFallback = (image: string, fallbackLabel: string): string => (
  image ? image : createFallbackProjectImage(fallbackLabel)
)

export function useProjectsData() {
  const imagesMap = makeImageMap()
  const resolveImage = resolveProjectImage(imagesMap)

  const projectsData: Project[] = (rawProjects as Project[])
    .map((project) => ({
      ...project,
      thumbnail: resolveImage(project.thumbnail || (project as Project & { image?: string }).image || ''),
      gallery: project.gallery.map((galleryImage) => resolveImage(galleryImage))
    }))

  return { projects: ref<Project[]>(projectsData) }
}