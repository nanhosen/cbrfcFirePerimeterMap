import MapVectorLayer from './VectorLayer'
import GeoJSON from "ol/format/GeoJSON";
import { returnBasins } from '../../../data/getRfcBasins';
import FeatureStyles from '../Features/Styles'
import {vector} from '../Source'

export default function BasinLayer(year) {
  // const [age, setAge] = useState('');

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };

  return (
    <MapVectorLayer
      source={
        vector({
          features: new GeoJSON().readFeatures(returnBasins(), {
            dataProjection : 'EPSG:4326', 
            featureProjection: 'EPSG:3857'
          }),
        })}
      style={FeatureStyles.basinStyle}
  />
  );
}



// {showLayer2 && (
//   <VectorLayer
//     source={vector({
//       features: new GeoJSON().readFeatures(geojsonObject2, {
//         featureProjection: get("EPSG:3857"),
//       }),
//     })}
//     style={FeatureStyles.MultiPolygon}
//   />
// )}