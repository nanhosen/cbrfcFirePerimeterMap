import React, { useRef, useState, useEffect, useContext } from "react"
import { MapContext } from '../contexts/MapContext'
import { Map, View } from 'ol';

const AppMap = ({ children, zoom, center }) => {
	const mapRef = useRef();
  console.log('rendinerg app map')
	// const [map, context.setMap] = useState(null);
  const context = useContext(MapContext)
  // console.log('children of map', children)
  // useEffect(()=>{
  //   if(context.map){

  //     console.log('map changed', context.map)
  //     console.log('map zoom', context.map.getView())
  //     console.log('map zoom', context.map.getView().getZoom())
  //   }
  // },[context.map])

  // useEffect(()=>{
  //   console.log('mapRef', mapRef)
  //   console.log('mapRef', mapRef)
  // },[mapRef])

	// on component mount
	useEffect(() => {
		let options = {
			view: new View({ 
        zoom, 
        center 
      }),
			layers: [],
			controls: [],
			overlays: []
		};

		let mapObject = new Map(options);
		mapObject.setTarget(mapRef.current);
    mapObject.on('rendercomplete', function(e){
      // console.log('rendercomplete', e)
      const extentAfter = mapObject.getView().calculateExtent(mapObject.getSize())
      context.setExtentFeatures(getExtentFeatures(mapObject.getLayers(), extentAfter))
    })
    mapObject.on('moveend', function(e) {
      // var newZoom = mapObject.getView().getZoom();
      // const extentAfter = mapObject.getView().calculateExtent(mapObject.getSize())
      // context.setExtentFeatures(getExtentFeatures(mapObject.getLayers(), extentAfter))
    })
		context.setMap(mapObject);

		return () => mapObject.setTarget(undefined);
	}, []);

	// zoom change handler
	useEffect(() => {
		if (!context.map) return;
    console.log('zoom changed', zoom)
		context.map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!context.map) return;

		context.map.getView().setCenter(center)
	}, [center])

	return (
		// <MapContext.Provider value={{ context.map }}>
			<div style={{height:'100vh',width:'100%'}}  ref={mapRef} className="ol-map">
				{children}
			</div>
		// </MapContext.Provider>
	)
}

export default AppMap;

{/* <div style={{height:'100vh',width:'100%'}} ref={mapContainer} className="map-container" />
        <div id="popup" ref={containerRef} className="ol-popup">
          <a href="#" id="popup-closer" ref={closerRef} className="ol-popup-closer"></a>
          <div id="popup-content" ref={contentRef}></div>
        </div> */}


function getExtentFeatures(currLayers, currExtent, olMap){
  const extentFeatures = []
  // console.log('currLayers', currLayers)
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
    if(currLayerId && currLayerId === 'fireLocations'){
      const layerSource = currLayer.getSource()
      // console.log('layer source', layerSource)
      layerSource.forEachFeatureInExtent(currExtent, function(extentFeature, layer){
        // console.log('geometery', extentFeature.getGeometry())
        const geometry = extentFeature.getGeometry()
        var coordinate = geometry.getCoordinates();
        // var pixel = olMap.getPixelFromCoordinate(coordinate);
        const basinFeature = basinLayerSource ? basinLayerSource.getFeaturesAtCoordinate(coordinate)  : null
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