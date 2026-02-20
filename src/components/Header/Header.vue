<template>
  <header class="header">
    <nav class="navbar">
      <div class="logo">Titouan Guedon / <span class="job-title">{{ $t('misc.jobTitle') }}</span></div>
      <ul class="nav-links">
        <li><a href="#home">{{ $t('nav.home') }}</a></li>
        <li><a href="#about">{{ $t('nav.about') }}</a></li>
        <li><a href="#projects">{{ $t('nav.projects') }}</a></li>
        <li><a href="#contact">{{ $t('nav.contact') }}</a></li>
      </ul>
      <div class="header-controls">
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
        <button
          class="theme-btn"
          :aria-label="currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
          @click="toggleTheme"
        >
          <span class="theme-icon">{{ currentTheme === 'dark' ? '☀️' : '🌙' }}</span>
          <span class="theme-label">{{ currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode') }}</span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useHeaderLogic } from './Header'

const { currentLanguage, switchLanguage, currentTheme, toggleTheme } = useHeaderLogic()
</script>

<style scoped src="./Header.css"></style>
