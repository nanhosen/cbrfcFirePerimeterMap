//check this out to listen to map changes:
//https://medium.com/swlh/how-to-incorporate-openlayers-maps-into-react-65b411985744

import React, { useState, useEffect, useRef, useContext, useReducer } from 'react';
import { MapContext } from '../contexts/MapContext'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stamen from 'ol/source/Stamen';
import axios from 'axios'
import { Map, View } from 'ol';
import {OSM, ImageArcGISRest, TileArcGISRest, TileWMS} from 'ol/source';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
import '../style/customStyle.css';
import EsriJSON from 'ol/format/EsriJSON';
import { request } from "@esri/arcgis-rest-request";
import { Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS';
// import {Stroke, Style } from 'ol/style.js'
import {Circle as CircleStyle, Fill, Stroke, Style,Text, Icon} from 'ol/style';
import {Point} from 'ol/geom';
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON';
// import {returnBoundaries} from './data/getRfcBoundary'
import {returnBasins} from '../data/getRfcBasins'
import {returnBoundaries} from '../data/getRfcBoundary'
import {returnTestPerimeter} from '../data/returnTestPerimeterData'
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import { writePointFeatureToBuffers } from 'ol/renderer/webgl/Layer';
import { getMapData } from '../utils/requestFullLayerFeatures';
import {transformExtent} from 'ol/proj';
import icon from '../data/icon.png'
import { makeDataLayer, initMap, updateMap } from '../actions/dataActions';
import { config } from '../config';


// const iconStyle = new Style({
//   image: new Icon({
//     anchor: [0.5, 46],
//     anchorXUnits: 'fraction',
//     anchorYUnits: 'pixels',
//     src: '../data/icon.png',
//   }),
// });

const equals = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);

  // var worldImagery = new TileLayer({
  //   source: new  XYZ({
  //     url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  //     maxZoom: 19
  //   })
  // });


// const severityLayerImage = new ImageLayer({
//   className: 'severityLayer',
//   opacity: 0.5,
//   source: new ImageArcGISRest({
//     ratio: 1,
//     params: {
//       // layers:"show:1",
//       transparent: true
//     },
//     // url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer/export?bbox=-12272750.877353597%2C2745446.416135737%2C-9262130.552374039%2C6639953.990372112&bboxSR=102100&imageSR=102100&size=780%2C1009&dpi=96&format=png32&transparent=true&layers=show%3A0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36&f=image",
//     // url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer/export?bbox=-127.8,15.4,-63.5,60.5&layers=show:2,4,7",
//     url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer",
    
//   }),
// })
// console.log('severity layer', severityLayer)
var olMapInit = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        new TileLayer({
          source: new Stamen({
            layer: 'terrain',
          }),
        }),
        // severityLayerImage,
    ],
    view: new View({
      center: [-12234816.495438, 4522626.089577], //coordinates in EPSG3857 (x, y). Get new ones here: https://epsg.io/map#srs=3857&x=-12578783.122722&y=4902242.944054&z=10&layer=streets
      zoom: 6,
      projection: 'EPSG:3857'
    }),
});



