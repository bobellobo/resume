<template>
  <section id="about" class="about section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('about.title') }}</h2>
      <p>{{ $t('about.description') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="./About.css"></style>
