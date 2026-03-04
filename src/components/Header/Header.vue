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
        <div
          ref="languageSwitcherRef"
          class="language-switcher"
          @keydown.esc.stop="closeLanguageMenu"
        >
          <button
            type="button"
            class="language-trigger"
            :class="{ 'menu-open': isLanguageMenuOpen }"
            aria-label="Select language"
            aria-haspopup="listbox"
            :aria-expanded="isLanguageMenuOpen"
            @click="toggleLanguageMenu"
          >
            {{ currentLanguageLabel }}
          </button>

          <ul v-if="isLanguageMenuOpen" class="language-menu" role="listbox" aria-label="Language options">
            <li>
              <button
                type="button"
                class="language-option"
                :class="{ active: currentLanguage === 'en' }"
                role="option"
                :aria-selected="currentLanguage === 'en'"
                @click="handleLanguageSelect('en')"
              >
                English
              </button>
            </li>
            <li>
              <button
                type="button"
                class="language-option"
                :class="{ active: currentLanguage === 'fr' }"
                role="option"
                :aria-selected="currentLanguage === 'fr'"
                @click="handleLanguageSelect('fr')"
              >
                Français
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHeaderLogic } from './Header'

const { currentLanguage, switchLanguage, currentTheme, toggleTheme } = useHeaderLogic()

const languageSwitcherRef = ref<HTMLElement | null>(null)
const isLanguageMenuOpen = ref(false)

const currentLanguageLabel = computed(() => (currentLanguage.value === 'fr' ? 'Français' : 'English'))

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const closeLanguageMenu = () => {
  isLanguageMenuOpen.value = false
}

const handleLanguageSelect = (lang: 'en' | 'fr') => {
  switchLanguage(lang)
  closeLanguageMenu()
}

const handleDocumentMouseDown = (event: MouseEvent) => {
  if (!languageSwitcherRef.value) {
    return
  }

  const target = event.target as Node | null

  if (target && !languageSwitcherRef.value.contains(target)) {
    closeLanguageMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown)
})
</script>

<style scoped src="./Header.css"></style>
