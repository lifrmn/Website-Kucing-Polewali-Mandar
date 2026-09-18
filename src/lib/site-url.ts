const PRODUCTION_FALLBACK_URL = 'https://website-kucing-polewali-mandar.vercel.app'

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  return withProtocol.replace(/\/$/, '')
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL

  if (configuredUrl) return normalizeUrl(configuredUrl)

  return process.env.NODE_ENV === 'production'
    ? PRODUCTION_FALLBACK_URL
    : 'http://localhost:3000'
}