import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import { MapContext } from '../contexts/MapContext'
import compareValues from '../utils/compareValues'
import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {toLonLat} from 'ol/proj';


import { useTheme } from '@mui/material/styles';

const fireInfoDataTest = [
  {
    fireName: 'Jacob City Fire',
    size: 6000,
    startDate: '5/12/2022',
    cause: 'Human',
    basin: 'Green',
    location: {lat: 42.135, lon: -112.354}
  },
  {
    fireName: 'Jacob City Fire 1',
    size: 400,
    startDate: '5/14/2022',
    cause: 'Human',
    basin: 'Green',
    location: {lat: 42.135, lon: -112.354}
  },
  {
    fireName: 'Jacob City Fire 2',
    size: 500,
    startDate: '5/16/2022',
    cause: 'Human',
    basin: 'Green',
    location: {lat: 42.135, lon: -112.354}
  }
]

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

function formatCardData(features, sortByAr){
  const sortBy = sortByAr[0]
  const sortOrder = sortByAr[1]
  // console.log('sortby', sortBy, sortOrder)
  const newInfoArray = []
  // setter(true)
    if(features){
      features.map(currFeature=>{
        // console.log('currFeate', currFeature)
        // console.log('coordintaes', toLonLat(currFeature.getGeometry().getCoordinates()))
        newInfoArray.push({
          fireName: currFeature.get('IncidentName'),
          size: currFeature.get('DailyAcres'),
          startDate: currFeature.get('FireDiscoveryDateTime'),
          // startDate: new Date(currFeature.get('FireDiscoveryDateTime')).toLocaleString('en-US'),
          cause: currFeature.get('FireCause'),
          basin: currFeature.get('ch5_id'),
          zoomCoordinates: currFeature.getGeometry().getCoordinates()
          // location: {lat: 42.135, lon: -112.354}
          // location: {lat: 42.135, lon: -112.354}
        })
      })
      // console.log('new info array before sort', newInfoArray[0])
      newInfoArray.sort(compareValues(sortBy, sortOrder))
      // newInfoArray.sort(compareValues('startDate', 'desc'))
      // console.log('new info array after sort', newInfoArray[0])
      return newInfoArray  
    }
    else{
      return []
    }
    // setter(false)
}

// export default function InfoColumnList() {
//   const context = useContext(MapContext)
//   // const [displayCards, setDisplayCards] = useState(makeCards(formatCardData(context.extentFeatures)))
//   const [formattedData, setFormattedData] = useState([])
//   useEffect(()=>{
//     // setDisplayCards(makeCards(formatCardData(context.extentFeatures)))
//     setFormattedData(formatCardData(context.extentFeatures))
//   },[context.extentFeatures])
//   return (
//     <Box
//       sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
//     >
//       <FixedSizeList
//         height={400}
//         width={360}
//         itemSize={46}
//         itemCount={200}
//         overscanCount={5}
//       >
//         {renderRow}
//       </FixedSizeList>
//     </Box>
//   );
// }
export default function InfoColumnList() {
  const context = useContext(MapContext)
  // const [displayCards, setDisplayCards] = useState(makeCards(formatCardData(context.extentFeatures)))
  const [formattedData, setFormattedData] = useState([])
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [age, setAge] = useState('');
  const [sortBy, setSortBy] = useState(['startDate', 'desc'])

  const handleChange = (event) => {
    console.log('event vel', event.target.value.split(','))
    setSortBy(event.target.value.split(','));
  };

  const handleZoom = (coordinates)=>{
    console.log('clicked event zoom incon', coordinates)
    // context.setMapZoom(coordinates)
  }

  useEffect(()=>{
    console.log('context changed', context)
  },[context])

  useEffect(()=>{
    // setDisplayCards(makeCards(formatCardData(context.extentFeatures)))
    // console.log('sortby changed', sortBy)
    // console.log('sort by here', sortBy, sortBy[0], sortBy[1])
    setFormattedData([])
    setFormattedData(formatCardData(context.extentFeatures, sortBy))
  },[context.extentFeatures, sortBy])
  // const [dynamicFireInfoData, setDynamicFireInfoData] = useState([])

  // useEffect(()=>{
  //   console.log('extent featuers', context.extentFeatures)
  //   const newInfoArray = []
  //   if(context.extentFeatures){
  //     context.extentFeatures.map(currFeature=>{
  //       // console.log(currFeature.get('IncidentName'))
  //       newInfoArray.push({
  //         fireName: currFeature.get('IncidentName'),
  //         size: currFeature.get('DailyAcres'),
  //         startDate: currFeature.get('FireDiscoveryDateTime'),
  //         cause: currFeature.get('FireCause'),
  //         basin: currFeature.get('PrimaryFuelModel'),
  //         location: {lat: 42.135, lon: -112.354}
  //       })
  //     })
  //     console.log('new info array before sort', newInfoArray[0])
  //     newInfoArray.sort(compareValues('startDate', 'desc'))
  //     console.log('new info array after sort', newInfoArray[0])
  //     // setDynamicFireInfoData(newInfoArray)
  //   }
  // },[context.extentFeatures])

  // useEffect(()=>{
  //   console.log('new data for cards', dynamicFireInfoData)
  // },[dynamicFireInfoData])
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          ml: 0.5,
          width: '100%',
          
          
        },
      }}
    >
      <Paper elevation={3} sx={{display: 'flex', flexWrap: 'wrap'}}>
        <Typography variant="h5" sx={{mt: 2, ml:1}} component="div">
          Wildfires In View
        </Typography>
        <div style={{ width: '100%', }}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdropOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
          <Box
            sx={{alignItems: 'center',display: 'flex', pl: 1, bgcolor: 'background.paper', borderRadius: 1 }}
          >
            <Item sx={{ flexGrow: 1.5 }}>
              <Typography variant="subtitle1" sx={{mt: 0, ml:1}} gutterBottom component="div">
                {context.extentFeatures ? context.extentFeatures.length : 0} results
              </Typography>
            </Item>
            
            <Item sx={{ flexGrow: 0.5}}>
              <SortSelect changeHandler = {handleChange} value = {age}/>
            </Item>
          </Box>
        </div>
        <div style={{ width: '95%',maxHeight:700, overflow: "hidden",
          overflowY: "scroll", }}>
          {/* {makeCards(context.extentFeatures && context.extentFeatures.length > 0 ? formatCardData(context.extentFeatures) : [])} */}
          {/* {makeCards(fireInfoDataTest)} */}
          {/* {makeCards(formatCardData(context.extentFeatures))} */}
          {formattedData.map(currData=>{
            return MediaControlCard({...currData}, handleZoom)
          })}

        </div>
        
      </Paper>
    </Box>
  );
}

