
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON';
import { Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import {OSM, ImageArcGISRest, TileArcGISRest, TileWMS} from 'ol/source';



function makeGeojsonLayer(geoJsonData, layerName = 'defaultName', styleFunction, styleInfo){
  // const {color, width} = styleInfo
  // const layerStyle = new Style ({
  //     stroke: new Stroke({
  //       color: color ? color : 'red',
  //       width: width ? width : 1
  //     }),
  //   })
  var layerSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geoJsonData, {
      dataProjection : 'EPSG:4326', 
      featureProjection: 'EPSG:3857'
    })  
  });
  
  var dataLayer = new VectorLayer({
      source: layerSource,
      className: layerName,
      style: styleFunction,
      id: layerName
    });
    // console.log('data layer', layerName, layerSource)
    return dataLayer
}

function makeSeverityLayer(year){
  const severityLayerImage = new ImageLayer({
    className: 'severityLayer',
    opacity: 0.5,
    source: new ImageArcGISRest({
      ratio: 1,
      params: {
        layers:"show:0",
        transparent: true
      },
      // url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer/export?bbox=-12272750.877353597%2C2745446.416135737%2C-9262130.552374039%2C6639953.990372112&bboxSR=102100&imageSR=102100&size=780%2C1009&dpi=96&format=png32&transparent=true&layers=show%3A0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36&f=image",
      // url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer/export?bbox=-127.8,15.4,-63.5,60.5&layers=show:2,4,7",
      url: "https://apps.fs.usda.gov/arcx/rest/services/RDW_Wildfire/MTBS_CONUS/MapServer",
      
    }),
  })
  return severityLayerImage
}

export {makeGeojsonLayer, makeSeverityLayer}