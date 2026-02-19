import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useHeaderLogic() {
  const { locale } = useI18n()
  const currentLanguage = ref(locale.value)

  const switchLanguage = (lang: string) => {
    locale.value = lang
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  return {
    currentLanguage,
    switchLanguage
  }
}
