import { ref, watch } from 'vue'

export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  shortDescription: string
}

export function useModalLogic() {
  const isOpen = ref(false)
  const currentProject = ref<Project | null>(null)

  const openModal = (project: Project) => {
    currentProject.value = project
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    isOpen.value = false
    currentProject.value = null
    document.body.style.overflow = 'auto'
  }

  // Listen for keyboard escape
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) {
      closeModal()
    }
  }

  watch(isOpen, (newVal) => {
    if (newVal) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  })

  return {
    isOpen,
    currentProject,
    openModal,
    closeModal
  }
}
