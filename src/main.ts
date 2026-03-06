import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import enMessages from '@content/i18n/en.json'
import frMessages from '@content/i18n/fr.json'
import './style.css'

const LANGUAGE_STORAGE_KEY = 'language'
const storedTheme = localStorage.getItem('theme')
const isStoredTheme = storedTheme === 'light' || storedTheme === 'dark'
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = isStoredTheme ? storedTheme : (prefersDark ? 'dark' : 'light')
const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
const initialLanguage = storedLanguage === 'fr' ? 'fr' : 'en'

document.documentElement.setAttribute('data-theme', initialTheme)

const i18n = createI18n({
  legacy: false,
  locale: initialLanguage,
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
    fr: frMessages
  }
});

const app = createApp(App)
app.use(i18n)
app.mount('#app')
