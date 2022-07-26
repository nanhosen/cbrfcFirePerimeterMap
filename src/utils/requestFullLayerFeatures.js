import {config} from '../config'
const axios = require('axios')
async function getMapData(serviceName,date1, date2, minAcres){
  const resultRecordCount = config.resultRecordCount ? config.resultRecordCount : 2000
  // const currResultOffset = 100
  // const resultRecordCount = 2000
  // const shouldReturnCount = false
  // const date1 = {month: 10, day: 13, year: 2020}
  // const date2 = {month: 10, day: 15, year: 2020}
  // const minAcres = 20000
  // const serviceName = 'Fire_History_Locations_Public'

  
  const fullFeatures = []
  for await (const feature of queryFeatures(serviceName,date1, date2, resultRecordCount, false, minAcres)) {
    // console.log('feature', feature)
    fullFeatures.push(feature)
    // console.log(feature.attributes.Name);
  }
  // console.log('fullFeatures lenght', fullFeatures.length)
  // fullFeatures.map(currFeature=>{
  //   const featureProps = currFeature.properties
  //   const fireName = featureProps.IncidentName
  //   const discoveryTIme = featureProps.FireDiscoveryDateTime
  //   console.log('!!!!!!!!!!!!!!!!!!!!!', fireName)
  // })
  const geojsonData = {
    type: "FeatureCollection",
    properties: {
    count: fullFeatures.length
    },
    features: fullFeatures
    }
    // console.log('geojson', geojsonData)
  return geojsonData
}

// getMapData()


async function* queryFeatures(serviceName,date1, date2, pageSize, minAcres) {
  // console.log('in generator')
  let start = 0;
  while (true) {
    // console.log('start', start)
    // console.log('query feature input', serviceName, date1, date2, start, pageSize, false, minAcres)
    const url = generateUrl(serviceName, date1, date2, start, pageSize, false, minAcres)
    try{
      const featureSetGet = await axios.get(url)
      // console.log('feature set get', serviceName, url, featureSetGet)
      const featureSet = featureSetGet.data
      if(!featureSet || !featureSet.features){
        // console.log('no featureSet', featureSetGet)
        return 
      }
      // console.log('properties', featureSet.features)
      yield* featureSet.features

      if (!featureSet.properties || !featureSet.properties.exceededTransferLimit) {
        // console.log('didnt exceed limit')
        return;
      }

      start += pageSize;
    }
    catch(e){
      console.log('error in request', serviceName, url, e)
      return JSON.stringify(e)
    }
    
  }
}




function generateUrl(serviceName = 'CY_WildlandFire_Locations_ToDate', date1 = {}, date2 ={}, currResultOffset = 0, resultRecordCount = 2000, shouldReturnCount = false, minAcres = 200){
  const {month: month1, day: day1, year: year1} = date1
  const {month: month2, day: day2, year: year2} = date2
  // console.log('month1', month1, month2)
  const baseUrlOrig = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/${serviceName}/FeatureServer/0/query?`
  const baseUrl = `https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/${serviceName}/FeatureServer/0/query?`
  const whereQueryDailyAcres = `where=DailyAcres+%3E+200+and+FireDiscoveryDateTime+BETWEEN++DATE+%27${month1}%2F${day1}%2F${year1}+12%3A09%3A00+AM%27+and+DATE+%27${month2}%2F${day2}%2F${year2}+12%3A09%3A00+AM%27+`
  const whereQuery = `where=irwin_FireDiscoveryDateTime+BETWEEN++DATE+%27${month1}%2F${day1}%2F${year1}+12%3A09%3A00+AM%27+and+DATE+%27${month2}%2F${day2}%2F${year2}+12%3A09%3A00+AM%27+`
  // const geomQuery = `&geometry=%7B%0D%0A++%22xmin%22%3A+-121.02539%2C%0D%0A++%22ymin%22%3A+29.916852%2C%0D%0A++%22xmax%22%3A+-101.118164%2C%0D%0A++%22ymax%22%3A+44.933696%2C%0D%0A++%22spatialReference%22%3A+%7B%0D%0A++++%22wkid%22%3A+4326%0D%0A++%7D%0D%0A%7D&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects`
  const restOrig = `&objectIds=&time=&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=${shouldReturnCount}&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=${currResultOffset}&resultRecordCount=${resultRecordCount}&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=standard&f=pgeojson&token=`
  const rest = `&objectIds=&time=&geometry=%7B%0D%0A++%22xmin%22%3A+-121.02539%2C%0D%0A++%22ymin%22%3A+29.916852%2C%0D%0A++%22xmax%22%3A+-101.118164%2C%0D%0A++%22ymax%22%3A+44.933696%2C%0D%0A++%22spatialReference%22%3A+%7B%0D%0A++++%22wkid%22%3A+4326%0D%0A++%7D%0D%0A%7D&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=${shouldReturnCount}&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=${currResultOffset}&resultRecordCount=${resultRecordCount}&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=standard&f=pgeojson&token=`
  // console.log('generatedUrl', `${baseUrl}${whereQuery}${geomQuery}${rest}`)
  // console.log('generatedUrl', `${baseUrl}${whereQuery}${rest}`)
  // const url = serviceName.search('Perimeters') >=0 ? `${baseUrl}where=${rest}` : `${baseUrl}${whereQueryDailyAcres}${rest}`
  const url = serviceName.search('Perimeters') >=0 ? `${baseUrl}${whereQuery}${rest}` : `${baseUrl}${whereQueryDailyAcres}${rest}`
  // console.log('generatedUrl', url)
  // console.log('generatedUrl', `${baseUrl}${whereQueryDailyAcres}${rest}`)
  return url
  // return `${baseUrl}${whereQueryDailyAcres}${rest}`
}
// https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/CY_WildlandFire_Locations_ToDate/FeatureServer/0/query?where=DailyAcres+%3E+200+and+FireDiscoveryDateTime+BETWEEN++DATE+%2710/13/2020+12:09:00+AM%27+and+DATE+%2710/15/2020+12:09:00+AM%27+&objectIds=&time=&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=0&resultRecordCount=2000&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=standard&f=pgeojson&token=
// https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json


export {getMapData}