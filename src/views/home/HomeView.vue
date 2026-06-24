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
import Header from '../../components/Header/Header.vue'
import Hero from '../../components/Hero/Hero.vue'
import Skills from '../../components/Skills/Skills.vue'
import Experience from '../../components/Experience/Experience.vue'
import Projects from '../../components/Projects/Projects.vue'
import Footer from '../../components/Footer/Footer.vue'
</script>

<style scoped src="./HomeView.css"></style>
