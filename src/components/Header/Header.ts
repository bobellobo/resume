import { useHeaderTheme } from '../../composables/useHeaderTheme'
import { useHeaderLanguage } from '../../composables/useHeaderLanguage'

/**
 * Composable combining theme and language management
 * Exported for backward compatibility with Header component
 */
export function useHeaderLogic() {
  const { currentTheme, toggleTheme } = useHeaderTheme()
  const { currentLanguage, switchLanguage } = useHeaderLanguage()

  return {
    currentLanguage,
    switchLanguage,
    currentTheme,
    toggleTheme
  }
}
