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

function Item(props: BoxProps) {
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

function formatCardData(features){
  const newInfoArray = []
    if(features){
      features.map(currFeature=>{
        newInfoArray.push({
          fireName: currFeature.get('IncidentName'),
          size: currFeature.get('DailyAcres'),
          startDate: new Date(currFeature.get('FireDiscoveryDateTime')).toLocaleString('en-US'),
          cause: currFeature.get('FireCause'),
          basin: currFeature.get('PrimaryFuelModel'),
          location: {lat: 42.135, lon: -112.354}
        })
      })
      console.log('new info array before sort', newInfoArray[0])
      newInfoArray.sort(compareValues('startDate', 'desc'))
    }
  return newInfoArray  
}
export default function InfoColumn() {
  const context = useContext(MapContext)
  // const [displayCards, setDisplayCards] = useState(makeCards(formatCardData(context.extentFeatures)))
  const [formattedData, setFormattedData] = useState([])
  useEffect(()=>{
    // setDisplayCards(makeCards(formatCardData(context.extentFeatures)))
    setFormattedData(formatCardData(context.extentFeatures))
  },[context.extentFeatures])
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
          // width: 128,
          height: 128,
          maxHeight:128
        },
      }}
    >
      <Paper elevation={3} sx={{display: 'flex', flexWrap: 'wrap',}}>
        <Typography variant="h5" sx={{mt: 2, ml:1}} component="div">
          Wildfires In View
        </Typography>
        <div style={{ width: '100%' }}>
          <Box
            sx={{alignItems: 'center', display: 'flex', pl: 1, bgcolor: 'background.paper', borderRadius: 1 }}
          >
            <Item sx={{ flexGrow: 1.5 }}>
              <Typography variant="subtitle1" sx={{mt: 0, ml:1}} gutterBottom component="div">
                {context.extentFeatures ? context.extentFeatures.length : 0} results
              </Typography>
            </Item>
            
            <Item sx={{ flexGrow: 0.5}}>
              <SortSelect />
            </Item>
          </Box>
        </div>
        <div style={{ width: '100%' }}>
          {/* {makeCards(context.extentFeatures && context.extentFeatures.length > 0 ? formatCardData(context.extentFeatures) : [])} */}
          {/* {makeCards(fireInfoDataTest)} */}
          {/* {makeCards(formatCardData(context.extentFeatures))} */}
          {formattedData.map(currData=>{
            return MediaControlCard({...currData})
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








function MediaControlCard(props) {
  const {fireName, size, startDate, cause, basin, location} = props
  // const theme = useTheme();

  function Item(props: BoxProps) {
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
          <Typography variant="body1" component="div"  >
            <b>{info}</b>
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
              <ZoomInIcon sx={{pl:1, pt:0}}/>
            </Typography>
            <Typography variant="body1"  component="div" gutterBottom>
              {size} Acres
            </Typography>
          </Item>

        </Box>
        <Box
          sx={{ display: 'flex', pb: 0.5 }}
        >
          <MakeInfoItem title="Start Date" info={startDate} />
          <MakeInfoItem title="Cause" info={cause} />
          <MakeInfoItem title="Basin" info={basin} />
          <MakeInfoItem title="Location" info={`${location.lat}, ${location.lon}`} />
        </Box>
      </Card>
    
    </div>
  );
}

function SortSelect() {
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <InputLabel id="demo-select-small">Sort</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={age}
        label="Sort"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Size (low to high)</MenuItem>
        <MenuItem value={20}>Size (high to low)</MenuItem>
        <MenuItem value={30}>Date (newest to oldest)</MenuItem>
        <MenuItem value={40}>Date (oldest to newest)</MenuItem>
      </Select>
    </FormControl>
  );
}


