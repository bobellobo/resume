<template>
  <section id="contact" class="contact">
    <div class="container">
      <h2>{{ $t('contact.title') }}</h2>
      <p>{{ $t('contact.description') }}</p>
      <button class="cta-button">{{ $t('contact.cta') }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped>
.contact {
  padding: 6rem 20px;
  background-color: var(--bg-light);
  text-align: center;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  color: var(--text-dark);
  font-size: 2rem;
  margin-bottom: 3rem;
}

p {
  color: var(--text-light);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: var(--primary-color);
  color: var(--bg-white);
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.cta-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .contact {
    padding: 4rem 20px;
  }
}
</style>
