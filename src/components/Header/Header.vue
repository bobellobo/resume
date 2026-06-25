<template>
  <header ref="headerRef" class="header">
    <div class="header-shell">
      <nav class="navbar">
        <a href="#home" class="logo" aria-label="Back to home section" @click="handleNavLinkClick">
          <span class="logo-mark" aria-hidden="true">TG</span>
        </a>
        <div
          ref="sectionSearchRef"
          class="section-search"
          @keydown.esc.stop="closeSectionMenu"
        >
          <div class="section-search-shell" :class="{ open: isSectionMenuOpen }">
            <Icon icon="lucide:search" class="section-search-icon" aria-hidden="true" />
            <input
              ref="sectionSearchInputRef"
              v-model="sectionQuery"
              type="search"
              class="section-search-input"
              placeholder="Search sections"
              aria-label="Search sections"
              @focus="openSectionMenu"
              @input="handleSectionQueryInput"
              @keydown.down.prevent="moveSectionHighlight(1)"
              @keydown.up.prevent="moveSectionHighlight(-1)"
              @keydown.enter.prevent="handleSectionSelect"
            />
            <kbd class="section-search-shortcut">Ctrl K</kbd>
          </div>

          <ul
            v-if="isSectionMenuOpen"
            class="section-search-menu"
            role="listbox"
            aria-label="Section search results"
          >
            <li v-if="filteredSections.length === 0" class="section-search-empty">
              No section found
            </li>
            <li v-for="(section, index) in filteredSections" :key="section.id">
              <button
                type="button"
                class="section-search-option"
                :class="{ active: index === highlightedSectionIndex }"
                role="option"
                :aria-selected="index === highlightedSectionIndex"
                @mouseenter="highlightedSectionIndex = index"
                @mousedown.prevent="goToSection(section.id)"
              >
                <span>{{ section.label }}</span>
                <span class="section-search-anchor">#{{ section.id }}</span>
              </button>
            </li>
          </ul>
        </div>
        <ul id="primary-navigation" :class="['nav-links', { open: isMobileMenuOpen }]">
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
              <span class="export-label">Export</span>
            </a>
            <button
              :class="['theme-btn', 'has-tooltip', `theme-${currentTheme}`]"
              :aria-label="currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
              :title="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
              :data-tooltip="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
              @click="toggleTheme"
            >
              <Transition name="theme-icon-swap" mode="out-in">
                <Icon
                  :key="currentTheme"
                  :icon="currentTheme === 'dark' ? 'lucide:moon' : 'lucide:sun-medium'"
                  class="theme-icon-svg"
                  aria-hidden="true"
                />
              </Transition>
            </button>
            <div
              ref="mobileLanguageSwitcherRef"
              class="language-switcher"
              @keydown.esc.stop="closeMobileLanguageMenu"
            >
              <button
                type="button"
                class="language-trigger has-tooltip"
                :class="{ 'menu-open': isMobileLanguageMenuOpen }"
                aria-label="Select language"
                title="Select language"
                data-tooltip="Select language"
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
            <span class="export-label">Export</span>
          </a>
          <button
            :class="['theme-btn', 'has-tooltip', `theme-${currentTheme}`]"
            :aria-label="currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
            :title="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
            :data-tooltip="currentTheme === 'dark' ? $t('misc.lightMode') : $t('misc.darkMode')"
            @click="toggleTheme"
          >
            <Transition name="theme-icon-swap" mode="out-in">
              <Icon
                :key="currentTheme"
                :icon="currentTheme === 'dark' ? 'lucide:moon' : 'lucide:sun-medium'"
                class="theme-icon-svg"
                aria-hidden="true"
              />
            </Transition>
          </button>
          <div
            ref="desktopLanguageSwitcherRef"
            class="language-switcher"
            @keydown.esc.stop="closeDesktopLanguageMenu"
          >
            <button
              type="button"
              class="language-trigger has-tooltip"
              :class="{ 'menu-open': isDesktopLanguageMenuOpen }"
              aria-label="Select language"
              title="Select language"
              data-tooltip="Select language"
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
      <TemplateNotice
        v-if="templateInfo.showNotice"
        class="header-template-notice"
        :repo-url="templateInfo.repoUrl"
      />
      </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useHeaderLogic } from './Header'
import TemplateNotice from '../TemplateNotice/TemplateNotice.vue'
import { getTemplateInfo } from '../../content/data/profile'
import { useSectionSearch } from '../../composables/useSectionSearch'
import { useMobileMenu } from '../../composables/useMobileMenu'

// Legacy composable for backward compatibility
const { currentLanguage, switchLanguage, currentTheme, toggleTheme } = useHeaderLogic()

// New composables
const { isSectionMenuOpen, sectionQuery, highlightedSectionIndex, filteredSections, openSectionMenu, closeSectionMenu, handleSectionQueryInput, moveSectionHighlight, selectHighlightedSection, goToSection } = useSectionSearch()

const { isMobileMenuOpen, isDesktopLanguageMenuOpen, isMobileLanguageMenuOpen, toggleDesktopLanguageMenu, toggleMobileLanguageMenu, closeDesktopLanguageMenu, closeMobileLanguageMenu, closeLanguageMenus, toggleMobileMenu, closeMobileMenu, handleWindowResize } = useMobileMenu()

// Template refs
const headerRef = ref<HTMLElement | null>(null)
const desktopLanguageSwitcherRef = ref<HTMLElement | null>(null)
const mobileLanguageSwitcherRef = ref<HTMLElement | null>(null)
const sectionSearchRef = ref<HTMLElement | null>(null)
const sectionSearchInputRef = ref<HTMLInputElement | null>(null)

const exportLink = `${import.meta.env.BASE_URL}?view=export`
const templateInfo = getTemplateInfo()

const currentLanguageLabel = computed(() => (currentLanguage.value === 'fr' ? 'Français' : 'English'))

// Handler functions
function focusSectionSearchInput() {
  closeMobileMenu()
  closeLanguageMenus()
  sectionSearchInputRef.value?.focus()
  sectionSearchInputRef.value?.select()
  openSectionMenu()
}

function handleNavLinkClick() {
  closeMobileMenu()
  closeLanguageMenus()
  closeSectionMenu()
}

function handleLanguageSelect(lang: 'en' | 'fr') {
  switchLanguage(lang)
  closeLanguageMenus()
}

function handleDocumentMouseDown(event: MouseEvent) {
  const target = event.target as Node | null

  if (target && headerRef.value && !headerRef.value.contains(target)) {
    closeMobileMenu()
    closeLanguageMenus()
    closeSectionMenu()
    return
  }

  if (sectionSearchRef.value && target && !sectionSearchRef.value.contains(target)) {
    closeSectionMenu()
  }

  if (desktopLanguageSwitcherRef.value && target && !desktopLanguageSwitcherRef.value.contains(target)) {
    closeDesktopLanguageMenu()
  }

  if (mobileLanguageSwitcherRef.value && target && !mobileLanguageSwitcherRef.value.contains(target)) {
    closeMobileLanguageMenu()
  }
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    focusSectionSearchInput()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentMouseDown)
  document.addEventListener('keydown', handleDocumentKeydown)
  window.addEventListener('resize', handleWindowResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentMouseDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
  window.removeEventListener('resize', handleWindowResize)
})

// Handle section selection
function handleSectionSelect() {
  const section = selectHighlightedSection()
  if (section) {
    goToSection(section.id)
  }
}
</script>

<style scoped src="./Header.css"></style>
