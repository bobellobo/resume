<template>
  <div id="app">
    <div class="scroll-progress" aria-hidden="true"></div>
    <Header />
    <Hero />
    <Projects />
    <Experience />
    <Skills />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header/Header.vue'
import Hero from '../components/Hero/Hero.vue'
import Skills from '../components/Skills/Skills.vue'
import Experience from '../components/Experience/Experience.vue'
import Projects from '../components/Projects/Projects.vue'
import Footer from '../components/Footer/Footer.vue'
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
