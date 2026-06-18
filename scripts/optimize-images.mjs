import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const CONTENT_DIR = path.resolve('content')
const IMAGES_DIR = path.join(CONTENT_DIR, 'images')
const PROJECTS_JSON_PATH = path.join(CONTENT_DIR, 'json', 'projects.json')

const MAX_WIDTH = 1920
const QUALITY_WEBP = 78

const IMAGE_EXTENSIONS = new Set(['.png'])

const toPosix = (value) => value.replace(/\\/g, '/')

const withImagesPrefix = (value) => (value.startsWith('images/') ? value : `images/${value}`)

const getTargetExtension = () => '.webp'

const optimizeImage = async (inputPath, outputPath, sourceExtension, targetExtension) => {
  let pipeline = sharp(inputPath, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_WIDTH, fit: 'inside', withoutEnlargement: true })

  if (targetExtension === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY_WEBP, effort: 6 })
  }

  await pipeline.toFile(outputPath)

  if (sourceExtension !== targetExtension) {
    await fs.unlink(inputPath)
  }
}

const rewriteProjectImageRef = (reference, fileNameMap) => {
  const normalized = toPosix(reference)
  const hasDirectory = normalized.includes('/')
  const originalFileName = path.posix.basename(normalized)
  const nextFileName = fileNameMap.get(originalFileName)

  if (!nextFileName) {
    return reference
  }

  if (!hasDirectory) {
    return nextFileName
  }

  const directory = normalized.slice(0, normalized.lastIndexOf('/') + 1)
  return `${directory}${nextFileName}`
}

const main = async () => {
  const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true })
  const imageFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))

  const fileNameMap = new Map()
  const operations = []

  for (const fileName of imageFiles) {
    const sourceExtension = path.extname(fileName).toLowerCase()
    const targetExtension = getTargetExtension(sourceExtension)
    const baseName = path.basename(fileName, sourceExtension)
    const nextFileName = `${baseName}${targetExtension}`

    const inputPath = path.join(IMAGES_DIR, fileName)
    const outputPath = path.join(IMAGES_DIR, nextFileName)

    operations.push({ fileName, nextFileName, sourceExtension, targetExtension, inputPath, outputPath })
    fileNameMap.set(fileName, nextFileName)
  }

  for (const operation of operations) {
    await optimizeImage(
      operation.inputPath,
      operation.outputPath,
      operation.sourceExtension,
      operation.targetExtension
    )
  }

  const rawProjects = await fs.readFile(PROJECTS_JSON_PATH, 'utf8')
  const projects = JSON.parse(rawProjects)

  for (const project of projects) {
    project.image = rewriteProjectImageRef(project.image, fileNameMap)
    project.gallery = (project.gallery ?? []).map((imageRef) => rewriteProjectImageRef(imageRef, fileNameMap))
  }

  await fs.writeFile(PROJECTS_JSON_PATH, `${JSON.stringify(projects, null, 2)}\n`, 'utf8')

  const converted = operations.filter((entry) => entry.fileName !== entry.nextFileName)

  console.log(`Optimized ${operations.length} images (${converted.length} converted format).`)
  if (converted.length > 0) {
    console.log('Converted files:')
    for (const conversion of converted) {
      console.log(`- ${conversion.fileName} -> ${conversion.nextFileName}`)
    }
  }

  console.log(`Updated project references in ${toPosix(path.relative(process.cwd(), PROJECTS_JSON_PATH))}.`)
}

main().catch((error) => {
  console.error('Image optimization failed:', error)
  process.exitCode = 1
})
