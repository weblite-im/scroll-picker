import React, { useState, useEffect, useCallback } from 'react'
// @ts-ignore
import createScrollSnap from 'scroll-snap'

export function useScrollSnap<T>(
  {
    itemHeight,
    scrollRef,
    initialSnappedIndex = 0,
  }: {
    itemHeight: number
    scrollRef: React.MutableRefObject<HTMLElement | undefined>
    initialSnappedIndex?: number
  },
  deps: (T | T[])[],
) {
  const [snappedIndex, setSnappedIndex] = useState(initialSnappedIndex)

  const updateSnappedIndex = useCallback(
    (scrollContainer: HTMLElement) => {
      setSnappedIndex(scrollContainer.scrollTop / itemHeight)
    },
    [itemHeight],
  )

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    element.scrollTo({ top: initialSnappedIndex * itemHeight })
  }, deps)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    if (element)
      createScrollSnap(
        element,
        {
          snapDestinationY: `${itemHeight}px`,
        },
        () => updateSnappedIndex(element),
      )
  }, [])

  return snappedIndex
}
