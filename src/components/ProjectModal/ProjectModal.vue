<template>
  <div v-if="isOpen" class="modal" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">&times;</button>
      <div class="modal-header">
        <img :src="getProjectImageOrFallback(currentProject?.image ?? '', $t('projects.imageUnavailable'))" :alt="currentProject?.content[currentLocale].title" class="modal-image" />
      </div>
      <div class="modal-body">
        <h2>{{ currentProject?.content[currentLocale].title }}</h2>
        <p>{{ currentProject?.content[currentLocale].description }}</p>
        <div class="modal-tags">
          <h4>{{ $t('modal.technologiesUsed') }}</h4>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModalLogic } from './ProjectModal'
import { getProjectImageOrFallback } from '@/components/Projects/Projects'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value as 'en' | 'fr')

const { isOpen, currentProject, openModal, closeModal } = useModalLogic()

defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped src="./ProjectModal.css"></style>
