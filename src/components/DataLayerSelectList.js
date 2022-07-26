import React, {useState, useReducer, useEffect, useContext} from 'react';
 import FormControlLabel from '@mui/material/FormControlLabel';
 import Checkbox from '@mui/material/Checkbox';
 import Box from '@mui/material/Box';
 import { config } from '../config';
 import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import {MapContext} from '../contexts/MapContext'

function makeDataYearArray(dataStartYear){
  const yearArray = []
  let dataYear = dataStartYear
  let currYear = new Date().getFullYear()
  while (dataYear <= currYear){
    yearArray.push(dataYear)
    dataYear ++
  }
  return yearArray
}

//  const initState = {
//   yearDataChecked: true,
//   locationDataChecked: true,
//   perimeterDataChecked: true
//  }


const initStateAllYears = (function() {
  const dataStartYear = config.dataStartYear ? config.dataStartYear : 2020
  const dataYearArray = makeDataYearArray(dataStartYear)
  const stateObject = Object.create({})
  const currentYear = new Date().getFullYear()
  dataYearArray.map(currYear =>{
    stateObject[currYear] = {
      yearDataChecked: currYear === currentYear,
      locationDataChecked: currYear === currentYear,
      perimeterDataChecked: currYear === currentYear
    }
    if(currYear === 2020){
      stateObject[currYear] = {...stateObject[currYear], severityDataChecked: true}
    }
  })
  return stateObject
})()

  
function checkmarkReducer(state, action={}) {
  // console.log('state', state, 'actoion', action)
  const {type, payload, dataYear} = action
  switch (type) {
    case 'parent':
      const currYearState = {
        yearDataChecked: payload,
        locationDataChecked: payload,
        perimeterDataChecked: payload,
        severityDataChecked: payload
       }
       return {...state, [dataYear]: {...currYearState}}
    case 'location':
      // console.log('state', state, 'payload', payload, 'type', type)
      // console.log(payload === state.perimeterDataChecked, 'if this is true then need to change parent')
      const yearDataStatusLocation = payload === state[dataYear].perimeterDataChecked ? payload : state[dataYear].yearDataChecked
      const currYearLocationState = {...state[dataYear], locationDataChecked: payload, yearDataChecked: yearDataStatusLocation}
      return {...state, [dataYear]: {...currYearLocationState}}
      case 'perimeter':
        const yearDataStatusPerimeter = payload === state[dataYear].locationDataChecked ? payload : state[dataYear].yearDataChecked
        const currYearPerimeterState = {...state[dataYear], perimeterDataChecked: payload, yearDataChecked: yearDataStatusPerimeter}
      return {...state, [dataYear]: {...currYearPerimeterState}}
      case 'severity':
        const yearDataStatusSeverity = payload === state[dataYear].severityDataChecked ? payload : state[dataYear].yearDataChecked
        const currYearSeverityState = {...state[dataYear], severityDataChecked: payload, yearDataChecked: yearDataStatusSeverity}
      return {...state, [dataYear]: {...currYearSeverityState}}
    default:
      throw new Error();
  }
}

