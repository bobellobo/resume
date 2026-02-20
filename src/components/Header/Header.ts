import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

export function useHeaderLogic() {
  const { locale } = useI18n()
  const currentLanguage = ref(locale.value)
  const currentTheme = ref<Theme>('light')

  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  const toggleTheme = () => {
    const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const isStoredTheme = savedTheme === 'light' || savedTheme === 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme: Theme = isStoredTheme ? savedTheme : (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
  })

  const switchLanguage = (lang: string) => {
    locale.value = lang
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  return {
    currentLanguage,
    switchLanguage,
    currentTheme,
    toggleTheme
  }
}
