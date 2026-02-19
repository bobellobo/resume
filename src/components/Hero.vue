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

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: var(--bg-white);
  padding: 8rem 20px;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.hero-content p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .hero {
    padding: 4rem 20px;
  }
}
</style>
