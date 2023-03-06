import { useEffect, useRef } from 'react'
import { Box, Stack, styled } from '@mui/material'
import { useScrollSnap } from '../hooks/scroll-snap.hooks'

const ITEM_HEIGHT = 48
const CONTAINER_HEIGHT = ITEM_HEIGHT * 3

const ScrollSnapContainer = styled(Box)(() => ({
  width: '100px',
  overflowX: 'hidden',
  overflowY: 'auto',
  height: `${CONTAINER_HEIGHT}px`,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}))

const Item = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'center',
  height: `${ITEM_HEIGHT}px`,
})

interface Props<T> {
  selectedIndex: number
  items: T[]
  onUpdate: (snappedIndex: number) => unknown
}

export function ScrollSnap<T>({ selectedIndex, items, onUpdate }: Props<T>) {
  const scrollRef = useRef<HTMLElement>()

  const snappedIndex = useScrollSnap(
    {
      scrollRef,
      itemHeight: ITEM_HEIGHT,
      initialSnappedIndex: selectedIndex,
    },
    [items]
  )

  useEffect(() => {
    if (snappedIndex !== selectedIndex) onUpdate(snappedIndex)
  }, [snappedIndex])

  return (
    <ScrollSnapContainer ref={scrollRef}>
      <Item color={snappedIndex === -1 ? 'black' : 'lightGray'} />

      {items.map((text, index) => (
        <Item
          color={snappedIndex === index ? 'black' : 'lightGray'}
          key={String(text)}
          onClick={() => {
            if (!scrollRef.current) return
            scrollRef.current.scrollTo({
              top: index * ITEM_HEIGHT,
              behavior: 'smooth',
            })
          }}
        >
          {text as string}
        </Item>
      ))}

      <Item color={snappedIndex === -1 ? 'black' : 'lightGray'} />
    </ScrollSnapContainer>
  )
}
