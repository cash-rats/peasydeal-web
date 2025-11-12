import createCache from '@emotion/cache'

export default function createEmotionCache() {
  let insertionPoint

  if (typeof document !== 'undefined') {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  const cache = createCache({ key: 'cha', insertionPoint })
  cache.compat = true
  return cache
}
