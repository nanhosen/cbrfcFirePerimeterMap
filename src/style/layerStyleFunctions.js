import {Circle as CircleStyle, Fill, Stroke, Style,Text, Icon} from 'ol/style';

const boundaryLayersStyleFunction = function(feature, styleInfo ={}){
  const {color, width} = styleInfo
  const layerStyle = new Style ({
    stroke: new Stroke({
      color: color ? color : 'red',
      width: width ? width : 1
    }),
  })  
  return layerStyle  
}

function boundaryStyleFunction(){
  return new Style ({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
  })
}

function basinStyleFunction(){
  return new Style ({
    stroke: new Stroke({
      color: '#383838',
      width: 0.2
    }),
  })
}

const fireLocationStyleFunction = function (feature) {

  const magnitude = feature.get('CalculatedAcres');
  const defaultRadius = 10
  let radius = magnitude 
    ? magnitude/500 > 30
      ? 30 : magnitude/500
    : 0
  // const radius =  magnitude && magnitude > 1000 ? magnitude/1000 : defaultRadius
  // const radius = 5 + 20 * (magnitude - 0);
  let style = null
  if (!style) {
    style = new Style({
      text: new Text({
        text: radius === 0 ? '' : feature.get('IncidentName') ? feature.get('IncidentName') : 'feature neame',
        font: '10px Calibri,sans-serif',
        fill: new Fill({
          color: 'black',
        }),
        stroke: new Stroke({
          color: 'black',
          width: 0.5,
        }),
      }),
      image:new Icon({
        src: 'https://www.downloadclipart.net/large/glow-png-transparent-image.png',
        // src: 'https://www.pngall.com/light-png/download/12392'
        // src: 'https://www.pngall.com/wp-content/uploads/1/Lighting-PNG-Image-File.png',
        // img: icon,
        scale: radius === 0 ? 0 : 0.05,
        opacity:0.7,
        // size:'10px'
      }),
      // image: new CircleStyle({
      //   radius: radius,
      //   fill: new Fill({
      //     color: 'rgba(255, 153, 0, 0.4)',
      //   }),
      //   stroke: new Stroke({
      //     color: 'rgba(255, 204, 0, 1)',
      //     width: 1,
      //   }),
        
      // }),
    });
    // styleCache[radius] = style;
  }
  return style;
};

export {fireLocationStyleFunction, boundaryLayersStyleFunction, boundaryStyleFunction, basinStyleFunction}