// function makeCards(fireInfoData){
//   const allCards = fireInfoData.map(currInfo =>{
//     return MediaControlCard({...currInfo})
//   })
//   return allCards

// }








function MediaControlCard(props, handleZoom) {
  const {fireName, size, startDate, cause, basin, location, zoomCoordinates} = props
  // const theme = useTheme();
  // console.log('handlezoom', handleZoom, zoomCoordinates)

  function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          pl:1,
          pr: 1,
          pt:0,
          ...sx,
        }}
        {...other}
      />
    );
  }

  function MakeInfoItem(props){
    const {title, info} = props
    return (
      <Box sx={{ flexGrow: 2}}>
        
      <Item sx={{ pb: 1 }}>
        <Typography component="div" variant="overline" sx={{pb:0, flexGrow:1}}>
            {title}
          </Typography>
          <Typography variant="body2" component="div"  >
            {info}
          </Typography>
      </Item>
      </Box>
    ) 
  }


  return (
    <div style={{ width: '100%'}}>
      <Card variant="outlined">

        <Box
          sx={{ display: 'flex', p: 0 }}
        >
          <Item sx={{ flexGrow: 1, pt: 1}}>
            <Typography component="div" variant="h6" >
              {fireName}
              {/* <ZoomInIcon sx={{pl:1, pt:0}}/>
              <Button
              onClick={() => {
                handleZoom('hi', zoomCoordinates);
              }}
            >
              Click me
            </Button> */}
            </Typography>
            <Typography variant="body1"  component="div" gutterBottom>
              {size} Acres
            </Typography>
          </Item>

        </Box>
        <Box
          sx={{ display: 'flex', pb: 0.5 }}
        >
          <MakeInfoItem title="Start Date" info={new Date(startDate).toLocaleString('en-US',{year: 'numeric', month: 'long', day: 'numeric' })} />
          <MakeInfoItem title="Cause" info={cause} />
          <MakeInfoItem title="Basin" info={basin ? basin : 'Out of Area'} />
          {/* <MakeInfoItem title="Location" info={`${location.lat}, ${location.lon}`} /> */}
        </Box>
      </Card>
    
    </div>
  );
}
          // startDate: new Date(currFeature.get('FireDiscoveryDateTime')).toLocaleString('en-US'),

function SortSelect(props) {
  const handleChange = props.changeHandler
  const propVal = props.value
  // const [age, setAge] = useState('');

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <InputLabel id="demo-select-small">Sort</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={propVal}
        label="Sort"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={'size,asc'}>Size (low to high)</MenuItem>
        <MenuItem value={'size,desc'}>Size (high to low)</MenuItem>
        <MenuItem value={'startDate,desc'}>Date (newest to oldest)</MenuItem>
        <MenuItem value={'startDate,asc'}>Date (oldest to newest)</MenuItem>
      </Select>
    </FormControl>
  );
}


