import { useEffect, useState } from 'react'

export type ViewportLayout = 'desktop' | 'mobile'

const QUERY = '(min-width: 820px) and (min-height: 520px)'

function currentLayout(): ViewportLayout {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia(QUERY).matches ? 'desktop' : 'mobile'
}

export function useViewportLayout(): ViewportLayout {
  const [layout, setLayout] = useState<ViewportLayout>(currentLayout)

  useEffect(() => {
    const query = window.matchMedia(QUERY)
    const handleChange = () => setLayout(query.matches ? 'desktop' : 'mobile')
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return layout
}
