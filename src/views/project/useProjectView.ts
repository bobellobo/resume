import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProjectsData } from '../../content/data/projects'

const LANGUAGE_STORAGE_KEY = 'language'
const SWIPE_THRESHOLD_PX = 48
const SWIPE_INTENT_PX = 12

const normalizeText = (value: string) => value
  .replace(/\r\n/g, '\n')
  .replace(/\\n/g, '\n')
  .trim()

export function useProjectView() {
  const route = useRoute()
  const { locale } = useI18n()
  const { projects } = useProjectsData()

  const currentLocale = computed(() => locale.value as 'en' | 'fr')
  const projectSlug = computed(() => String(route.params.slug ?? ''))
  const galleryIndex = ref(0)
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchDeltaX = ref(0)
  const isSwipeGesture = ref(false)
  const mouseStartX = ref(0)
  const mouseDeltaX = ref(0)
  const isMouseDown = ref(false)
  const isMouseGesture = ref(false)

  const project = computed(() => projects.value.find((item) => item.slug === projectSlug.value))

  const validLinks = computed(() => {
    if (!project.value) {
      return []
    }

    return project.value.links.filter((link) => {
      const trimmedUrl = link.url.trim()
      return trimmedUrl.length > 0 && trimmedUrl !== '#'
    })
  })

  const normalizedTechnologies = computed(() => project.value?.technologies
    .map((item) => item.trim())
    .filter((item) => item.length > 0) ?? [])

  const normalizedKeywords = computed(() => project.value?.keywords
    .map((item) => item.trim())
    .filter((item) => item.length > 0) ?? [])

  const localizedLocation = computed(() => {
    if (!project.value) {
      return ''
    }

    return (project.value.location[currentLocale.value] ?? '').trim()
  })

  const hasLocation = computed(() => localizedLocation.value.length > 0)
  const hasTechnologies = computed(() => normalizedTechnologies.value.length > 0)
  const hasKeywords = computed(() => normalizedKeywords.value.length > 0)
  const hasLinks = computed(() => validLinks.value.length > 0)
  const showMeta = computed(() => hasLocation.value || hasTechnologies.value || hasKeywords.value || hasLinks.value)

  const articleText = computed(() => {
    if (!project.value) {
      return ''
    }

    return normalizeText(project.value.content[currentLocale.value].article)
  })

  const galleryImages = computed(() => {
    if (!project.value) {
      return []
    }

    return project.value.gallery.filter((image) => image.trim().length > 0)
  })

  const hasGallery = computed(() => galleryImages.value.length > 0)
  const showGalleryControls = computed(() => galleryImages.value.length > 1)
  const galleryTrackStyle = computed(() => ({
    transform: `translateX(-${galleryIndex.value * 100}%)`
  }))

  const setGalleryIndex = (index: number) => {
    if (galleryImages.value.length === 0) {
      galleryIndex.value = 0
      return
    }

    const total = galleryImages.value.length
    galleryIndex.value = (index + total) % total
  }

  const goToPreviousImage = () => {
    setGalleryIndex(galleryIndex.value - 1)
  }

  const goToNextImage = () => {
    setGalleryIndex(galleryIndex.value + 1)
  }

  const switchLanguage = (lang: 'en' | 'fr') => {
    locale.value = lang
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  const handleGalleryTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1 || !showGalleryControls.value) {
      return
    }

    touchStartX.value = event.touches[0].clientX
    touchStartY.value = event.touches[0].clientY
    touchDeltaX.value = 0
    isSwipeGesture.value = false
  }

  const handleGalleryTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1 || !showGalleryControls.value) {
      return
    }

    const deltaX = event.touches[0].clientX - touchStartX.value
    const deltaY = event.touches[0].clientY - touchStartY.value

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_INTENT_PX) {
      isSwipeGesture.value = true
      touchDeltaX.value = deltaX
      event.preventDefault()
    }
  }

  const resetTouchGesture = () => {
    touchDeltaX.value = 0
    isSwipeGesture.value = false
  }

  const handleGalleryTouchEnd = () => {
    if (!showGalleryControls.value) {
      resetTouchGesture()
      return
    }

    if (isSwipeGesture.value && Math.abs(touchDeltaX.value) > SWIPE_THRESHOLD_PX) {
      if (touchDeltaX.value < 0) {
        goToNextImage()
      } else {
        goToPreviousImage()
      }
    }

    resetTouchGesture()
  }

  const handleGalleryTouchCancel = () => {
    resetTouchGesture()
  }

  const handleGalleryMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || !showGalleryControls.value) {
      return
    }

    isMouseDown.value = true
    isMouseGesture.value = false
    mouseStartX.value = event.clientX
    mouseDeltaX.value = 0
  }

  const handleGalleryMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.value || !showGalleryControls.value) {
      return
    }

    const deltaX = event.clientX - mouseStartX.value

    if (Math.abs(deltaX) > SWIPE_INTENT_PX) {
      isMouseGesture.value = true
      mouseDeltaX.value = deltaX
      event.preventDefault()
    }
  }

  const resetMouseGesture = () => {
    isMouseDown.value = false
    isMouseGesture.value = false
    mouseDeltaX.value = 0
  }

  const finalizeMouseGesture = () => {
    if (!showGalleryControls.value) {
      resetMouseGesture()
      return
    }

    if (isMouseGesture.value && Math.abs(mouseDeltaX.value) > SWIPE_THRESHOLD_PX) {
      if (mouseDeltaX.value < 0) {
        goToNextImage()
      } else {
        goToPreviousImage()
      }
    }

    resetMouseGesture()
  }

  const handleGalleryMouseUp = () => {
    finalizeMouseGesture()
  }

  const handleGalleryMouseLeave = () => {
    finalizeMouseGesture()
  }

  watch(projectSlug, () => {
    galleryIndex.value = 0
    resetTouchGesture()
    resetMouseGesture()
  })

  return {
    currentLocale,
    project,
    validLinks,
    normalizedTechnologies,
    normalizedKeywords,
    localizedLocation,
    hasLocation,
    hasTechnologies,
    hasKeywords,
    hasLinks,
    showMeta,
    articleText,
    galleryImages,
    hasGallery,
    showGalleryControls,
    galleryTrackStyle,
    galleryIndex,
    isMouseDown,
    switchLanguage,
    setGalleryIndex,
    goToPreviousImage,
    goToNextImage,
    handleGalleryTouchStart,
    handleGalleryTouchMove,
    handleGalleryTouchEnd,
    handleGalleryTouchCancel,
    handleGalleryMouseDown,
    handleGalleryMouseMove,
    handleGalleryMouseUp,
    handleGalleryMouseLeave
  }
}
