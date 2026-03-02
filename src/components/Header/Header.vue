<template>
  <header class="header">
    <nav class="navbar">
      <div class="logo">Titouan Guedon</div>
      <ul class="nav-links">
        <li><a href="#home">{{ $t('nav.home') }}</a></li>
        <li><a href="#about">{{ $t('nav.about') }}</a></li>
        <li><a href="#experience">{{ $t('nav.experience') }}</a></li>
        <li><a href="#projects">{{ $t('nav.projects') }}</a></li>
        <li><a href="#contact">{{ $t('nav.contact') }}</a></li>
      </ul>
      <div class="header-controls">
        <button
          :class="['theme-btn', `theme-${currentTheme}`]"
          :aria-label="currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          :title="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
          @click="toggleTheme"
        >
          <span class="theme-options" aria-hidden="true">
            <span class="theme-option theme-option-light">
              <svg class="theme-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
                <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M4.93 19.07L6.34 17.66" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M17.66 6.34L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <span class="theme-option theme-option-dark">
              <svg class="theme-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3c0 0-1.21 6.79 2.79 10.79S21 12.79 21 12.79Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </span>
        </button>
        <div class="language-switcher">
          <select
            id="language-select"
            class="language-select"
            :value="currentLanguage"
            aria-label="Select language"
            @change="switchLanguage(($event.target as HTMLSelectElement).value)"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useHeaderLogic } from './Header'

const { currentLanguage, switchLanguage, currentTheme, toggleTheme } = useHeaderLogic()
</script>

<style scoped src="./Header.css"></style>
