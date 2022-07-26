import {fireLocationStyleFunction, boundaryLayersStyleFunction} from './style/layerStyleFunctions'
const config = {
  fireLocations: {
    serviceName: 'Fire_History_Locations_Public',
    styleFunction: fireLocationStyleFunction
  },
  firePerimeters: {
    serviceName: 'Fire_History_Perimeters_Public',
    styleFunction: boundaryLayersStyleFunction,
    styleInfo: {color: '#383838', width:0.2}

  },

  default: {
    serviceName: 'Fire_History_Locations_Public',
    styleFunction: fireLocationStyleFunction
  },
  initialLayers:['fireLocations', 'firePerimeters', 'severityLayer'],
  dataStartYear: 2020,
  resultRecordCount: 2000,
  date1Init:{month: 1, day: 1, year: 2022},
  date2Init : {month: new Date().getMonth()+1, day: new Date().getDate(), year: new Date().getFullYear()},
  minAcresInit:2000,
  


}

const mapConfig = {
  "center": [-12234816.495438, 4522626.089577],
  "zoom": 6,
  "projection":'EPSG:3857',
  "geojsonObject": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "kind": "county",
            "name": "Wyandotte",
            "state": "KS"
          },
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [-94.8627, 39.202],
                  [-94.901, 39.202],
                  [-94.9065, 38.9884],
                  [-94.8682, 39.0596],
                  [-94.6053, 39.0432],
                  [-94.6053, 39.1144],
                  [-94.5998, 39.1582],
                  [-94.7422, 39.1691],
                  [-94.7751, 39.202],
                  [-94.8627, 39.202]
                ]
              ]
            ]
          }
        }
      ]
    },
    "geojsonObject2": {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "kind": "county",
            "name": "Johnson",
            "state": "KS"
          },
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [-94.9065, 38.9884],
                  [-95.0544, 38.9829],
                  [-95.0544, 38.7365],
                  [-94.9668, 38.7365],
                  [-94.6108, 38.7365],
                  [-94.6108, 38.846],
                  [-94.6053, 39.0432],
                  [-94.8682, 39.0596],
                  [-94.9065, 38.9884]
                ]
              ]
            ]
          }
        }
      ]
    },
  "kansasCityLonLat": [-94.579228, 39.135386],
  "blueSpringsLonLat": [-94.279851, 39.03412],
  "markerImage24" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-24.png",
  "markerImage32" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png",
  "markerImage64" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-64.png"
}

export {config, mapConfig}