function AppMap() {
  const context = useContext(MapContext)

  const [map, setMap] = useState();
  const [olMap, setOlMap] = useState(olMapInit)
  const [perimeterData, setPerimeterData] = useState()
  const [fireLocations, setFireLocations] = useState()
  const [backdropOpen, setBackdropOpen] = useState(false)
  const mapContainer = useRef(null)
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const closerRef = useRef(null)

  useEffect(()=>{
    console.log('context', context)
    console.log('map layers', olMap.getLayers())
  },[context])

  useEffect(()=>{
    async function updateForDates(){
      console.log('updating for dates', context.dataDates)
      setBackdropOpen(true)
      const currLayers = olMap.getLayers()
      // const layersToUpdate = ['fireLocations', 'firePerimeters', 'severityLayer']
      const layersToUpdate = ['fireLocations', 'firePerimeters']
      // console.log('currLayers', currLayers)
      // currLayers.forEach(currLayer=>{
      //   const currLayerId = currLayer ? currLayer.get('id') : null
      //   if(currLayerId && layersToUpdate.indexOf(currLayerId) >=0){
      //     console.log('layer id matches', currLayerId)
      //     olMap.removeLayer(currLayer)
      //   }
      //   else{
      //     console.log('curr layer id no match', currLayerId)
      //   }
      // })
      const updatedLayers = await updateMap(context.dataDates.date1, context.dataDates.date2, context.minAcres, context.dataYear)
      // olMap.getLayers().extend(initLayers)
    
      updatedLayers.map(currNewLayer =>{
        const currNewLayerClassname = currNewLayer.getClassName()
        // console.log('classname', currNewLayer.getClassName())
        // const 
        currLayers.forEach(currLayer=>{
          const currLayerClassname = currLayer ? currLayer.getClassName() : null
          // console.log('currmap layer classname', currLayer.getClassName())
          // console.log('mapLayerId', currLayerId)
          // console.log('new layer id', currNewLayerId)
          // console.log('they match', currNewLayerId === currLayerId)
          if( currLayerClassname && currLayerClassname === currNewLayerClassname){
            // console.log('layer id matches', currLayerClassname, currNewLayerClassname)
            olMap.removeLayer(currLayer)
          }
          else{
            // console.log('curr layer id no match', currLayerId)
          }
        })
        olMap.addLayer(currNewLayer)
        // console.log('added', currNewLayerClassname, context.dataDates.date1, context.dataDates.date2)

      })
      console.log('updated for dates', context.dataDates)
      const extentAfter = olMap.getView().calculateExtent(olMap.getSize())
      context.setExtentFeatures(getExtentFeatures(olMap.getLayers(), extentAfter, olMap))
      setBackdropOpen(false)
    }
    updateForDates()


  },[context.dataYear])

  useEffect(()=>{
    async function getBoundaries(){
      console.log('initializing map layers')
      const date1 = config.date1Init
      const date2 = config.date2Init
      const minAcres = config.minAcres
      const {basinLayer, boundaryLayer} = await initMap(date1, date2, minAcres)
      const mapLayers = olMap.getLayers()
      const layerNameAr = []
      mapLayers.forEach(currLayer =>{
        if(currLayer.get('id')){
          layerNameAr.push(currLayer.get('id'))
        }
      })
      if(layerNameAr.indexOf('basins')<0){
        olMap.addLayer(basinLayer)
      }
      if(layerNameAr.indexOf('boundary')<0){
        olMap.addLayer(boundaryLayer)
      }
    }
    getBoundaries()

  },[])



  useEffect(() => {
    olMap.setTarget(mapContainer.current)
    var currZoom = olMap.getView().getZoom()
    const extentBefore = olMap.getView().calculateExtent(olMap.getSize())


    olMap.on('moveend', function(e) {
      var newZoom = olMap.getView().getZoom();
      // console.log('moved', currZoom, newZoom)
      const extentAfter = olMap.getView().calculateExtent(olMap.getSize())
      // const transformExt = transformExtent(extentAfter, 'EPSG:3857', 'EPSG:4326')
      // console.log('becore', extentBefore, 'after', extentAfter, 'are the same', equals(extentBefore,extentAfter))
      // console.log('olmap extent',transformExt)
      if (!equals(extentBefore,extentAfter)) {
        context.setExtentFeatures(getExtentFeatures(olMap.getLayers(), extentAfter))
        
        // const extentFeatures = []
        // // console.log('layers', olMap.getLayers())
        // const currLayers = olMap.getLayers()
        // currLayers.forEach(currLayer=>{
        //   const currLayerId = currLayer.get('id')
        //   // console.log('f', currLayer.get('id'))
        //   if(currLayerId && currLayerId === 'fireLocations'){
        //     const layerSource = currLayer.getSource()
        //     // console.log('layer source', layerSource)
        //     layerSource.forEachFeatureInExtent(extentAfter, function(extentFeature){
        //       // console.log('extentFeature in extent', extentFeature) 
        //       extentFeatures.push(extentFeature)
        //     }); 
        //   }
        // })
        // console.log('extent features length', extentFeatures.length)
      }
    });
    olMap.on('click', evt=>{
      // console.log('containerRefHere', containerRef, containerRef.current)
      handleClickFunction(olMap, evt, containerRef.current, contentRef.current, closerRef.current)
    })
    
    // const boundaryLayer = makeGeojsonLayer(returnBoundaries(), 'boundary', {color: '71797E', width:1})
    // const basinLayer = makeGeojsonLayer(returnBasins(),'basins', {color: '#383838', width:0.2})
    // olMap.addLayer(basinLayer)
    // olMap.addLayer(boundaryLayer)

  }, []);

  return (
    <>
    <Card sx={{m:0, pt:0}}>
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdropOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      <CardContent sx={{m:0, p:0}}>

        <div style={{height:'100vh',width:'100%'}} ref={mapContainer} className="map-container" />
        <div id="popup" ref={containerRef} className="ol-popup">
          <a href="#" id="popup-closer" ref={closerRef} className="ol-popup-closer"></a>
          <div id="popup-content" ref={contentRef}></div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}

export default AppMap;

function getExtentFeatures(currLayers, currExtent, olMap){
  const extentFeatures = []
  // console.log('layers', olMap.getLayers())
  // const currLayers = olMap.getLayers()
  let basinLayerSource
  const basinLayer = currLayers.forEach(currLayer=>{
    const currLayerId = currLayer.get('id')
    // console.log('curr layer id', currLayerId)
    if(currLayerId === 'basins'){
      // console.log('this is lame', currLayer)
      basinLayerSource =  currLayer.getSource()
    }
    // console.log('return layer before return', basinLayerSource)
    // return returnLayer
  })
  // console.log('basinLayerSource',  basinLayerSource)
  currLayers.forEach(currLayer=>{
    const currLayerId = currLayer.get('id')
    // console.log('f', currLayer.get('id'))
    if(currLayerId && currLayerId === 'fireLocations'){
      const layerSource = currLayer.getSource()
      // console.log('layer source', layerSource)
      layerSource.forEachFeatureInExtent(currExtent, function(extentFeature, layer){
        // console.log('geometery', extentFeature.getGeometry())
        const geometry = extentFeature.getGeometry()
        var coordinate = geometry.getCoordinates();
        // var pixel = olMap.getPixelFromCoordinate(coordinate);
        const basinFeature = basinLayerSource.getFeaturesAtCoordinate(coordinate)
        // console.log('basin feature', basinLayerSource.getFeaturesAtCoordinate(coordinate))
        // console.log('basin feature', basinLayerSource.getFeaturesAtCoordinate(coordinate))
        if(basinFeature && basinFeature.length >0){

          const basinInfoToGet = ['ch5_id', 'descriptio', 'fgid', 'fgs', 'reg', 'segment', 'type']
          basinInfoToGet.map(currKey =>{
            extentFeature.set(currKey, basinFeature[0].get(currKey), true)
          })
          // console.log('extent featurea fter adding basin info', extentFeature)
        }
        // if(olMap.getFeaturesAtPixel(pixel) && olMap.getFeaturesAtPixel(pixel).length > 2){
        //   olMap.getFeaturesAtPixel(pixel).map(currFeature =>{
        //     // console.log('feature classname', currFeature, currFeature.get('className'))
        //   })
        //   // console.log('features at coordinate', olMap.getFeaturesAtPixel(pixel))
        //   // console.log('pixel in extent', pixel) 
        // }
        // console.log('extentFeature', extentFeature)
        extentFeatures.push(extentFeature)
      }); 
    }
  })
  // console.log('extent features length', extentFeatures.length)
  return extentFeatures
}

// function makeLocationLayer(geoJsonData, layerName = 'defaultName'){
//   const styleCache = {};
//   const styleFunction = function (feature) {

//     const magnitude = feature.get('CalculatedAcres');
//     const defaultRadius = 10
//     let radius = magnitude 
//       ? magnitude/500 > 30
//         ? 30 : magnitude/500
//       : 0
//     // const radius =  magnitude && magnitude > 1000 ? magnitude/1000 : defaultRadius
//     // const radius = 5 + 20 * (magnitude - 0);
//     let style = styleCache[radius];
//     if (!style) {
//       style = new Style({
//         text: new Text({
//           text: radius === 0 ? '' : feature.get('IncidentName') ? feature.get('IncidentName') : 'feature neame',
//           font: '10px Calibri,sans-serif',
//           fill: new Fill({
//             color: 'black',
//           }),
//           stroke: new Stroke({
//             color: 'black',
//             width: 0.5,
//           }),
//         }),
//         image:new Icon({
//           src: 'https://www.downloadclipart.net/large/glow-png-transparent-image.png',
//           // src: 'https://www.pngall.com/light-png/download/12392'
//           // src: 'https://www.pngall.com/wp-content/uploads/1/Lighting-PNG-Image-File.png',
//           // img: icon,
//           scale:0.05,
//           opacity:0.7,
//           // size:'10px'
//         }),
//         // image: new CircleStyle({
//         //   radius: radius,
//         //   fill: new Fill({
//         //     color: 'rgba(255, 153, 0, 0.4)',
//         //   }),
//         //   stroke: new Stroke({
//         //     color: 'rgba(255, 204, 0, 1)',
//         //     width: 1,
//         //   }),
          
//         // }),
//       });
//       // styleCache[radius] = style;
//     }
//     return style;
//   };

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

//   // return new VectorLayer({
//   //   source: new VectorSource({
//   //     url: 'data/kml/2012_Earthquakes_Mag5.kml',
//   //     format: new KML({
//   //       extractStyles: false,
//   //     }),
//   //   }),
//   //   style: styleFunction,
//   // });  

//   return dataLayer  
  

// }


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

function handleClickFunction(olMap, evt, containerRef, contentRef, closerRef){
  const features = olMap.getFeaturesAtPixel(evt.pixel)
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  
  const overlay = new Overlay({
    element: containerRef,
    id:'popup',
    position: undefined,
    stopEvent: false,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  closerRef.onclick = function () {
    overlay.setPosition(undefined);
    closerRef.blur();
    return false;
  };


  if(features.length >0){

    features.map(currFeature =>{
      // console.log('currfeature', currFeature)
      const featureProps = currFeature.getProperties()
      const incidentName = featureProps?.poly_IncidentName ? 
        featureProps?.poly_IncidentName : 
          featureProps.IncidentName ? featureProps.IncidentName : ''
      if(incidentName){

        // console.log('features', features)
        overlay.setPosition(coordinate)
        olMap.addOverlay(overlay)
        contentRef.innerText = incidentName
      }
      // console.log('properties', currFeature.getProperties(), incidentName)
    })
  }
  // const newElement = document.createElement('div');
  //           newElement.innerText = 'element';
  // console.log('containerRef', containerRef)
  // console.log('contentRef', contentRef.children)
  // const popupOverlay = olMap.getOverlayById('popup')
  // popupOverlay.element.innerHtml = 'hi'
  // console.log('element', popupOverlay.element)
  // popupOverlay.setPosition(coordinate)
  // console.log('overlays', coordinate)
}