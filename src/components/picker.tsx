import { Box, Divider, Stack, styled } from '@mui/material'
import { ScrollSnap } from './scroll-snap'

const ITEM_HEIGHT = 48
const CONTAINER_HEIGHT = ITEM_HEIGHT * 3

const StyledDivider = styled(Divider)(({ theme }) => ({
  // @ts-ignore
  borderColor: theme.palette.semiLightGray,
  borderWidth: '1px',
}))

const HeaderContainer = styled(Box)({
  width: '100%',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
})

const StyledItem = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  maxWidth: '100px',
  width: '100px',
  color: 'rgb(40, 40, 40)',
})

const PickerContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: CONTAINER_HEIGHT,

  textAlign: 'center',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  overflow: 'hidden',
  position: 'relative',
  // @ts-ignore
  borderTop: `1px solid ${theme.palette.semiLightGray}`,

  // TODO: Below styles prevents scrolling
  // '&:before': {
  //   content: '""',
  //   position: 'absolute',
  //   top: '0',
  //   left: '0',
  //   width: '100%',
  //   height: '100%',
  //   boxShadow: 'inset 0px 0px 20px 20px #fff',
  // },
}))

interface Value<T> {
  selectedIndex: number
  items: T[]
  onUpdate: (snappedIndex: number) => unknown
}

interface Props<T> {
  values: Value<T>[]
  items?: string[]
}

export function Picker<T>({ values, items }: Props<T>) {
  return (
    <>
      {items && (
        <>
          <HeaderContainer>
            {items.map((item, index) => {
              return <StyledItem key={index}>{item}</StyledItem>
            })}
          </HeaderContainer>

          <StyledDivider />
        </>
      )}

      <PickerContainer>
        <StyledDivider absolute sx={{ bottom: ITEM_HEIGHT }} />
        <StyledDivider absolute sx={{ bottom: 2 * ITEM_HEIGHT }} />

        {values.map(({ selectedIndex, items, onUpdate }, index) => (
          <ScrollSnap
            /* NOTE: the order of the values would not change. */
            /* eslint-disable react/no-array-index-key */
            key={index}
            items={items}
            selectedIndex={selectedIndex}
            onUpdate={onUpdate}
          />
        ))}
      </PickerContainer>
    </>
  )
}
