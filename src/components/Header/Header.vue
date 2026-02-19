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
import { useHeaderLogic } from './Header'

const { currentLanguage, switchLanguage } = useHeaderLogic()
</script>

<style scoped src="./Header.css"></style>
