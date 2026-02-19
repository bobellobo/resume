import { getFileNameFromPath } from "./utils";

const images = import.meta.glob('@content/projects/images/*', 
  { eager: true, import: 'default'}) as Record<string, string>;


export const makeImageMap = () => Object.entries(images).reduce<Record<string, string>>(
  (map, [path, imageUrl]) => {

    const fileName = getFileNameFromPath(path);
    if (fileName) {
      map[fileName] = imageUrl
    }
    return map
  },
  {}
)

const fallbackImageCache = new Map<string, string>();
const makeFallBackImage = (label: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#1f2937"/>
    <rect x="40" y="40" width="1120" height="550" rx="20" fill="#374151"/>
    <circle cx="480" cy="280" r="70" fill="#6b7280"/>
    <path d="M340 460 L500 320 L620 430 L720 350 L860 460 Z" fill="#9ca3af"/>
    <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#e5e7eb">${label}</text>
    </svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const createFallbackProjectImage = (label: string): string => {
return fallbackImageCache.get(label) ?? (
    fallbackImageCache.set(label, makeFallBackImage(label)),
    fallbackImageCache.get(label)!
);
}






