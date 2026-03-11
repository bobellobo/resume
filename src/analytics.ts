declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

const GA_SCRIPT_BASE_URL = 'https://www.googletagmanager.com/gtag/js'

const appendAnalyticsScript = (measurementId: string) => {
  const script = document.createElement('script')
  script.async = true
  script.src = `${GA_SCRIPT_BASE_URL}?id=${measurementId}`
  document.head.appendChild(script)
}

export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

  if (!measurementId) {
    return
  }

  appendAnalyticsScript(measurementId)

  window.dataLayer = window.dataLayer || []

  const gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }

  gtag('js', new Date())
  gtag('config', measurementId, {
    anonymize_ip: true
  })
}

export {}