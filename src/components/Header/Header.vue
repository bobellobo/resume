<template>
  <header ref="headerRef" class="header">
    <nav class="navbar">
      <a href="#home" class="logo" @click="handleNavLinkClick">Titouan Guedon</a>
      <ul id="primary-navigation" :class="['nav-links', { open: isMobileMenuOpen }]">
        <li><a href="#home" @click="handleNavLinkClick">{{ $t('nav.home') }}</a></li>
        <li><a href="#skills" @click="handleNavLinkClick">{{ $t('nav.skills') }}</a></li>
        <li><a href="#experience" @click="handleNavLinkClick">{{ $t('nav.experience') }}</a></li>
        <li><a href="#projects" @click="handleNavLinkClick">{{ $t('nav.projects') }}</a></li>
        <li><a href="#contact" @click="handleNavLinkClick">{{ $t('nav.contact') }}</a></li>
        <li class="mobile-menu-controls">
          <div class="mobile-controls-row">
            <a
              class="export-link has-tooltip"
              :href="exportLink"
              data-tooltip="Open export view"
              title="Open export view"
              aria-label="Open export view"
              @click="handleNavLinkClick"
            >
              <svg class="export-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
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
              ref="mobileLanguageSwitcherRef"
              class="language-switcher"
              @keydown.esc.stop="closeMobileLanguageMenu"
            >
              <button
                type="button"
                class="language-trigger"
                :class="{ 'menu-open': isMobileLanguageMenuOpen }"
                aria-label="Select language"
                aria-haspopup="listbox"
                :aria-expanded="isMobileLanguageMenuOpen"
                @click="toggleMobileLanguageMenu"
              >
                {{ currentLanguageLabel }}
              </button>

              <ul v-if="isMobileLanguageMenuOpen" class="language-menu" role="listbox" aria-label="Language options">
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
        </li>
      </ul>
      <div class="header-controls">
        <div class="desktop-controls">
          <a
            class="export-link has-tooltip"
            :href="exportLink"
            data-tooltip="Open export view"
            title="Open export view"
            aria-label="Open export view"
          >
            <svg class="export-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 3h6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
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
            ref="desktopLanguageSwitcherRef"
            class="language-switcher"
            @keydown.esc.stop="closeDesktopLanguageMenu"
          >
            <button
              type="button"
              class="language-trigger"
              :class="{ 'menu-open': isDesktopLanguageMenuOpen }"
              aria-label="Select language"
              aria-haspopup="listbox"
              :aria-expanded="isDesktopLanguageMenuOpen"
              @click="toggleDesktopLanguageMenu"
            >
              {{ currentLanguageLabel }}
            </button>

            <ul v-if="isDesktopLanguageMenuOpen" class="language-menu" role="listbox" aria-label="Language options">
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
        <button
          type="button"
          :class="['menu-toggle', { 'menu-open': isMobileMenuOpen }]"
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <span class="menu-toggle-line"></span>
          <span class="menu-toggle-line"></span>
          <span class="menu-toggle-line"></span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHeaderLogic } from './Header'

const { currentLanguage, switchLanguage, currentTheme, toggleTheme } = useHeaderLogic()
const MOBILE_BREAKPOINT = 900

const headerRef = ref<HTMLElement | null>(null)
const desktopLanguageSwitcherRef = ref<HTMLElement | null>(null)
const mobileLanguageSwitcherRef = ref<HTMLElement | null>(null)
const isDesktopLanguageMenuOpen = ref(false)
const isMobileLanguageMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const exportLink = '/resume/?view=export'

const currentLanguageLabel = computed(() => (currentLanguage.value === 'fr' ? 'Français' : 'English'))

const toggleDesktopLanguageMenu = () => {
  isDesktopLanguageMenuOpen.value = !isDesktopLanguageMenuOpen.value
  isMobileLanguageMenuOpen.value = false
}

const toggleMobileLanguageMenu = () => {
  isMobileLanguageMenuOpen.value = !isMobileLanguageMenuOpen.value
  isDesktopLanguageMenuOpen.value = false
}

const closeDesktopLanguageMenu = () => {
  isDesktopLanguageMenuOpen.value = false
}

const closeMobileLanguageMenu = () => {
  isMobileLanguageMenuOpen.value = false
}

const closeLanguageMenus = () => {
  closeDesktopLanguageMenu()
  closeMobileLanguageMenu()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value

  if (!isMobileMenuOpen.value) {
    closeMobileLanguageMenu()
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  closeMobileLanguageMenu()
}

const handleNavLinkClick = () => {
  closeMobileMenu()
  closeLanguageMenus()
}

const handleLanguageSelect = (lang: 'en' | 'fr') => {
  switchLanguage(lang)
  closeLanguageMenus()
}

const handleDocumentMouseDown = (event: MouseEvent) => {
  const target = event.target as Node | null

  if (target && headerRef.value && !headerRef.value.contains(target)) {
    closeMobileMenu()
    closeLanguageMenus()
    return
  }

  if (desktopLanguageSwitcherRef.value && target && !desktopLanguageSwitcherRef.value.contains(target)) {
    closeDesktopLanguageMenu()
  }

  if (mobileLanguageSwitcherRef.value && target && !mobileLanguageSwitcherRef.value.contains(target)) {
    closeMobileLanguageMenu()
  }
}

const handleWindowResize = () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMobileMenu()
    closeMobileLanguageMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown)
  window.addEventListener('resize', handleWindowResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown)
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<style scoped src="./Header.css"></style>
