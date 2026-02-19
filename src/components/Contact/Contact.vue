<template>
  <section id="contact" class="contact section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('contact.title') }}</h2>
      <p>{{ $t('contact.description') }}</p>
      <button class="cta-button">{{ $t('contact.cta') }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="./Contact.css"></style>
