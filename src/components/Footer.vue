<template>
  <footer class="footer">
    <div class="container">
      <p>{{ $t('footer.copyright') }}</p>
      <div class="social-links">
        <a href="#">{{ $t('footer.links.linkedin') }}</a>
        <a href="#">{{ $t('footer.links.github') }}</a>
        <a href="#">{{ $t('footer.links.twitter') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useI18n()
</script>

<style scoped>
.footer {
  background-color: var(--text-dark);
  color: var(--bg-white);
  padding: 2rem 20px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-links a {
  color: var(--bg-white);
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--primary-color);
}
</style>
