<template>
  <div v-if="isOpen" class="modal" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">&times;</button>
      <div class="modal-header">
        <img :src="`/content/projects/${currentProject?.image}`" :alt="currentProject?.title" class="modal-image" />
      </div>
      <div class="modal-body">
        <h2>{{ currentProject?.title }}</h2>
        <p>{{ currentProject?.description }}</p>
        <div class="modal-tags">
          <h4>Technologies Used:</h4>
          <div class="technologies">
            <span v-for="tech in currentProject?.technologies" :key="tech" class="modal-tag">
              {{ tech }}
            </span>
          </div>
        </div>
        <div class="modal-actions">
          <a :href="currentProject?.link" class="cta-button">{{ $t('modal.visitProject') }}</a>
          <button class="modal-back-button btn-secondary" @click="closeModal">
            {{ $t('modal.backToPortfolio') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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

defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped src="../styles/components/ProjectModal.css"></style>