// function collapserReducer(state, action={}){
//   const {type, payload, dataYear} = action
//   switch (type) {
//     case 'parent':
// }

 export default function DataLayerSelectList() {
   const dataStartYear = config.dataStartYear ? config.dataStartYear : 2020
   const dataYearArray = makeDataYearArray(dataStartYear)
   const context = useContext(MapContext)

    const [allOpen, setAllOpen] = useState(
      (function(){
        const returnObj = Object.create({})
        dataYearArray.map(currYear=>returnObj[currYear]=false)
        return returnObj
      })()
    );
  // const [yearDataChecked, setYearDataChecked] = useState(true)
  // const [locationDataChecked, setLocationDataChecked] = useState(true)
  // const [perimeterDataChecked, setPerimeterDataChecked] = useState(true)
  // const [dataCheckboxState, dispatchCheckboxChange] = useReducer(checkmarkReducer, initStateAllYears)
  // const [yearCollapseState, dispatchYearCollapseState] = useReducer(collapserReducer, [0,0,0])


  const handleClick = (dataYear) => {
    // console.log('handleing accorion click', dataYear)
    const newVal = !allOpen[dataYear]
    setAllOpen({...allOpen, [dataYear]: newVal})
    // setOpen(!open);
  };

  // useEffect(()=>{
  //   console.log('checkbox state',context.dataCheckboxState)
  //   console.log('all open', allOpen)
  // },[context.dataCheckboxState])

  // useEffect(()=>{
  //   console.log('all open', allOpen)
  // },[allOpen])

  function determineDeterminant(vals){
    var count = 0
    var trueCount = 0
    for(var key in vals){
      if(key !== 'yearDataChecked' ){
        count = count + 1
        if(vals[key]){
          trueCount = trueCount + 1
        }
      }
    }
    return count === trueCount || trueCount === 0 
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      dense
    >
    <>
      {dataYearArray.map(currDataYear =>{
        const {locationDataChecked, perimeterDataChecked, severityDataChecked} = context.dataCheckboxState[currDataYear]
        const valsMatch = determineDeterminant(context.dataCheckboxState[currDataYear])
        const isIndeterminate = currDataYear === 2020 
          ? !(context.dataCheckboxState[currDataYear].locationDataChecked !== context.dataCheckboxState[currDataYear].perimeterDataChecked !== context.dataCheckboxState[currDataYear].severityDataChecked)
          : context.dataCheckboxState[currDataYear].locationDataChecked !== context.dataCheckboxState[currDataYear].perimeterDataChecked
        return(
          <div key={currDataYear}>
            <ListItem dense>
              <FormControlLabel
                label={`${currDataYear} Fire Data`}
                sx={{pl:0.5, pt:0, pb:0}}
                control={
                  <Checkbox
                    sx={{pl:0, pt:0, pb:0}}
                    checked={context.dataCheckboxState[currDataYear].yearDataChecked}
                    indeterminate={!valsMatch}
                    onChange={() => context.dispatchCheckboxChange({type: 'parent', payload: !context.dataCheckboxState[currDataYear].yearDataChecked, dataYear:currDataYear})}
                  />
                }
              />
              <ListItemButton onClick={()=>handleClick(currDataYear)}>
                {allOpen[currDataYear] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            
            <Collapse in={allOpen[currDataYear]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem dense>
                  <FormControlLabel
                    label="Locations"
                    sx={{pl:4, pt:0, pb:0}}
                    control={
                      <Checkbox
                        sx={{pl:0, pt:0, pb:0}}
                        checked={context.dataCheckboxState[currDataYear].locationDataChecked}
                        onChange={() => context.dispatchCheckboxChange({type: 'location', payload: !context.dataCheckboxState[currDataYear].locationDataChecked, dataYear:currDataYear})}

                      // indeterminate={checked[0] !== checked[1]}
                        // onChange={handleChange1}
                      />
                    }
                  />
                </ListItem>
                <ListItem dense>
                  <FormControlLabel
                    label="Perimeters"
                    sx={{pl:4, pt:0, pb:0}}
                    control={
                      <Checkbox
                        sx={{pl:0, pt:0, pb:0}}
                        checked={context.dataCheckboxState[currDataYear].perimeterDataChecked}
                        onChange={() => context.dispatchCheckboxChange({type: 'perimeter', payload: !context.dataCheckboxState[currDataYear].perimeterDataChecked, dataYear:currDataYear})}

                        // indeterminate={checked[0] !== checked[1]}
                        // onChange={handleChange1}
                      />
                    }
                    />
                </ListItem>
                {currDataYear === 2020 && <ListItem dense>
                  <FormControlLabel
                    label="Severity"
                    sx={{pl:4, pt:0, pb:0}}
                    control={
                      <Checkbox
                        sx={{pl:0, pt:0, pb:0}}
                        checked={context.dataCheckboxState[currDataYear].severityDataChecked}
                        onChange={() => context.dispatchCheckboxChange({type: 'severity', payload: !context.dataCheckboxState[currDataYear].severityDataChecked, dataYear:currDataYear})}

                        // indeterminate={checked[0] !== checked[1]}
                        // onChange={handleChange1}
                      />
                    }
                    />
                </ListItem> }
              </List>
            </Collapse>

          </div>
        )
      })}
    </>
      
      
    </List>
  );
}
//  function DataLayerSelectListOld() {
//   const [checked, setChecked] = React.useState([true, false]);

//   const handleChange1 = (event) => {
//     setChecked([event.target.checked, event.target.checked]);
//   };

//   const handleChange2 = (event) => {
//     setChecked([event.target.checked, checked[1]]);
//   };

//   const handleChange3 = (event) => {
//     setChecked([checked[0], event.target.checked]);
//   };

//   const children = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
//       <FormControlLabel
//         label="Child 1"
//         control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
//       />
//       <FormControlLabel
//         label="Child 2"
//         control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
//       />
//     </Box>
//   );

//   return (
//     <div>
//       <FormControlLabel
//         label="Parent"
//         sx={{pl:2}}
//         control={
//           <Checkbox
//             checked={checked[0] && checked[1]}
//             indeterminate={checked[0] !== checked[1]}
//             onChange={handleChange1}
//           />
//         }
//       />
//       {children}
//     </div>
//   );
// }

// const DataLayerSelectList = () => {
//   // const neonStyles = useNeonCheckboxStyles();
//   const [checked, setChecked] = React.useState([2022]);
//   const dataStartYear = config.dataStartYear ? config.dataStartYear : 2020
//   const dataYearArray = makeDataYearArray(dataStartYear)
    
//   const handleToggle = (value) => () => {
//     const currentIndex = checked.indexOf(value);
//     const newChecked = [...checked];

//     if (currentIndex === -1) {
//       newChecked.push(value);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }

//     setChecked(newChecked);
//   };
//   return (
//     <div>
//       {dataYearArray.map((currDataYear,i) =>{
//         const labelId = `checkbox-list-label-${currDataYear}`;
//         return (
//           <div key = {currDataYear}>
//             <FormControlLabel
//               key = {currDataYear}
//               control={
//                 <Checkbox
//                   // edge="start"
//                   checked={checked.indexOf(currDataYear) !== -1}
//                   tabIndex={-1}
//                   disableRipple
//                   inputProps={{ 'aria-labelledby': labelId }}
//                   sx={{pl:2}}
//                 />
//               }
//               label={`${currDataYear} Fire Info`}
//             />
//             <br />
//           </div>
//         )
//       })}

//     </div>
//   );
// };

// export default DataLayerSelectList;

// import * as React from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
// import CommentIcon from '@mui/icons-material/Comment';

// export default function DataLayerSelectList() {
  // const [checked, setChecked] = React.useState([0]);

  // const handleToggle = (value) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(1);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  // return (
  //   <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  //     {[0, 1, 2, 3].map((value) => {
  //       const labelId = `checkbox-list-label-${value}`;

  //       return (
  //         <ListItem
  //           key={value}
  //           sx={{p:0}}
  //           // secondaryAction={
  //           //   <IconButton edge="end" aria-label="comments">
  //           //     <CommentIcon />
  //           //   </IconButton>
  //           // }
  //           disablePadding
  //           dense
  //         >
  //           <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
  //             <ListItemIcon>
  //               <Checkbox
  //                 // edge="start"
  //                 checked={checked.indexOf(value) !== -1}
  //                 tabIndex={-1}
  //                 disableRipple
  //                 inputProps={{ 'aria-labelledby': labelId }}
  //               />
  //             </ListItemIcon>
  //             <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
  //           </ListItemButton>
  //         </ListItem>
  //       );
  //     })}
  //   </List>
  // );
// }
