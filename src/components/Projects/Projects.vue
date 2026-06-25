<template>
  <section id="projects" class="home-stack-section projects">
      <h2 class="section-title">{{ $t('projects.title') }}</h2>
      <div class="projects-list" role="list">
        <article
          v-for="project in projects"
          :key="project.slug"
          :class="['project-list-card', { 'is-expanded': isExpanded(project.slug) }]"
          role="listitem"
        >
          <div class="project-list-row">
            <div class="project-list-main">
              <span class="project-list-icon" aria-hidden="true">
                <Icon :icon="resolveProjectIcon(project.icon)" class="project-list-icon-svg" />
              </span>
              <h3 class="project-list-title">{{ project.content[currentLocale].title }}</h3>
            </div>

            <div class="project-list-actions">
              <div v-if="getTechnologies(project).length" class="project-list-tech-inline" aria-label="Technologies">
                <span
                  v-for="technology in getTechnologies(project)"
                  :key="`${project.slug}-${technology}`"
                  class="tech-badge"
                >
                  {{ technology }}
                </span>
              </div>

              <button
                type="button"
                class="project-action-btn"
                :aria-label="isExpanded(project.slug) ? $t('projects.collapseProject') : $t('projects.expandProject')"
                :aria-expanded="isExpanded(project.slug)"
                @click="toggleExpanded(project.slug)"
              >
                <svg
                  :class="['chevron-toggle-icon', { 'is-expanded': isExpanded(project.slug) }]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <RouterLink
                class="project-action-btn"
                :to="{ name: 'project-detail', params: { slug: project.slug } }"
                :aria-label="$t('projectCard.viewProject')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8 16L16 8"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 8h6v6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </RouterLink>
            </div>
          </div>

          <Transition name="project-expand">
            <div v-if="isExpanded(project.slug)" class="project-list-details">
              <p>{{ project.content[currentLocale].shortDescription }}</p>
            </div>
          </Transition>
        </article>
      </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useProjectsData, type Project } from '../../content/data/projects'
import { useProjectExpansion } from '../../composables/useProjectExpansion'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value as 'en' | 'fr')

const { projects } = useProjectsData()
const { isExpanded, toggleExpanded, resolveProjectIcon } = useProjectExpansion()

const getTechnologies = (project: Project): string[] => (
  project.technologies.filter((technology) => technology.trim().length > 0)
)
</script>

<style scoped src="./Projects.css"></style>