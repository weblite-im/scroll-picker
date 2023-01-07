import { Box, SxProps } from '@mui/material'

const SX = {
  width: 375,
  height: '100%',
  margin: 'auto',
  overflow: 'hidden auto',
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const boxDecorator = (sx?: SxProps) => Story => (
  <Box sx={{ ...SX, ...sx }}>{Story()}</Box>
)
