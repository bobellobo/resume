import { ref } from 'vue'

const MOBILE_BREAKPOINT = 900

/**
 * Manages mobile menu and language switcher states
 * Handles menu open/close logic
 */
export function useMobileMenu() {
  const isMobileMenuOpen = ref(false)
  const isDesktopLanguageMenuOpen = ref(false)
  const isMobileLanguageMenuOpen = ref(false)

  function toggleDesktopLanguageMenu() {
    isDesktopLanguageMenuOpen.value = !isDesktopLanguageMenuOpen.value
    isMobileLanguageMenuOpen.value = false
  }

  function toggleMobileLanguageMenu() {
    isMobileLanguageMenuOpen.value = !isMobileLanguageMenuOpen.value
    isDesktopLanguageMenuOpen.value = false
  }

  function closeDesktopLanguageMenu() {
    isDesktopLanguageMenuOpen.value = false
  }

  function closeMobileLanguageMenu() {
    isMobileLanguageMenuOpen.value = false
  }

  function closeLanguageMenus() {
    closeDesktopLanguageMenu()
    closeMobileLanguageMenu()
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value

    if (!isMobileMenuOpen.value) {
      closeMobileLanguageMenu()
    }
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
    closeMobileLanguageMenu()
  }

  function handleWindowResize() {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMobileMenu()
      closeMobileLanguageMenu()
    }
  }

  return {
    isMobileMenuOpen,
    isDesktopLanguageMenuOpen,
    isMobileLanguageMenuOpen,
    toggleDesktopLanguageMenu,
    toggleMobileLanguageMenu,
    closeDesktopLanguageMenu,
    closeMobileLanguageMenu,
    closeLanguageMenus,
    toggleMobileMenu,
    closeMobileMenu,
    handleWindowResize
  }
}
