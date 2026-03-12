<template>
  <ExportView v-if="isExportPage" />
  <div v-else id="app">
    <div class="scroll-progress" aria-hidden="true"></div>
    <Header />
    <Hero />
    <Skills />
    <Experience />
    <Projects @selectProject="handleSelectProject" />
    <Contact />
    <ProjectModal ref="projectModalRef" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from './content/data/projects'
import ExportView from './components/Export/Export.vue'
import Header from './components/Header/Header.vue'
import Hero from './components/Hero/Hero.vue'
import Skills from './components/Skills/Skills.vue'
import Experience from './components/Experience/Experience.vue'
import Projects from './components/Projects/Projects.vue'
import Contact from './components/Contact/Contact.vue'
import Footer from './components/Footer/Footer.vue'
import ProjectModal from './components/ProjectModal/ProjectModal.vue'

const urlParams = new URLSearchParams(window.location.search)
const isExportPage = [window.location.pathname, window.location.hash].includes('/export')
  || window.location.hash === '#/export'
  || urlParams.get('view') === 'export'

const projectModalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

const handleSelectProject = (project: Project) => {
  projectModalRef.value?.openModal(project)
}
</script>

<style scoped>
#app {
  width: 100%;
  background-color: var(--surface-section);
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 2000;
  pointer-events: none;
  background: color-mix(in srgb, var(--primary-color) 65%, transparent);
  transform: scaleX(0);
  transform-origin: 0 50%;
  animation: scroll-progress linear both;
  animation-timeline: scroll(root block);
}

@keyframes scroll-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
