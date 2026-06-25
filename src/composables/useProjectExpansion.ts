import { useExpansionState } from './useExpansionState'

const ICON_COLLECTION = 'lucide'
const FALLBACK_ICON = 'circle-help'

/**
 * Manages project card expansion state and utilities
 */
export function useProjectExpansion() {
  const { expanded, isExpanded, toggleExpanded } = useExpansionState(true)

  function resolveProjectIcon(iconSlug: string): string {
    const slug = iconSlug?.trim() || FALLBACK_ICON
    return `${ICON_COLLECTION}:${slug}`
  }

  return {
    expandedProjects: expanded,
    isExpanded,
    toggleExpanded,
    resolveProjectIcon
  }
}
