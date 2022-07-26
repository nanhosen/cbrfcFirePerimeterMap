import Stamen from 'ol/source/Stamen';


function stamen(layer) {
	return  new Stamen({
    layer
  })
}

export default stamen;