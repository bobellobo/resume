import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type Theme = 'light' | 'dark'
type Language = 'en' | 'fr'

const THEME_STORAGE_KEY = 'theme'

export function useHeaderLogic() {
  const { locale } = useI18n()
  const currentLanguage = ref<Language>('en')
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
    const nextTheme = currentTheme.value === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const isStoredTheme = savedTheme === 'light' || savedTheme === 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme = isStoredTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    const activeLocale: Language = locale.value === 'fr' ? 'fr' : 'en';
    currentLanguage.value = activeLocale;
    locale.value = activeLocale;
  })

  const switchLanguage = (lang: string) => {
    const nextLanguage: Language = lang === 'fr' ? 'fr' : 'en';
    locale.value = nextLanguage;
    currentLanguage.value = nextLanguage;
  }

  return {
    currentLanguage,
    switchLanguage,
    currentTheme,
    toggleTheme
  }
}
