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

export const MASIVE_TRANSPORT_LAYER = {  // New layer for public transport and its types
  id: "masive-transport-layer",
  data: "data/transporte-masivo.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getLineWidth: 10,
  getLineColor: (feature) => {
    const nombrePropiedad = feature.properties.NOMBRE; 

    const colorMapping = {   // Change color based on type of transport
      ECOVIA: [255, 0, 0, 128], // Rojo
      'Linea 1 - Metro': [0, 255, 0, 128], 
      'Linea 2 - Metro': [0, 0, 255, 128], 
      'Linea 3 - Metro': [255, 255, 0, 128], 
      Transmetro: [255, 105, 180, 128], 
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

export const EMPLOYMENT_LAYER = {
  // New layer for employment geoJson excluding hex with value 0 on property
  id: "employment-layer",
  data: "data/DENUE2020_Empleos_Hexagonos_2.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 3),
  getLineColor: (d) => colorInterpolate(d.properties.normalized, "blue", "red"),
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

// Layers for dictionary, the data will apear deppending on the section chosen

export const PRUEBA_SECCION_CRECIMIENTO_LAYER_1990 = {
  id: "prueba_seccion_crecimiento_layer_1990",
  data: "data/agebs-sum-2090.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: d => {
    const value = d.properties.POBTOT90;
    if (value >= -8411 && value < -6461) {
      return [255, 0, 0, 255]; // Rojo
    } else if (value >= -6461 && value < -4510) {
      return [128, 0, 0, 255]; // Tinto
    } else if (value >= -4510 && value < -2560) {
      return [255, 192, 203, 255]; // Rosa
    } else if (value >= -2560 && value < -609) {
      return [255, 179, 71, 255]; // Naranja claro
    } else if (value >= -609 && value <= 1) {
      return [245, 245, 220, 255]; // Crema
    } else if (value > 1 && value < 3292) {
      return [128, 128, 128, 255]; 
    } else if (value >= 3292 && value <= 5243) {
      return [0, 255, 255, 255]; // Cian
    } else if (value > 5243 && value <= 7193) {
      return [173, 216, 230, 255]; // Azul Claro
    } else if (value > 7193 && value <= 9144) {
      return [0, 0, 255, 255]; // Azul Fuerte
    } else if (value > 9144 && value <= 11094) {
      return [128, 0, 128, 255]; // Morado
    }
    return [204, 153, 255, 255]; // Color por defecto para cualquier otro valor fuera de los rangos
  },
  getLineColor: [128, 128, 128, 255],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_CRECIMIENTO_LAYER = {
  id: "prueba_seccion_crecimiento_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "1990"),
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

export const PRUEBA_SECCION_SEGREGACION__QUINTIL_LAYER = {
  id: "prueba_seccion_segregacion_quintil_layer",
  data: "data/pobres.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [50, 50, 50, 255],
  getLineColor: [128, 128, 128, 255],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_SEGREGACION_LAYER = {
  id: "prueba_seccion_segregacion_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "local_centralization_q_1_k_100"),
  getFillColor: (d) =>
    colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
  getLineColor: [50, 50, 50, 50],
  getLineWidth: 30,
};

export const PRUEBA_SECCION_DELINCUENCIA_LAYER = {
  id: "prueba_seccion_delincuencia_layer",
  data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
  dataTransform: (d) => cleanedGeoData(d.features, "local_centralization_q_5_k_100"),
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
