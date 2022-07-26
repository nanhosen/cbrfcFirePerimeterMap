import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export default {
  rfcBoundary: new Style ({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
  }),
  basinStyle: new Style ({
    stroke: new Stroke({
      color: 'black',
      width: 0.3
    }),
  }),
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
};
