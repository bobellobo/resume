import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SectionId, Section } from './types'

const SECTION_SCROLL_GAP = 16

/**
 * Manages section search menu state and filtering
 * Handles keyboard navigation and section navigation
 */
export function useSectionSearch() {
  const { t } = useI18n()
  const isSectionMenuOpen = ref(false)
  const sectionQuery = ref('')
  const highlightedSectionIndex = ref(0)

  const sections = computed<Section[]>(() => [
    { id: 'home', label: t('nav.home') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'skills', label: t('nav.skills') }
  ])

  const filteredSections = computed(() => {
    const query = sectionQuery.value.trim().toLowerCase()

    if (!query) {
      return sections.value
    }

    return sections.value.filter((section) => {
      return section.label.toLowerCase().includes(query) || section.id.includes(query)
    })
  })

  function openSectionMenu() {
    isSectionMenuOpen.value = true

    if (filteredSections.value.length === 0) {
      highlightedSectionIndex.value = -1
      return
    }

    if (
      highlightedSectionIndex.value < 0 ||
      highlightedSectionIndex.value >= filteredSections.value.length
    ) {
      highlightedSectionIndex.value = 0
    }
  }

  function closeSectionMenu() {
    isSectionMenuOpen.value = false
  }

  function handleSectionQueryInput() {
    openSectionMenu()
    highlightedSectionIndex.value = filteredSections.value.length > 0 ? 0 : -1
  }

  function moveSectionHighlight(delta: number) {
    openSectionMenu()

    if (filteredSections.value.length === 0) {
      highlightedSectionIndex.value = -1
      return
    }

    if (highlightedSectionIndex.value < 0) {
      highlightedSectionIndex.value = 0
      return
    }

    const next = highlightedSectionIndex.value + delta
    const count = filteredSections.value.length
    highlightedSectionIndex.value = (next + count) % count
  }

  function selectHighlightedSection() {
    if (highlightedSectionIndex.value < 0) {
      return
    }

    const section = filteredSections.value[highlightedSectionIndex.value]

    if (!section) {
      return
    }

    return section
  }

  function goToSection(sectionId: SectionId) {
    const targetSection = document.getElementById(sectionId)

    if (!targetSection) {
      return
    }

    const header = document.querySelector<HTMLElement>('.header')
    const headerOffset = header?.getBoundingClientRect().height ?? 0
    const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset - SECTION_SCROLL_GAP

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' })
    history.replaceState(null, '', `#${sectionId}`)

    const selectedSection = sections.value.find((section) => section.id === sectionId)
    sectionQuery.value = selectedSection?.label ?? ''
    closeSectionMenu()
  }

  return {
    isSectionMenuOpen,
    sectionQuery,
    highlightedSectionIndex,
    sections,
    filteredSections,
    openSectionMenu,
    closeSectionMenu,
    handleSectionQueryInput,
    moveSectionHighlight,
    selectHighlightedSection,
    goToSection
  }
}
