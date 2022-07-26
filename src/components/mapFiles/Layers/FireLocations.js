import MapVectorLayer from './VectorLayer'
import GeoJSON from "ol/format/GeoJSON";
import { returnBasins } from '../../../data/getRfcBasins';
import FeatureStyles from '../Features/Styles'
import {vector} from '../Source'
import { getMapData } from '../../../utils/requestFullLayerFeatures';
import React, { useState, useEffect } from "react";
import { config } from '../../../config';

const dataYear = 2021
const minAcres = 200
// const locationLayer = await makeDataLayer('fireLocations', date1, date2, minAcres)




export default function FireLocationLayer({year}) {
  const date1= {month: 1, day: 1, year}
  const date2 = year === new Date().getFullYear() ? {month: new Date().getMonth()+1, day: new Date().getDate(), year} : {month: 12, day: 31, year}
  // console.log('fire year', year)
  const [layerData, setLayerData] = useState();

  useEffect(()=>{
    // console.log('layer data changed', layerData)
  },[layerData])

  useEffect(()=>{
    async function getDat(){
      try{
        const serviceName = config['fireLocations'].serviceName ? config['fireLocations'].serviceName : config['default'].serviceName
        console.log('requistnging location data', year)
        const mapDat = await getMapData(serviceName, date1, date2, minAcres)
        setLayerData(mapDat)
        // console.log('mapDat', mapDat)
      }
      catch(e){
        console.log('problem with getting data', e)
      }
    }
    getDat()

  },[])
  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };
  if(layerData){

    return (
      <MapVectorLayer
        source={
          vector({
            features: new GeoJSON().readFeatures(layerData, {
              dataProjection : 'EPSG:4326', 
              featureProjection: 'EPSG:3857'
            }),
          })}
        style={config['fireLocations'].styleFunction}
        layerName = 'fireLocations'
    />
    );
  }
  else{
    return(<></>)
  }

}


// async function makeDataLayer (layerName,date1, date2, minAcres){
//   const serviceName = config[layerName].serviceName ? config[layerName].serviceName : config['default'].serviceName
//   const mapData = await  getMapData(serviceName,date1, date2, minAcres)
//   const styleFunction = config[layerName].styleFunction ? config[layerName].styleFunction : config['default'].styleFunction
//   const styleInfo = config[layerName].styleInfo ? config[layerName].styleInfo : null
//   const newLayer = makeGeojsonLayer(mapData,layerName, styleFunction, styleInfo)
//   return newLayer
// }
// function makeGeojsonLayer(geoJsonData, layerName = 'defaultName', styleFunction, styleInfo){
//   // const {color, width} = styleInfo
//   // const layerStyle = new Style ({
//   //     stroke: new Stroke({
//   //       color: color ? color : 'red',
//   //       width: width ? width : 1
//   //     }),
//   //   })
//   var layerSource = new VectorSource({
//     features: (new GeoJSON()).readFeatures(geoJsonData, {
//       dataProjection : 'EPSG:4326', 
//       featureProjection: 'EPSG:3857'
//     })  
//   });
  
//   var dataLayer = new VectorLayer({
//       source: layerSource,
//       className: layerName,
//       style: styleFunction,
//       id: layerName
//     });
//     // console.log('data layer', layerName, layerSource)
//     return dataLayer
// }
// // {showLayer2 && (
// //   <VectorLayer
// //     source={vector({
// //       features: new GeoJSON().readFeatures(geojsonObject2, {
// //         featureProjection: get("EPSG:3857"),
// //       }),
// //     })}
// //     style={FeatureStyles.MultiPolygon}
// //   />
// // )}