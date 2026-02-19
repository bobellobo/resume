import { ref } from 'vue'
import rawProjects from '@content/projects/projects.json'

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

const projectImages = import.meta.glob('@content/projects/images/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const fallbackImageCache = new Map<string, string>()

const createFallbackProjectImage = (label: string): string => {
  const cachedImage = fallbackImageCache.get(label)
  if (cachedImage) {
    return cachedImage
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#1f2937"/>
    <rect x="40" y="40" width="1120" height="550" rx="20" fill="#374151"/>
    <circle cx="480" cy="280" r="70" fill="#6b7280"/>
    <path d="M340 460 L500 320 L620 430 L720 350 L860 460 Z" fill="#9ca3af"/>
    <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#e5e7eb">${label}</text>
  </svg>`

  const fallbackImage = `data:image/svg+xml,${encodeURIComponent(svg)}`
  fallbackImageCache.set(label, fallbackImage)
  return fallbackImage
}

export const getProjectImageOrFallback = (image: string, fallbackLabel: string): string => 
  image ? image : createFallbackProjectImage(fallbackLabel);

const resolveProjectImage = (imagePath: string): string => {
  const normalizedImagePath = imagePath.replace(/^\/+/, '')
  const fileName = normalizedImagePath.replace(/^images\//, '')
  const imageKey = `@content/projects/images/${fileName}`
  return projectImages[imageKey] ?? ''
}

const projectsData: Project[] = (rawProjects as Project[])
  .map(prj => ({
      ...prj,
      image: resolveProjectImage(prj.image)
    })
  );

export function useProjectsData() {
  return { projects:  ref<Project[]>(projectsData) }
}
