import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getEnscContent, getEnscWebsite } from '../../content/data/ensc'

const LANGUAGE_STORAGE_KEY = 'language'

const normalizeText = (value: string) => value
  .replace(/\r\n/g, '\n')
  .replace(/\\n/g, '\n')
  .trim()

export function useEnscView() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value as 'en' | 'fr')
  const content = computed(() => getEnscContent(currentLocale.value))
  const website = getEnscWebsite()
  const articleText = computed(() => normalizeText(content.value.article))

  const switchLanguage = (lang: 'en' | 'fr') => {
    locale.value = lang
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  return {
    currentLocale,
    content,
    website,
    articleText,
    switchLanguage
  }
}
