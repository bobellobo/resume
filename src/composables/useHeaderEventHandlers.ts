import { onBeforeUnmount, onMounted, Ref } from 'vue'

interface EventHandlerDeps {
  headerRef: Ref<HTMLElement | null>
  desktopLanguageSwitcherRef: Ref<HTMLElement | null>
  mobileLanguageSwitcherRef: Ref<HTMLElement | null>
  sectionSearchRef: Ref<HTMLElement | null>
  closeMobileMenu: () => void
  closeLanguageMenus: () => void
  closeSectionMenu: () => void
  focusSectionSearchInput: () => void
  closeDesktopLanguageMenu: () => void
  closeMobileLanguageMenu: () => void
  handleWindowResize: () => void
}

/**
 * Manages global event handlers for header interactions
 * Handles clicks outside, keyboard shortcuts, and window resize
 */
export function useHeaderEventHandlers(deps: EventHandlerDeps) {
  const {
    headerRef,
    desktopLanguageSwitcherRef,
    mobileLanguageSwitcherRef,
    sectionSearchRef,
    closeMobileMenu,
    closeLanguageMenus,
    closeSectionMenu,
    focusSectionSearchInput,
    closeDesktopLanguageMenu,
    closeMobileLanguageMenu,
    handleWindowResize
  } = deps

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

    if (
      desktopLanguageSwitcherRef.value &&
      target &&
      !desktopLanguageSwitcherRef.value.contains(target)
    ) {
      closeDesktopLanguageMenu()
    }

    if (
      mobileLanguageSwitcherRef.value &&
      target &&
      !mobileLanguageSwitcherRef.value.contains(target)
    ) {
      closeMobileLanguageMenu()
    }
  }

  function handleWindowResizeWrapper() {
    handleWindowResize()
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
    window.addEventListener('resize', handleWindowResizeWrapper)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleDocumentMouseDown)
    document.removeEventListener('keydown', handleDocumentKeydown)
    window.removeEventListener('resize', handleWindowResizeWrapper)
  })
}
