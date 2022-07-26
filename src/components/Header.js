import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function Header() {
  return (
    <Box
      sx={{
        textAlign:'center',
        // mt:4,
        // display: 'flex',
        // '& > :not(style)': {
        //   m: 1,
        // },
      }}
    >
      <Paper variant="outlined" square>
        <Typography 
          variant="h4"   
          component="div"
          sx={{
            pt:1,
            pb:1,
            color:'#197278'
          }}
        >
          CBRFC Fire Map
        </Typography>
      </Paper>
    </Box>
  );
}