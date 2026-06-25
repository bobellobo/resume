import { ref, Ref } from 'vue'

/**
 * Manages expansion state for collapsible items (e.g., cards, panels)
 * Works with both Set and Array-based tracking
 */
export function useExpansionState(useSet = false) {
  const expandedArray = ref<string[]>([])
  const expandedSet = new Set<string>()

  const expanded: Ref<string[]> | Set<string> = useSet ? expandedSet : expandedArray

  function isExpanded(id: string): boolean {
    if (useSet) {
      return expandedSet.has(id)
    }
    return expandedArray.value.includes(id)
  }

  function toggleExpanded(id: string): void {
    if (useSet) {
      if (expandedSet.has(id)) {
        expandedSet.delete(id)
      } else {
        expandedSet.add(id)
      }
    } else {
      const arr = expandedArray.value
      if (arr.includes(id)) {
        expandedArray.value = arr.filter((currentId: string) => currentId !== id)
      } else {
        expandedArray.value = [...arr, id]
      }
    }
  }

  function setExpanded(id: string, isExp: boolean): void {
    if (useSet) {
      if (isExp) {
        expandedSet.add(id)
      } else {
        expandedSet.delete(id)
      }
    } else {
      const arr = expandedArray.value
      const hasId = arr.includes(id)
      if (isExp && !hasId) {
        expandedArray.value = [...arr, id]
      } else if (!isExp && hasId) {
        expandedArray.value = arr.filter((currentId: string) => currentId !== id)
      }
    }
  }

  return {
    expanded,
    isExpanded,
    toggleExpanded,
    setExpanded
  }
}
