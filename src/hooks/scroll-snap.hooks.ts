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
  deps: (T | T[])[]
) {
  const [snappedIndex, setSnappedIndex] = useState<number>(initialSnappedIndex)

  const updateSnappedIndex = useCallback(
    (scrollContainer: HTMLElement) => {
      const newSnappedIndex = Math.floor(scrollContainer.scrollTop / itemHeight)
      setSnappedIndex(newSnappedIndex)
    },
    [itemHeight]
  )

  useEffect(() => {
    setSnappedIndex(initialSnappedIndex)
    const element = scrollRef.current
    if (!element) return

    element.scrollTo({ top: initialSnappedIndex * itemHeight })
  }, [initialSnappedIndex, ...deps])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    if (element)
      createScrollSnap(
        element,
        {
          snapDestinationY: `${itemHeight}px`,
        },
        () => updateSnappedIndex(element)
      )
  }, [])

  return snappedIndex
}
