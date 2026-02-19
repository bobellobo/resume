<template>
  <div id="app">
    <Header />
    <Hero />
    <About />
    <Projects @selectProject="handleSelectProject" />
    <Contact />
    <ProjectModal ref="projectModalRef" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import About from './components/About.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import ProjectModal from './components/ProjectModal.vue'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  shortDescription: string
}

const projectModalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

const handleSelectProject = (project: Project) => {
  projectModalRef.value?.openModal(project)
}
</script>

<style scoped>
#app {
  width: 100%;
}
</style>
