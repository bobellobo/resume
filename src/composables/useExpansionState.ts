import { ref, Ref } from 'vue'

/**
 * Manages expansion state for collapsible items (e.g., cards, panels)
 * Works with both Set and Array-based tracking
 */
export function useExpansionState(useSet = false) {
  const expandedArray = ref<string[]>([])
  const expandedSet = ref<Set<string>>(new Set<string>())

  const expanded: Ref<string[]> | Ref<Set<string>> = useSet ? expandedSet : expandedArray

  function isExpanded(id: string): boolean {
    if (useSet) {
      return expandedSet.value.has(id)
    }
    return expandedArray.value.includes(id)
  }

  function toggleExpanded(id: string): void {
    if (useSet) {
      const nextSet = new Set(expandedSet.value)
      if (nextSet.has(id)) {
        nextSet.delete(id)
      } else {
        nextSet.add(id)
      }
      expandedSet.value = nextSet
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
      const nextSet = new Set(expandedSet.value)
      if (isExp) {
        nextSet.add(id)
      } else {
        nextSet.delete(id)
      }
      expandedSet.value = nextSet
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
