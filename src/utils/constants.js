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

export const cleanedGeoData = (data, column, reversed = false) => {
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
          normalized: reversed
            ? 1 - toNormalize(feature.properties)
            : toNormalize(feature.properties),
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

export const MASIVE_TRANSPORT_LAYER = {
  // New layer for public transport and its types
  id: "masive-transport-layer",
  data: "data/transporte-masivo.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getLineWidth: 10,
  getLineColor: (feature) => {
    const nombrePropiedad = feature.properties.NOMBRE;

    const colorMapping = {
      // Change color based on type of transport
      ECOVIA: [0, 200, 0, 255], // Rojo
      "Linea 1 - Metro": [0, 200, 0, 255],
      "Linea 2 - Metro": [0, 200, 0, 255],
      "Linea 3 - Metro": [0, 200, 0, 255],
      Transmetro: [0, 200, 0, 255],
    };

    return colorMapping[nombrePropiedad] || [64, 224, 208, 128];
  },
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

export const PRIMARY_ROUTES = {
  id: "primary_routes",
  data: "data/Vias_Primarias.geojson",
  getLineColor: [200, 150, 150, 255],
  getLineWidth: 50,
};

export const PRUEBA_SECCION_SEGREGACION__QUINTIL_LAYER = {
  id: "prueba_seccion_segregacion_quintil_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/pobres.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "Ingreso"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "blue", 2),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "blue", 2),
  getLineWidth: 50,
};

export const PRUEBA_SECCION_CRECIMIENTO_LAYER_1990 = {
  id: "prueba_seccion_crecimiento_layer_1990",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "1990"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 30,
};

export const EXPANSION_LAYER = {
  id: "prueba_seccion_crecimiento_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "2020"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 30,
};

export const EMPLEO_LAYER = {
  id: "employment_layer_1",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2010_Municipios_Geo2.json",
  dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "yellow", "red", 2),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "yellow", "red", 0.5),
  getLineWidth: 10,
};

export const VIVIENDA_LAYER = {
  id: "prueba_seccion_vivienda_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "IM_PRECIO_VENTA", true),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 10,
};

export const SEGREGACION_LAYER = {
  id: "prueba_seccion_segregacion_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
  dataTransform: (d) =>
    cleanedGeoData(d.features, "local_centralization_q_1_k_100"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 20,
};

export const DELINCUENCIA_LAYER = {
  id: "prueba_seccion_delincuencia_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "num_crimen"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 10,
};

export const COSTOS_LAYER = {
  id: "prueba_seccion_costos_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
  dataTransform: (d) =>
    cleanedGeoData(d.features, "local_centralization_q_5_k_100"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1),
  getLineColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
  getLineWidth: 30,
};

export const geojsonsMapping = {
  // Dictionary for layer loading depending on the section in page
  "expansion-urbana": [EXPANSION_LAYER],
  empleo: [EMPLEO_LAYER],
  transporte: [PRIMARY_ROUTES, MASIVE_TRANSPORT_LAYER],
  vivienda: [VIVIENDA_LAYER],
  segregacion: [SEGREGACION_LAYER],
  delincuencia: [DELINCUENCIA_LAYER],
  costos: [COSTOS_LAYER],
};
