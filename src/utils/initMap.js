import config from '../config'
import {makeGeojsonLayer} from './makeLayers'

function initMap(mapObject){
  const initialLayerArray = config.initialLayers
  for await (const layerName of initialLayerArray){
    const layerData = makeGeojsonLayer(layerName)
  }
}