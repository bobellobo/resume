<template>
  <section id="home" class="hero">
    <div class="hero-shell">
      <article class="hero-card surface-card">
        <div class="hero-card-header">
          <img class="hero-photo" :src="heroPhoto" :alt="profileContent.photoAlt" />
          <div class="hero-identity-copy">
            <h1 class="hero-name">{{ profileContent.fullName }}</h1>
            <div class="hero-role-marquee" aria-label="Current role" aria-live="polite">
              <ul class="hero-role-track" :style="roleTrackStyle">
                <li
                  v-for="(role, roleIndex) in displayedRoles"
                  :key="`${role}-${roleIndex}`"
                  class="hero-role-item"
                >
                  {{ role }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul class="hero-details-grid" aria-label="Profile overview and contact links">
          <li class="hero-grid-item hero-grid-item-clickable">
            <a
              class="hero-grid-item-link"
              href="https://ensc.bordeaux-inp.fr/fr/presentation-de-l-ensc"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="profileContent.overview.universityLabel"
            >
              <GraduationCap class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ profileContent.universityLabel }}</span>
              <ArrowUpRight class="hero-grid-item-corner-icon" aria-hidden="true" />
            </a>
          </li>
          <li class="hero-grid-item">
            <div class="hero-grid-item-static" :aria-label="profileContent.overview.currentLocationLabel">
              <MapPin class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ profileContent.overview.currentLocation }}</span>
            </div>
          </li>
          <li class="hero-grid-item hero-grid-item-clickable">
            <a class="hero-grid-item-link" :href="`tel:${contact.phone}`" :aria-label="profileContent.overview.phoneLabel">
              <Phone class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ contact.phone }}</span>
              <ArrowUpRight class="hero-grid-item-corner-icon" aria-hidden="true" />
            </a>
          </li>
          <li class="hero-grid-item hero-grid-item-clickable">
            <a class="hero-grid-item-link" :href="`mailto:${contact.email}`" :aria-label="profileContent.overview.emailLabel">
              <Mail class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ contact.email }}</span>
              <ArrowUpRight class="hero-grid-item-corner-icon" aria-hidden="true" />
            </a>
          </li>
          <li class="hero-grid-item hero-grid-item-clickable">
            <a
              class="hero-grid-item-link"
              :href="contact.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="profileContent.overview.linkedinLabel"
            >
              <Globe class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ profileContent.overview.linkedinLabel }}</span>
              <ArrowUpRight class="hero-grid-item-corner-icon" aria-hidden="true" />
            </a>
          </li>
          <li class="hero-grid-item hero-grid-item-clickable">
            <a
              class="hero-grid-item-link"
              :href="contact.github"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="profileContent.overview.githubLabel"
            >
              <GitBranch class="hero-grid-leading-icon" aria-hidden="true" />
              <span class="hero-grid-value">{{ profileContent.overview.githubLabel }}</span>
              <ArrowUpRight class="hero-grid-item-corner-icon" aria-hidden="true" />
            </a>
          </li>
          <li class="hero-grid-item hero-grid-item-wide">
            <div class="hero-grid-item-static" :aria-label="profileContent.overview.spokenLanguagesLabel">
              <Languages class="hero-grid-leading-icon" aria-hidden="true" />
              <ul class="hero-language-flags" :aria-label="profileContent.overview.spokenLanguagesLabel">
                <li
                  v-for="(languageFlag, index) in spokenLanguageFlags"
                  :key="`${languageFlag.code}-${index}`"
                  class="hero-language-flag-item"
                  :aria-label="languageFlag.code.toUpperCase()"
                >
                  <img class="hero-language-flag-icon" :src="languageFlag.src" alt="" aria-hidden="true">
                  <span class="hero-language-level">{{ languageFlag.level }}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowUpRight,
  GitBranch,
  Globe,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone
} from '@lucide/vue'
import heroPhoto from '@content/images/bibi.jpeg'
import { getFlagSvgByCode, toFlagCode } from '../../content/data/languageFlags'
import { getProfileContent, getContactInfo } from '../../content/data/profile'
import { getSupportedLocale } from '../../content/locale'

