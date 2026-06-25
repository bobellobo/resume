import { onMounted, ref } from 'vue'
import type { Theme } from './types'

const THEME_STORAGE_KEY = 'theme'

/**
 * Manages theme switching and persistence
 * Handles localStorage sync and system preference detection
 */
export function useHeaderTheme() {
  const currentTheme = ref<Theme>('light')

  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme)
  }

  function setTheme(theme: Theme) {
    currentTheme.value = theme
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  function toggleTheme() {
    const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const isStoredTheme = savedTheme === 'light' || savedTheme === 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme: Theme = isStoredTheme ? (savedTheme as Theme) : prefersDark ? 'dark' : 'light'

    setTheme(initialTheme)
  }

  onMounted(() => {
    initializeTheme()
  })

  return {
    currentTheme,
    toggleTheme
  }
}
