<template>
  <div id="app">
    <div class="scroll-progress" aria-hidden="true"></div>
    <Header />
    <main id="home" class="home-compact-stack" aria-label="Main content">
      <Hero />
      <Projects />
      <Experience />
      <Skills />
    </main>
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
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--primary-color) 10%, transparent), transparent 45%),
    linear-gradient(180deg, color-mix(in srgb, var(--surface-page) 84%, transparent), color-mix(in srgb, var(--bg-light) 76%, transparent));
}

.home-compact-stack {
  width: min(100%, var(--content-width-compact));
  margin: 0 auto;
  padding: 1.35rem var(--layout-padding-x-desktop) 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.home-compact-stack :deep(.home-stack-section) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

.home-compact-stack :deep(.section-title) {
  text-align: left;
  margin-bottom: 0.9rem;
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

@media (max-width: 768px) {
  .home-compact-stack {
    padding: 1.1rem var(--layout-padding-x-tablet) 1.75rem;
    gap: 1.2rem;
  }

  .home-compact-stack :deep(.section-title) {
    margin-bottom: 0.8rem;
  }
}

@media (max-width: 640px) {
  .home-compact-stack {
    padding: 1rem var(--layout-padding-x-mobile) 1.5rem;
    gap: 1rem;
  }

  .home-compact-stack :deep(.section-title) {
    margin-bottom: 0.72rem;
  }
}

@media (max-width: 480px) {
  .home-compact-stack {
    padding: 0.9rem var(--layout-padding-x-small) 1.35rem;
    gap: 0.9rem;
  }

  .home-compact-stack :deep(.section-title) {
    margin-bottom: 0.64rem;
  }
}
</style>
