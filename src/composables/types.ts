/**
 * Type definitions for header composables
 */

export type Theme = 'light' | 'dark'
export type Language = 'en' | 'fr'
export type SectionId = 'home' | 'skills' | 'experience' | 'projects'

export interface Section {
  id: SectionId
  label: string
}
