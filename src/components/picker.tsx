import { Divider, Stack, styled } from '@mui/material'
import { ScrollSnap } from './scroll-snap'

const ITEM_HEIGHT = 48
const CONTAINER_HEIGHT = ITEM_HEIGHT * 3

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.semiLightGray,
  borderWidth: '1px',
}))

const PickerContainer = styled(Stack)(() => ({
  width: '100%',
  height: CONTAINER_HEIGHT,

  textAlign: 'center',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  overflow: 'hidden',

  position: 'relative',

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
  selectedItem: T
  items: T[]
  onUpdate: (snappedIndex: number) => unknown
}

interface Props<T> {
  values: Value<T>[]
}

export function Picker<T>({ values }: Props<T>) {
  return (
    <PickerContainer>
      <StyledDivider absolute sx={{ bottom: ITEM_HEIGHT }} />
      <StyledDivider absolute sx={{ bottom: 2 * ITEM_HEIGHT }} />

      {values.map(({ selectedItem, items, onUpdate }, index) => (
        <ScrollSnap
          /* NOTE: the order of the values would not change. */
          /* eslint-disable react/no-array-index-key */
          key={index}
          items={items}
          selectedItem={selectedItem}
          onUpdate={onUpdate}
        />
      ))}
    </PickerContainer>
  )
}
