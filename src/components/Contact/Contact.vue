<template>
  <section id="contact" class="contact section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('contact.title') }}</h2>
      <p>{{ $t('contact.description') }}</p>
      <div class="contact-links">
        <a href="https://www.linkedin.com/in/titouan-guedon-150438198/" target="_blank" rel="noreferrer" class="contact-button">
          {{ $t('footer.links.linkedin') }}
        </a>
        <a href="https://github.com/bobellobo" target="_blank" rel="noreferrer" class="contact-button">
          {{ $t('footer.links.github') }}
        </a>
        <a href="mailto:titouanguedon@proton.me" target="_blank" rel="noreferrer" class="contact-button">
          {{ $t('footer.links.email') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped src="./Contact.css"></style>
