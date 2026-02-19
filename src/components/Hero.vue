<template>
  <section id="home" class="hero">
    <div class="hero-content">
      <h1>{{ $t('hero.title') }}</h1>
      <p>{{ $t('hero.subtitle') }}</p>
      <button class="cta-button">{{ $t('hero.cta') }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="../styles/components/Hero.css"></style>
