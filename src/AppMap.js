// import React, { useState, useEffect, useRef, useContext } from 'react';

// import axios from 'axios'
// import { Map, View } from 'ol';
// import OSM from 'ol/source/OSM';
// import Overlay from 'ol/Overlay';
// import 'ol/ol.css';
// import './style/customStyle.css';
// import EsriJSON from 'ol/format/EsriJSON';
// import { request } from "@esri/arcgis-rest-request";
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
// import {Stroke, Style } from 'ol/style.js'
// import {Point} from 'ol/geom';
// import XYZ from 'ol/source/XYZ'
// import VectorSource from 'ol/source/Vector.js'
// import GeoJSON from 'ol/format/GeoJSON';
// // import {returnBoundaries} from './data/getRfcBoundary'
// import {returnBasins} from './data/getRfcBasins'
// import {returnBoundaries} from './data/getRfcBoundary'
// import {returnTestPerimeter} from './data/returnTestPerimeterData'
// import {toLonLat} from 'ol/proj';
// import {toStringHDMS} from 'ol/coordinate';
// import { writePointFeatureToBuffers } from 'ol/renderer/webgl/Layer';
// import MapContext from "../contexts/MapContext";


// var olMap = new Map({
//     layers: [
//         new TileLayer({
//             source: new OSM(),
//         }),
//         // basinLayer,
//         // boundaryLayer,
//         // testPerimeter
//     ],
//     view: new View({
//       center: [-12234816.495438, 4522626.089577], //coordinates in EPSG3857 (x, y). Get new ones here: https://epsg.io/map#srs=3857&x=-12578783.122722&y=4902242.944054&z=10&layer=streets
//       zoom: 6,
//       projection: 'EPSG:3857'
//     }),
// });



// function App() {
//   const [map, setMap] = useState();
//   const [perimeterData, setPerimeterData] = useState()
//   const mapContainer = useRef(null)
//   const containerRef = useRef(null)
//   const contentRef = useRef(null)
//   const closerRef = useRef(null)
//   // const mapElement = useRef();
//   // const mapRef = useRef();
//   // mapRef.current = map;

//   // closerRef.onclick = function () {
//   //   overlay.setPosition(undefined);
//   //   closerRef.blur();
//   //   return false;
//   // };


//   useEffect(()=>{
//     async function getBoundaries(){
//       // const serviceUrl ='https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/CY_WildlandFire_Perimeters_ToDate/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';
//       // const serviceUrl = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/CY_WildlandFire_Perimeters_ToDate/FeatureServer/0/query?where=1%3D1&objectIds=16218&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=standard&f=pgeojson&token=`
//       const serviceUrl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/CY_WildlandFire_Perimeters_ToDate/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=%7B%0D%0A++%22xmin%22%3A+-121.02539%2C%0D%0A++%22ymin%22%3A+29.916852%2C%0D%0A++%22xmax%22%3A+-101.118164%2C%0D%0A++%22ymax%22%3A+44.933696%2C%0D%0A++%22spatialReference%22%3A+%7B%0D%0A++++%22wkid%22%3A+4326%0D%0A++%7D%0D%0A%7D&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token='
//       // const layer = '0';

//       const esrijsonFormat = new EsriJSON();
//       // console.log('getting bounday ta===')
//       // const perimeterRequest = await axios.get('https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/CY_WildlandFire_Perimeters_ToDate/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
//       const perimeterRequest = await request(serviceUrl).then((response) => {
//         // console.log('respo/nse',response); // WebMap JSON
//         // const inFormat = new EsriJSON().readFeatures(response)
//         const perimeterLayer = makeGeojsonLayer(response)
//         // console.log('format', perimeterLayer)
//         setPerimeterData(response)
//         return response
//       });
//       // console.log('boundary data', perimeterRequest)
//       // if(perimeterRequest.data){
//       //   setPerimeterData(perimeterRequest.data)
//       //   console.log('got data', perimeterRequest.data)
//       // }
//     }
//     getBoundaries()

//   },[])

//   useEffect(()=>{

//   })

//   useEffect(()=>{
//     if(olMap){
//       // console.log('map layers', olMap.getLayers())

//     }

//     // console.log('perimeterdata', perimeterData)
//     if(olMap && perimeterData){
//       // const testPerimeter = makeGeojsonLayer(returnTestPerimeter(), 'testPerimeter',{color: 'red', width:5} )

//       // console.log('i see perimeter data and ai am making a layer')
//       const perimeterLayer = makeGeojsonLayer(perimeterData, 'useEffectPerimeter')
//       // console.log('perimeterData', perimeterData)
//       // const nextMap = map
//       olMap.addLayer(perimeterLayer)
//       // olMap.addLayer(testPerimeter)
//       // setMap(nextMap)
//       // console.log('i added the perimeter layer')
//       // console.log('map layers now', olMap.getLayers())
//       // console.log('this works', testPerimeter)
//       // console.log('this does n ot')
//     }
//   },[perimeterData])

