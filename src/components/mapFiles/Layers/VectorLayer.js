import { useContext, useEffect } from "react";
import { MapContext } from '../../../contexts/MapContext'
// import OLVectorLayer from "ol/layer/Vector";
import { Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'


const MapVectorLayer = ({ source, style, zIndex = 0, layerName }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;
    // console.log('layer name', layerName)

		let vectorLayer = new VectorLayer({
			source,
			style,
      className: layerName,
      id: layerName
		});

		map.addLayer(vectorLayer);
		vectorLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(vectorLayer);
			}
		};
	}, [map]);

	return null;
};

export default MapVectorLayer;