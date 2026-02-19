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
          <button class="modal-back-button" @click="closeModal">
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

<style scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background-color: var(--bg-white);
  border-radius: 1rem;
  max-width: 600px;
  max-height: 90vh;
  margin: auto;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-dark);
  z-index: 10;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: var(--primary-color);
}

.modal-header {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 2rem;
}

.modal-body h2 {
  margin-bottom: 1rem;
  text-align: left;
  font-size: 1.75rem;
  color: var(--text-dark);
}

.modal-body p {
  text-align: left;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-light);
}

.modal-tags {
  margin: 2rem 0;
}

.modal-tags h4 {
  font-size: 1rem;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.modal-tag {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--bg-white);
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  flex: 1;
  background-color: var(--primary-color);
  color: var(--bg-white);
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.cta-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.modal-back-button {
  flex: 1;
  background-color: var(--bg-light);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-back-button:hover {
  background-color: var(--border-color);
  transform: translateY(-2px);
}
</style>
