<template>
  <section id="projects" class="projects section-block">
    <div class="container">
      <h2 class="section-title">{{ $t('projects.title') }}</h2>
      <div
        class="projects-carousel"
        :style="carouselVars"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
      >
        <button
          class="carousel-arrow carousel-arrow-prev"
          type="button"
          :aria-label="$t('misc.previous')"
          :disabled="totalProjects <= 1"
          @click="handlePrevious"
        >
          ‹
        </button>

        <div class="carousel-viewport">
          <div
            :class="['carousel-track', { 'is-dragging': isMouseDown }]"
            :style="carouselStyle"
            @transitionend="handleTransitionEnd"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @touchcancel="handleTouchCancel"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseLeave"
          >
            <article
              v-for="(project, index) in loopedProjects"
              :key="`${project.id}-${index}`"
              class="project-slide"
            >
              <div
                class="project-card surface-card hover-lift"
                @click="handleCardClick(project)"
              >
                <div class="card-image">
                  <img :src="getProjectImageOrFallback(project.image, $t('projects.imageUnavailable'))" :alt="project.content[currentLocale].title" />
                </div>
                <div class="card-content">
                  <h3>{{ project.content[currentLocale].title }}</h3>
                  <p>{{ project.content[currentLocale].shortDescription }}</p>
                  <div class="card-tags">
                    <span v-for="tech in project.technologies" :key="tech" class="tag">
                      {{ tech }}
                    </span>
                  </div>
                  <a href="#" class="card-link" @click.prevent>
                    {{ $t('projectCard.viewProject') }}
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <button
          class="carousel-arrow carousel-arrow-next"
          type="button"
          :aria-label="$t('misc.next')"
          :disabled="totalProjects <= 1"
          @click="handleNext"
        >
          ›
        </button>
      </div>
      <p
        v-if="showSwipeHint"
        :class="['swipe-hint', { 'is-fading': isSwipeHintFading }]"
        aria-hidden="true"
      >
        ↔ {{ $t('projects.swipeHint') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useProjectsData, type Project, getProjectImageOrFallback } from './Projects'

  const { locale } = useI18n()
  const currentLocale = computed(() => locale.value as 'en' | 'fr')
  const emit = defineEmits<{
    selectProject: [project: Project]
  }>()

  const { projects } = useProjectsData()

  const virtualIndex = ref(0)
  const isTransitionEnabled = ref(true)
  const isAnimating = ref(false)
  const visibleCards = ref(1)
  const AUTO_ADVANCE_MS = 5000
  const SWIPE_THRESHOLD_PX = 48
  const SWIPE_INTENT_PX = 10
  const SWIPE_HINT_HIDE_DELAY_MS = 3800
  const SWIPE_HINT_FADE_DURATION_MS = 300
  const DESKTOP_BREAKPOINT = '(min-width: 1024px)'
  let autoplayTimer: number | null = null
  let swipeHintTimer: number | null = null
  let swipeHintFadeTimer: number | null = null
  let mediaQuery: MediaQueryList | null = null
  let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null

  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchDeltaX = ref(0)
  const isSwipeGesture = ref(false)
  const suppressCardClickUntil = ref(0)
  const mouseStartX = ref(0)
  const mouseDeltaX = ref(0)
  const isMouseDown = ref(false)
  const isMouseGesture = ref(false)
  const showSwipeHint = ref(false)
  const isSwipeHintFading = ref(false)

  const totalProjects = computed(() => projects.value.length)
  const cloneCount = computed(() => Math.min(visibleCards.value, totalProjects.value))

  const loopedProjects = computed(() => {
    if (totalProjects.value === 0) {
      return []
    }

    const headClones = projects.value.slice(0, cloneCount.value)
    const tailClones = projects.value.slice(-cloneCount.value)
    return [...tailClones, ...projects.value, ...headClones]
  })

  const carouselVars = computed(() => ({
    '--visible-cards': String(visibleCards.value)
  }))

  const carouselStyle = computed(() => ({
    transform: `translateX(-${(virtualIndex.value * 100) / visibleCards.value}%)`,
    transition: isTransitionEnabled.value ? 'transform 0.33s ease' : 'none'
  }))

  const setVirtualIndexWithoutAnimation = (nextIndex: number, onDone?: () => void) => {
    isTransitionEnabled.value = false
    virtualIndex.value = nextIndex

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isTransitionEnabled.value = true
        onDone?.()
      })
    })
  }

  const jumpToStart = () => {
    setVirtualIndexWithoutAnimation(cloneCount.value)
  }

  const navigateBy = (delta: number) => {
    if (totalProjects.value === 0 || isAnimating.value || !isTransitionEnabled.value) {
      return
    }

    isAnimating.value = true
    virtualIndex.value += delta
    restartAutoplay()
  }

  const handleNext = () => {
    navigateBy(1)
  }

  const handlePrevious = () => {
    navigateBy(-1)
  }

  const handleCardClick = (project: Project) => {
    if (Date.now() < suppressCardClickUntil.value) {
      return
    }

    emit('selectProject', project)
  }

  const stopAutoplay = () => {
    if (autoplayTimer !== null) {
      window.clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  const startAutoplay = () => {
    stopAutoplay()

    if (totalProjects.value <= 1) {
      return
    }

    autoplayTimer = window.setInterval(() => {
      if (isAnimating.value) {
        return
      }

      isAnimating.value = true
      virtualIndex.value += 1
    }, AUTO_ADVANCE_MS)
  }

  const restartAutoplay = () => {
    startAutoplay()
  }

  const clearSwipeHintTimers = () => {
    if (swipeHintTimer !== null) {
      window.clearTimeout(swipeHintTimer)
      swipeHintTimer = null
    }

    if (swipeHintFadeTimer !== null) {
      window.clearTimeout(swipeHintFadeTimer)
      swipeHintFadeTimer = null
    }
  }

  const hideSwipeHintImmediately = () => {
    clearSwipeHintTimers()
    showSwipeHint.value = false
    isSwipeHintFading.value = false
  }

  const fadeOutSwipeHint = () => {
    if (!showSwipeHint.value) {
      return
    }

    clearSwipeHintTimers()
    isSwipeHintFading.value = true
    swipeHintFadeTimer = window.setTimeout(() => {
      showSwipeHint.value = false
      isSwipeHintFading.value = false
      swipeHintFadeTimer = null
    }, SWIPE_HINT_FADE_DURATION_MS)
  }

  const scheduleSwipeHintFadeOut = () => {
    clearSwipeHintTimers()
    swipeHintTimer = window.setTimeout(() => {
      fadeOutSwipeHint()
      swipeHintTimer = null
    }, SWIPE_HINT_HIDE_DELAY_MS)
  }

  const syncSwipeHintVisibility = () => {
    const isSmallScreen = window.innerWidth <= 640

    if (!isSmallScreen || totalProjects.value <= 1) {
      hideSwipeHintImmediately()
      return
    }

    if (!showSwipeHint.value) {
      showSwipeHint.value = true
      isSwipeHintFading.value = false
      scheduleSwipeHintFadeOut()
    }
  }

  const updateVisibleCards = (isDesktop: boolean) => {
    visibleCards.value = isDesktop ? 3 : 1
  }

  const handleTransitionEnd = () => {
    if (totalProjects.value === 0) {
      isAnimating.value = false
      return
    }

    const start = cloneCount.value
    const end = cloneCount.value + totalProjects.value

    if (virtualIndex.value >= end) {
      setVirtualIndexWithoutAnimation(start, () => {
        isAnimating.value = false
      })
      return
    } else if (virtualIndex.value < start) {
      setVirtualIndexWithoutAnimation(start + totalProjects.value - 1, () => {
        isAnimating.value = false
      })
      return
    }

    isAnimating.value = false
  }

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1 || totalProjects.value <= 1) {
      return
    }

    touchStartX.value = event.touches[0].clientX
    touchStartY.value = event.touches[0].clientY
    touchDeltaX.value = 0
    isSwipeGesture.value = false
    stopAutoplay()
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1 || totalProjects.value <= 1) {
      return
    }

    const deltaX = event.touches[0].clientX - touchStartX.value
    const deltaY = event.touches[0].clientY - touchStartY.value

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_INTENT_PX) {
      isSwipeGesture.value = true
      touchDeltaX.value = deltaX
      fadeOutSwipeHint()
    }
  }

  const handleTouchEnd = () => {
    if (!isSwipeGesture.value || totalProjects.value <= 1) {
      startAutoplay()
      return
    }

    if (Math.abs(touchDeltaX.value) > SWIPE_THRESHOLD_PX) {
      suppressCardClickUntil.value = Date.now() + 300

      if (touchDeltaX.value < 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    } else {
      startAutoplay()
    }

    isSwipeGesture.value = false
    touchDeltaX.value = 0
  }

  const handleTouchCancel = () => {
    isSwipeGesture.value = false
    touchDeltaX.value = 0
    startAutoplay()
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || totalProjects.value <= 1) {
      return
    }

    isMouseDown.value = true
    isMouseGesture.value = false
    mouseStartX.value = event.clientX
    mouseDeltaX.value = 0
    stopAutoplay()
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.value || totalProjects.value <= 1) {
      return
    }

    const deltaX = event.clientX - mouseStartX.value

    if (Math.abs(deltaX) > SWIPE_INTENT_PX) {
      isMouseGesture.value = true
      mouseDeltaX.value = deltaX
      fadeOutSwipeHint()
      event.preventDefault()
    }
  }

  const finalizeMouseGesture = () => {
    if (!isMouseDown.value) {
      return
    }

    isMouseDown.value = false

    if (isMouseGesture.value && Math.abs(mouseDeltaX.value) > SWIPE_THRESHOLD_PX) {
      suppressCardClickUntil.value = Date.now() + 300

      if (mouseDeltaX.value < 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    } else {
      startAutoplay()
    }

    isMouseGesture.value = false
    mouseDeltaX.value = 0
  }

  const handleMouseUp = () => {
    finalizeMouseGesture()
  }

  const handleMouseLeave = () => {
    finalizeMouseGesture()
  }

  watch([totalProjects, visibleCards], ([count]) => {
    if (count === 0) {
      virtualIndex.value = 0
      stopAutoplay()
      return
    }

    jumpToStart()
    isAnimating.value = false

    startAutoplay()
    syncSwipeHintVisibility()
  }, { immediate: true })

  onMounted(() => {
    mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT)
    updateVisibleCards(mediaQuery.matches)
    mediaQueryHandler = (event: MediaQueryListEvent) => {
      updateVisibleCards(event.matches)
      syncSwipeHintVisibility()
    }
    mediaQuery.addEventListener('change', mediaQueryHandler)
    startAutoplay()
    syncSwipeHintVisibility()
  })

  onBeforeUnmount(() => {
    stopAutoplay()
    clearSwipeHintTimers()

    if (mediaQuery && mediaQueryHandler) {
      mediaQuery.removeEventListener('change', mediaQueryHandler)
    }
  })
</script>

<style scoped src="./Projects.css"></style>