const { locale } = useI18n()
const contact = getContactInfo()

const currentLocale = computed(() => getSupportedLocale(locale.value))
const profileContent = computed(() => getProfileContent(currentLocale.value))
const spokenLanguageFlags = computed(() => (
  profileContent.value.overview.spokenLanguages
      .map((language) => {
        const code = toFlagCode(language.code)
        if (!code) {
          return null
        }

        const src = getFlagSvgByCode(code)
        if (!src) {
          return null
        }

        return {
          code,
          level: language.level,
          src
        }
      })
      .filter((flag): flag is { code: string; level: string; src: string } => Boolean(flag))
))
const activeRoleIndex = ref(0)
const isRoleTransitionEnabled = ref(true)
const roleItemHeightPx = ref(0)
let roleRotationTimer: ReturnType<typeof setInterval> | undefined
let roleResetTimer: ReturnType<typeof setTimeout> | undefined

const ROLE_INTERVAL_MS = 2600
const ROLE_TRANSITION_MS = 520

const roles = computed(() => (
  profileContent.value.roles.length > 0
    ? profileContent.value.roles
    : [profileContent.value.exportRole]
))

const displayedRoles = computed(() => (
  roles.value.length > 1
    ? [...roles.value, roles.value[0]]
    : roles.value
))

const roleTrackStyle = computed(() => ({
  transform: `translateY(-${activeRoleIndex.value * roleItemHeightPx.value}px)`,
  transition: isRoleTransitionEnabled.value
    ? `transform ${ROLE_TRANSITION_MS}ms var(--motion-ease-standard)`
    : 'none'
}))

const measureRoleItemHeight = () => {
  const firstRoleItem = document.querySelector<HTMLElement>('.hero-role-item')
  if (!firstRoleItem) {
    return
  }

  roleItemHeightPx.value = firstRoleItem.getBoundingClientRect().height
}

const updateRoleMeasurements = async () => {
  await nextTick()
  measureRoleItemHeight()
}

const clearRoleTimers = () => {
  if (roleRotationTimer) {
    clearInterval(roleRotationTimer)
    roleRotationTimer = undefined
  }

  if (roleResetTimer) {
    clearTimeout(roleResetTimer)
    roleResetTimer = undefined
  }
}

const scheduleCloneResetIfNeeded = () => {
  if (roles.value.length <= 1) {
    return
  }

  const cloneIndex = displayedRoles.value.length - 1
  if (activeRoleIndex.value !== cloneIndex) {
    return
  }

  roleResetTimer = setTimeout(() => {
    isRoleTransitionEnabled.value = false
    activeRoleIndex.value = 0

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isRoleTransitionEnabled.value = true
      })
    })
  }, ROLE_TRANSITION_MS)
}

const startRoleRotation = () => {
  clearRoleTimers()

  if (roles.value.length <= 1) {
    activeRoleIndex.value = 0
    isRoleTransitionEnabled.value = false
    return
  }

  isRoleTransitionEnabled.value = true

  roleRotationTimer = setInterval(() => {
    activeRoleIndex.value += 1
    scheduleCloneResetIfNeeded()
  }, ROLE_INTERVAL_MS)
}

onMounted(() => {
  void updateRoleMeasurements()
  window.addEventListener('resize', measureRoleItemHeight)
  startRoleRotation()
})

watch(roles, () => {
  activeRoleIndex.value = 0
  isRoleTransitionEnabled.value = roles.value.length > 1
  void updateRoleMeasurements()
  startRoleRotation()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureRoleItemHeight)
  clearRoleTimers()
})
</script>

<style scoped src="./Hero.css"></style>
