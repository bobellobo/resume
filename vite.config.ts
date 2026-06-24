import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

function normalizeBasePath(basePath: string): string {
  const trimmed = basePath.trim()
  if (!trimmed || trimmed === '/') {
    return '/'
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function resolveGitHubPagesBase(): string {
  const explicitBase = process.env.VITE_BASE_PATH
  if (explicitBase) {
    return normalizeBasePath(explicitBase)
  }

  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (!repository || repository.endsWith('.github.io')) {
    return '/'
  }

  return `/${repository}/`
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@content': fileURLToPath(new URL('./content', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: true
  },
  base: resolveGitHubPagesBase(),
})
