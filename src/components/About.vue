<template>
  <section id="about" class="about">
    <div class="container">
      <h2>{{ $t('about.title') }}</h2>
      <p>{{ $t('about.description') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped>
.about {
  padding: 6rem 20px;
  background-color: var(--bg-light);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  color: var(--text-dark);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

p {
  color: var(--text-light);
  font-size: 1.1rem;
  text-align: center;
  line-height: 1.8;
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .about {
    padding: 4rem 20px;
  }
}
</style>
