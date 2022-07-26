import React, { useState, useContext, Suspense  } from "react"

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MapContext from '../contexts/MapContext'
const DataLayerSelectList = React.lazy(() => import('./DataLayerSelectList'));


const commonStyles = {
  bgcolor: 'background.paper',
  border: 1,
  borderColor: '#e0e0e0',
  p:1
};


export default function FilterBar() {
  const context = useContext(MapContext)

  const handleChange = (event,newDataYear) => {
    context.setDataYear(newDataYear);
  }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
  
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
      <Paper variant="outlined" square  sx={{ ...commonStyles, borderTop: 0 }}>
        <Stack direction="row" spacing={2}>
          <Button  aria-describedby={id} size="small" color="secondary" variant="outlined" onClick={handleClick}>Data Layers</Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
            <Suspense fallback={<div>Loading...</div>}>
              <DataLayerSelectList />
            </Suspense>
        </Popover>
          <Button  size="small"  color="secondary" variant="outlined" disabled>
            Map Layers
          </Button>
          
          {/* <ToggleButtonGroup
            color="primary"
            value={context.dataYear}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton size="small" value="2020">2020</ToggleButton>
            <ToggleButton size="small" value="2021">2021</ToggleButton>
            <ToggleButton size="small" value="2022">2022</ToggleButton>
            <ToggleButton size="small" value="all">2020-2022</ToggleButton>
          </ToggleButtonGroup> */}
        </Stack>
      </Paper>
    </Box>
  );
}