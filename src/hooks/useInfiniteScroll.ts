import { useEffect, useRef } from 'react'

export function useInfiniteScroll(onLoadMore: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const callbackRef = useRef(onLoadMore)

  useEffect(() => {
    callbackRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) callbackRef.current()
        }
      },
      { rootMargin: '600px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return sentinelRef
}
