<template>
  <header class="header">
    <nav class="navbar">
      <div class="logo">Pippo</div>
      <ul class="nav-links">
        <li><a href="#home">{{ $t('nav.home') }}</a></li>
        <li><a href="#about">{{ $t('nav.about') }}</a></li>
        <li><a href="#projects">{{ $t('nav.projects') }}</a></li>
        <li><a href="#contact">{{ $t('nav.contact') }}</a></li>
      </ul>
      <div class="language-switcher">
        <button
          v-for="lang in ['en', 'fr']"
          :key="lang"
          class="lang-btn"
          :class="{ active: currentLanguage === lang }"
          @click="switchLanguage(lang)"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref(locale.value)

const switchLanguage = (lang: string) => {
  locale.value = lang
  currentLanguage.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
.header {
  background-color: var(--bg-white);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: 2rem;
}

.lang-btn {
  background-color: transparent;
  color: var(--text-dark);
  border: 2px solid var(--border-color);
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.lang-btn.active {
  background-color: var(--primary-color);
  color: var(--bg-white);
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .language-switcher {
    margin-left: 1rem;
  }
}
</style>
