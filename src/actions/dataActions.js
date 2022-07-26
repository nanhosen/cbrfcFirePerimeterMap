import { getMapData } from '../utils/requestFullLayerFeatures';
import { makeGeojsonLayer, makeSeverityLayer } from '../utils/makeLayers';
import {config} from '../config'
import {returnBasins} from '../data/getRfcBasins'
import {returnBoundaries} from '../data/getRfcBoundary'
import {boundaryLayersStyleFunction, boundaryStyleFunction, basinStyleFunction} from '../style/layerStyleFunctions'


// initialLayers:['fireLocations', 'firePerimeters', 'severityLayer'],
async function makeDataLayer (layerName,date1, date2, minAcres){
  const serviceName = config[layerName].serviceName ? config[layerName].serviceName : config['default'].serviceName
  const mapData = await  getMapData(serviceName,date1, date2, minAcres)
  const styleFunction = config[layerName].styleFunction ? config[layerName].styleFunction : config['default'].styleFunction
  const styleInfo = config[layerName].styleInfo ? config[layerName].styleInfo : null
  const newLayer = makeGeojsonLayer(mapData,layerName, styleFunction, styleInfo)
  return newLayer
}


//
// thinking like case "init" just add everything to map
// if case date change the remove all data and add everything to map. 
//   so i guess action is just calculating and returning layers

// so i guess pass in which layers want calculated and then will return 
// calculated layers

async function initMap(date1, date2, minAcres){
  const initialLayerArray = config.initialLayers
  const layerArray = []
  // const perimeterLayer = await makeDataLayer('firePerimeters', date1, date2, minAcres)
  //dispatch requesting perimeters
  // const locationLayer = await makeDataLayer('fireLocations', date1, date2, minAcres)
  // console.log('locationLayer', locationLayer)
  // const severityLayer = makeSeverityLayer()
  const boundaryLayer = makeGeojsonLayer(returnBoundaries(), 'boundary', boundaryStyleFunction)
  const basinLayer = makeGeojsonLayer(returnBasins(),'basins', basinStyleFunction)


  return {basinLayer,  boundaryLayer}
  // return [ basinLayer,  boundaryLayer]
  // return [severityLayer, basinLayer, perimeterLayer, locationLayer, boundaryLayer]
}


async function updateMap(date1, date2, minAcres, dataYear){
  const perimeterLayer = await makeDataLayer('firePerimeters', date1, date2, minAcres)
  //dispatch requesting perimeters
  const locationLayer = await makeDataLayer('fireLocations', date1, date2, minAcres)
  // console.log('locationLayer', locationLayer)
  // const severityLayer = makeSeverityLayer()
  const layerArray = [perimeterLayer, locationLayer]
  if(dataYear === '2020' || dataYear === 'all'){
    layerArray.unshift(makeSeverityLayer())
  }
  // const boundaryLayer = makeGeojsonLayer(returnBoundaries(), 'boundary', boundaryStyleFunction)
  // const basinLayer = makeGeojsonLayer(returnBasins(),'basins', basinStyleFunction)


  return layerArray
}
export { makeDataLayer, initMap, updateMap }

// function boundaryStyleFunction(){
//   return new Style ({
//     stroke: new Stroke({
//       color: 'black',
//       width: 1
//     }),
//   })
// }

// function basinStyleFunction(){
//   return new Style ({
//     stroke: new Stroke({
//       color: '#383838',
//       width: 0.2
//     }),
//   })
// }