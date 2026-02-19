import { ref } from 'vue';
import rawProjects from '@content/projects/projects.json';
import { makeImageMap, createFallbackProjectImage } from './utils/loadImages';
import { resolveProjectImage } from './utils/utils';


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

export const getProjectImageOrFallback = (image: string, fallbackLabel: string): string => 
  image ? image : createFallbackProjectImage(fallbackLabel);


export function useProjectsData() {

  const imagesMap = makeImageMap();
  const projectsData: Project[] = (rawProjects as Project[])
      .map(prj => ({
          ...prj,
          image: resolveProjectImage(imagesMap)(prj.image)
          })
  );

  return { projects:  ref<Project[]>(projectsData) }
}
