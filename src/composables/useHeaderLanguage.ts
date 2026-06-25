import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Language } from './types'

const LANGUAGE_STORAGE_KEY = 'language'

/**
 * Manages language/locale switching and persistence
 * Handles localStorage sync and i18n integration
 */
export function useHeaderLanguage() {
  const { locale } = useI18n()
  const currentLanguage = ref<Language>('en')

  function switchLanguage(lang: string) {
    const nextLanguage: Language = lang === 'fr' ? 'fr' : 'en'
    locale.value = nextLanguage
    currentLanguage.value = nextLanguage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  function initializeLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    const activeLocale: Language = savedLanguage === 'fr' ? 'fr' : locale.value === 'fr' ? 'fr' : 'en'
    currentLanguage.value = activeLocale
    locale.value = activeLocale
  }

  onMounted(() => {
    initializeLanguage()
  })

  return {
    currentLanguage,
    switchLanguage
  }
}
