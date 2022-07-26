import React, { useState, Suspense, useContext, useEffect, useCallback, useMemo } from "react";
import { Layers, TileLayer, MapVectorLayer } from "./mapFiles/Layers";
import { osm, vector, stamen } from "./mapFiles/Source";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
// import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
// import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./mapFiles/Features/Styles";
import AppMap from "./AppMap";
// import {mapConfig} from '../config.json'
import { config, mapConfig } from '../config';
import Stamen from 'ol/source/Stamen';
import {returnBoundaries} from '../data/getRfcBoundary'
import {returnBasins} from '../data/getRfcBasins'
import {MapContext} from '../contexts/MapContext'
import { getMapData } from "../utils/requestFullLayerFeatures";

// import FireLocationLayer from "./mapFiles/Layers/FireLocations";
// import BasinLayer from "./mapFiles/Layers/BasinLayer";

const BasinLayer = React.lazy(() => import('./mapFiles/Layers/BasinLayer'));
const FireLocationLayer = React.lazy(() => import('./mapFiles/Layers/FireLocations'));
const FirePerimeterLayer = React.lazy(() => import('./mapFiles/Layers/FirePerimeters'));
const MemoizedPerimeterLayer = React.lazy(() => import('./mapFiles/Layers/FirePerimeters'));



// import "./App.css";

// const geojsonObject = mapConfig.geojsonObject;
// const geojsonObject2 = mapConfig.geojsonObject2;
// const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];

// function addMarkers(lonLatArray) {
//   var iconStyle = new Style({
//     image: new Icon({
//       anchorXUnits: "fraction",
//       anchorYUnits: "pixels",
//       src: mapConfig.markerImage32,
//     }),
//   });
//   let features = lonLatArray.map((item) => {
//     let feature = new Feature({
//       geometry: new Point(fromLonLat(item)),
//     });
//     feature.setStyle(iconStyle);
//     return feature;
//   });
//   return features;
// }
const layerStateInitObj = {
  2020:{
    locations: false,

  }
}

async function getDat(year, setter){
  try{
    const date1= {month: 1, day: 1, year}
    const date2 = year === new Date().getFullYear() ? {month: new Date().getMonth()+1, day: new Date().getDate(), year} : {month: 12, day: 31, year}
    const minAcres = 200
    
    const serviceName = config['firePerimeters'].serviceName ? config['firePerimeters'].serviceName : config['default'].serviceName
    console.log('requesting peimeter data from mapwrapper', date1, date2)
    const mapDat = await getMapData(serviceName, date1, date2, minAcres)
    setter(mapDat)
    // console.log('mapDat', mapDat)
  }
  catch(e){
    console.log('problem with getting data', e)
  }
}
const MapWrapper = () => {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(mapConfig.zoom);
  const context = useContext(MapContext)
  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(true);
  const [show2022Locations, setShow2022Locations] = useState(false);
  const [show2021Locations, setShow2021Locations] = useState(false);
  const [show2020Locations, setShow2020Locations] = useState(false);

  const [show2022Perimeters, setShow2022Perimeters] = useState(true);
  const [show2021Perimeters, setShow2021Perimeters] = useState(false);
  const [show2020Perimeters, setShow2020Perimeters] = useState(false);

  const [perimeterData2020, setPerimeterData2020] = useState()
  const [perimeterData2021, setPerimeterData2021] = useState()
  const [perimeterData2022, setPerimeterData2022] = useState()

  // const [features, setFeatures] = useState(addMarkers(markersLonLat));
  const getDatCallback = useCallback((year, setter)=>{
    getDat(year,setter)
  },[])

  useEffect(()=>{
    console.log('2020 perimeter data', perimeterData2020)
    if(perimeterData2020 && context.dataCheckboxState[2020].perimeterDataChecked){
      setShow2020Perimeters(true)
    }
    else{
      setShow2020Perimeters(false)
    }
  },[perimeterData2020, context.dataCheckboxState])

  useEffect(()=>{
    console.log('2021 perimeter data', perimeterData2021)
    if(perimeterData2021 && context.dataCheckboxState[2021].perimeterDataChecked){
      setShow2021Perimeters(true)
    }
    else{
      setShow2021Perimeters(false)
    }
  },[perimeterData2021, context.dataCheckboxState])

  useEffect(()=>{
    console.log('2022 perimeter data', perimeterData2022)
    if(perimeterData2022 && context.dataCheckboxState[2022].perimeterDataChecked){
      setShow2022Perimeters(true)
    }
    else{
      setShow2022Perimeters(false)
    }
  },[perimeterData2022, context.dataCheckboxState])

  useEffect(()=>{
    if(context && context.dataCheckboxState){
      const allYearState = context.dataCheckboxState
      if(allYearState[2020]?.perimeterDataChecked){
        // console.log('setting 2020 true')
        if(!perimeterData2020){
          // getDat(2020, setPerimeterData2020)
            getDatCallback(2020, setPerimeterData2020)
        }
      }
      if(allYearState[2021]?.perimeterDataChecked){
        // console.log('setting 2021 true')
        if(!perimeterData2021){
          getDatCallback(2021, setPerimeterData2021)
        }
      }
      if(allYearState[2022]?.perimeterDataChecked){
        // console.log('setting 2022 true')
        if(!perimeterData2022){
          getDatCallback(2022, setPerimeterData2022)
        }
      }
      
    }
  },[context.dataCheckboxState])

  return (
    <div>
      <AppMap center={center} zoom={zoom}>
        <Layers>
          <TileLayer source={stamen('terrain')} zIndex={0} />
          {showLayer1 && (
            <MapVectorLayer
              source={
                vector({
                  features: new GeoJSON().readFeatures(returnBoundaries(), {
                    dataProjection : 'EPSG:4326', 
                    featureProjection: 'EPSG:3857'
                  }),
                })}
              style={FeatureStyles.rfcBoundary}
            />
          )}
          {showLayer2 && (
            <BasinLayer />
          )}
          {context.dataCheckboxState[2020].locationDataChecked && <FireLocationLayer year = {2020} />}
          {context.dataCheckboxState[2021].locationDataChecked && <FireLocationLayer year = {2021} />}
          {context.dataCheckboxState[2022].locationDataChecked && <FireLocationLayer year = {2022} />}

          {show2020Perimeters && <FirePerimeterLayer year = {2020} perimeterData = {perimeterData2020}/>}
          {show2021Perimeters && <FirePerimeterLayer year = {2021} perimeterData = {perimeterData2021}/>}
          {show2022Perimeters && <MemoizedPerimeterLayer year = {2022} perimeterData = {perimeterData2022}/>}


        </Layers>
        {/* <Controls>
          <FullScreenControl />
        </Controls> */}
      </AppMap>
      <div>
        <input
          type="checkbox"
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{" "}
        Johnson County
      </div>
      <div>
        <input
          type="checkbox"
          checked={showLayer2}
          onChange={(event) => setShowLayer2(event.target.checked)}
        />{" "}
        Wyandotte County
      </div>
      <hr />
      <div>
        <input
          type="checkbox"
          checked={showMarker}
          onChange={(event) => setShowMarker(event.target.checked)}
        />{" "}
        Show markers
      </div>
    </div>
  );
};

export default MapWrapper;