//   // useEffect(()=>{
//   //   console.log('map changed', map)
//   //   if(map){
//   //     console.log('map layers', map.getLayers())

//   //   }

//   // },[map])



//   useEffect(() => {
//     olMap.setTarget(mapContainer.current)
//     olMap.on('click', evt=>{
//       // console.log('containerRefHere', containerRef, containerRef.current)
//       handleClickFunction(olMap, evt, containerRef.current, contentRef.current, closerRef.current)
//     })
    
//     const boundaryLayer = makeGeojsonLayer(returnBoundaries(), 'boundary', {color: '71797E', width:1})
//     const basinLayer = makeGeojsonLayer(returnBasins(),'basins', {color: '#383838', width:0.2})
//     olMap.addLayer(basinLayer)
//     olMap.addLayer(boundaryLayer)
//     // const testPerimeter = makeGeojsonLayer(returnTestPerimeter(), 'testPerimeter',{color: 'red', width:5} )
//     // console.log('basinlayer', basinLayer)
//     // const initialMap = new Map({
//     //   target: mapElement.current,
//     //     layers: [
//     //         new TileLayer({
//     //             source: new OSM(),
//     //         }),
//     //         basinLayer,
//     //         boundaryLayer,
//     //         // testPerimeter
//     //     ],
//     //     view: new View({
//     //       center: [-12234816.495438, 4522626.089577], //coordinates in EPSG3857 (x, y). Get new ones here: https://epsg.io/map#srs=3857&x=-12578783.122722&y=4902242.944054&z=10&layer=streets
//     //       zoom: 6,
//     //       projection: 'EPSG:3857'
//     //     }),
//     // });
//     //   setMap(initialMap);
//   }, []);

//   return (
//     <>
//       <div style={{height:'100vh',width:'100%'}} ref={mapContainer} className="map-container" />
//       <div id="popup" ref={containerRef} className="ol-popup">
//         <a href="#" id="popup-closer" ref={closerRef} className="ol-popup-closer"></a>
//         <div id="popup-content" ref={contentRef}></div>
//       </div>
//     </>
//   );
// }

// export default App;

// function makeGeojsonLayer(geoJsonData, layerName = 'defaultName', styleInfo ={}){
//   const {color, width} = styleInfo
//   const layerStyle = new Style ({
//       stroke: new Stroke({
//         color: color ? color : 'red',
//         width: width ? width : 1
//       }),
//       // fill: new Fill({
//       // color: color
//       // }),
//       // text: new Text({
//       //   text: feature.get('PSANationalCode'),
//       //   font: '14px Calibri,sans-serif',
//       //   fill: new Fill({
//       //     color: '#000',
//       //   }),
//       //   stroke: new Stroke({
//       //     color: '#fff',
//       //     width: 1.5,
//       //   }),
//       // }),
//     })
//   var layerSource = new VectorSource({
//     features: (new GeoJSON()).readFeatures(geoJsonData, {
//       dataProjection : 'EPSG:4326', 
//       featureProjection: 'EPSG:3857'
//     })  
//   });
  
//   var dataLayer = new VectorLayer({
//       source: layerSource,
//       className: layerName,
//       style: layerStyle,
//       id: layerName
//     });
//     // console.log('data layer', layerName, layerSource)
//     return dataLayer
// }

// function handleClickFunction(olMap, evt, containerRef, contentRef, closerRef){
//   const features = olMap.getFeaturesAtPixel(evt.pixel)
//   const coordinate = evt.coordinate;
//   const hdms = toStringHDMS(toLonLat(coordinate));
  
//   const overlay = new Overlay({
//     element: containerRef,
//     id:'popup',
//     position: undefined,
//     stopEvent: false,
//     autoPan: {
//       animation: {
//         duration: 250,
//       },
//     },
//   });

//   closerRef.onclick = function () {
//     overlay.setPosition(undefined);
//     closerRef.blur();
//     return false;
//   };


//   if(features.length >0){

//     features.map(currFeature =>{
//       const featureProps = currFeature.getProperties()
//       const incidentName = featureProps?.poly_IncidentName
//       if(incidentName){

//         // console.log('features', features)
//         overlay.setPosition(coordinate)
//         olMap.addOverlay(overlay)
//         contentRef.innerText = incidentName
//       }
//       console.log('properties', currFeature.getProperties(), incidentName)
//     })
//   }
//   // const newElement = document.createElement('div');
//   //           newElement.innerText = 'element';
//   // console.log('containerRef', containerRef)
//   // console.log('contentRef', contentRef.children)
//   // const popupOverlay = olMap.getOverlayById('popup')
//   // popupOverlay.element.innerHtml = 'hi'
//   // console.log('element', popupOverlay.element)
//   // popupOverlay.setPosition(coordinate)
//   // console.log('overlays', coordinate)
// }