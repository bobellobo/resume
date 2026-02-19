import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import enMessages from '../content/en.json'
import frMessages from '../content/fr.json'
import './style.css'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
    fr: frMessages
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
