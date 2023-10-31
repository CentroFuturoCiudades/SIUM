import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";

function colorInterpolate(normalizedValue, startColor, endColor, opacity = 1) {
  const interpolator = interpolateRgb(startColor, endColor);
  const resultColor = rgb(interpolator(normalizedValue));

  return [
    resultColor.r,
    resultColor.g,
    resultColor.b,
    normalizedValue * opacity * 255,
  ];
}

export const addNormalized = (data, column) => {
  const min = Math.min(...data.map((x) => x[column]));
  const max = Math.max(...data.map((x) => x[column]));

  return (x) => (x[column] - min) / (max - min);
};

export const cleanedGeoData = (data, column) => {
  const toNormalize = addNormalized(
    data.map((x) => x.properties),
    column
  );
  return data
    .filter((feature) => feature[column] !== 0)
    .map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          normalized: toNormalize(feature.properties),
        },
      };
    });
};

export const PERIPHERIES = [
  "Juárez",
  "García",
  "Apodaca",
  "General Escobedo",
  "El Carmen",
  "Santiago",
  "Ciénega de Flores",
  "Salinas Victoria",
  "Pesquería",
  "El Carmen",
  "Cadereyta Jiménez",
  "Hidalgo",
  "General Zuazua",
];

export const SUBCENTERS = [
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Santa Catarina",
];

export const CENTER = ["Monterrey"];

export const PERIPHERY_LAYER = {
  id: "perfifery-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => PERIPHERIES.includes(x.properties.NOMGEO)),
  getFillColor: [255, 174, 0, 10],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 120,
};

export const SUBCENTERS_LAYER = {
  id: "subcenters-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => SUBCENTERS.includes(x.properties.NOMGEO)),
  getFillColor: [7, 3, 252, 10],
  getLineColor: [7, 3, 252, 200],
  getLineWidth: 120,
};

export const CENTER_LAYER = {
  id: "center-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => CENTER.includes(x.properties.NOMGEO)),
  getFillColor: [7, 3, 252, 10],
  getLineColor: [7, 3, 252, 200],
  getLineWidth: 120,
};

export const EMPLOYMENT_LAYER = {
  // New layer for employment geoJson excluding hex with value 0 on property
  id: "employment-layer",
  data: "data/DENUE2020_Empleos_Hexagonos_2.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 3),
  getLineColor: (d) => colorInterpolate(d.properties.normalized, "blue", "red"),
};

export const MASIVE_TRANSPORT_LAYER = {
  // New layer for public transport and its types
  id: "masive-transport-layer",
  data: "data/Sistemas_TransporteMasivo.geojson",
  getLineColor: (feature) => {
    const nombrePropiedad = feature.properties.NOMBRE;

    const colorMapping = {
      // Change color based on type of transport
      ECOVIA: [255, 0, 0, 128], // Rojo
      "Linea 1 - Metro": [0, 255, 0, 128],
      "Linea 2 - Metro": [0, 0, 255, 128],
      "Linea 3 - Metro": [255, 255, 0, 128],
      Transmetro: [255, 105, 180, 128],
    };

    return colorMapping[nombrePropiedad] || [64, 224, 208, 128];
  },
  getLineWidth: 150,
};

export const PRIMARY_ROUTES = {
  id: "primary_routes",
  data: "data/Vias_Primarias.geojson",
  getLineColor: [100, 100, 100, 200],
  getLineWidth: 150,
};

export const EMPLOYMENT_LAYER_1 = {
  id: "employment_layer_1",
  data: "data/DENUE2010_Empleos_Hexagonos_2.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 3),
  getLineColor: (d) => colorInterpolate(d.properties.normalized, "blue", "red"),
  getLineWidth: 10,
};

export const PRUEBA_SECCION_CRECIMIENTO_LAYER = {
  id: "prueba_seccion_crecimiento_layer",
  data: "data/POB_2010.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "POBTOT2010"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const PRUEBA_SECCION_VIVIENDA_LAYER = {
  id: "prueba_seccion_vivienda_layer",
  data: "data/POB_20.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "POBTOT_x"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const PRUEBA_SECCION_SEGREGACION_LAYER = {
  id: "prueba_seccion_segregacion_layer",
  data: "data/POB_2000.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "POBTOT00"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const PRUEBA_SECCION_DELINCUENCIA_LAYER = {
  id: "prueba_seccion_delincuencia_layer",
  data: "data/POB_2090.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "POBTOT90"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const PRUEBA_SECCION_COSTOS_LAYER = {
  id: "prueba_seccion_costos_layer",
  data: "data/AreaMetropolitana2019.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "Area"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const geojsonsMapping = {
  // Dictionary for layer loading depending on the section in page
  transporte: PRIMARY_ROUTES,
  empleo: EMPLOYMENT_LAYER_1,
  "expansion-urbana": PRUEBA_SECCION_CRECIMIENTO_LAYER,
  vivienda: PRUEBA_SECCION_VIVIENDA_LAYER,
  segregacion: PRUEBA_SECCION_SEGREGACION_LAYER,
  delincuencia: PRUEBA_SECCION_DELINCUENCIA_LAYER,
  costos: PRUEBA_SECCION_COSTOS_LAYER,
};
