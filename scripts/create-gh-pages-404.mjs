import { copyFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(currentDir, '../dist')
const indexPath = resolve(distDir, 'index.html')
const fallbackPath = resolve(distDir, '404.html')

async function ensureExists(path) {
  await access(path, constants.F_OK)
}

async function main() {
  try {
    await ensureExists(indexPath)
    await copyFile(indexPath, fallbackPath)
    console.log('Generated dist/404.html for GitHub Pages SPA fallback.')
  } catch (error) {
    console.error('Unable to create dist/404.html. Did the build finish successfully?')
    console.error(error)
    process.exitCode = 1
  }
}

main()
