import React, { useState, useEffect, useReducer } from "react"
import MapContext from "../contexts/MapContext";
import { config } from "../config";
// const date1Init = {month: 1, day: 1, year: 2020}
// const date2Init = {month: new Date().getMonth()+1, day: new Date().getDate(), year: new Date().getFullYear()}
// const minAcresInit = 1000
// console.log('config', config)
const initDataState = {
  2020:{
    locations: false,
    perimeters: false,
    severity: false,
  },
  2021:{
    locations: false,
    perimeters:false
  },
  2002: {
    locations: true,
    perimeters: true
  }
}

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
      stateObject[currYear] = {...stateObject[currYear], severityDataChecked: false}
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


const MapProvider = ({ children }) => {
  const [dataDates, setDataDates] = useState({date1: config.date1Init, date2: config.date2Init})
  const [minAcres, setMinAcres] = useState(config.minAcresInit)
  const [dataYear, setDataYear] = useState('2022')
  const [extentFeatures, setExtentFeatures] = useState([])
  const [map, setMap] = useState(null)
  const [dataCheckboxState, dispatchCheckboxChange] = useReducer(checkmarkReducer, initStateAllYears)


  useEffect(()=>{
    const {date1, date2} = dataDates
    let secondDateYear = dataYear === 'all' ? new Date().getFullYear() : parseInt(dataYear)
    const newDate1 = {...date1, year: dataYear === 'all' ? 2020 : secondDateYear}
    let newDate2
    if(secondDateYear< new Date().getFullYear()){
      newDate2 = {month: 12, day:31, year: parseInt(dataYear)}
    }
    else if(secondDateYear === new Date().getFullYear()){
      newDate2 = {...config.date2Init}
    }
    else{
      console.log('you missedsomething', secondDateYear)
    }
    setDataDates({date1: newDate1, date2:newDate2})
  },[dataYear])
  
  return (
    <MapContext.Provider value={{ extentFeatures, setExtentFeatures, dataYear, setDataYear, dataDates, setDataDates, minAcres, setMinAcres, map, setMap, dataCheckboxState, dispatchCheckboxChange }}>
        {children}
    </MapContext.Provider>
  )
}
export default MapProvider;