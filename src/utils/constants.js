import { json } from 'd3-fetch';

  // Normalization for EMPLOYMENT_LAYER values
let minEmpleo = Infinity;
let maxEmpleo = -Infinity;

json("data/DENUE2020_Empleos_Hexagonos_2.geojson").then(data => {
  data.features.forEach(feature => {
    const empleo = feature.properties.Empleos;
    if (empleo !== 0) {   // Formula for values
      if (empleo < minEmpleo) minEmpleo = empleo;
      if (empleo > maxEmpleo) maxEmpleo = empleo;
    }
  });
});

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
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Santa Catarina",
];

export const PERIPHERY_LAYER = {
  id: "perfifery-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => PERIPHERIES.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [255, 174, 0, 10],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
};

export const EMPLOYMENT_LAYER = {  // New layer for employment geoJson excluding hex with value 0 on property
  id: "employment-layer",
  data: "data/DENUE2020_Empleos_Hexagonos_2.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: (d) => {
    const empleo = d.properties.Empleos;
    if (empleo === 0) return [0, 0, 0, 0]; // Transparent for value 0
    const normalized = (empleo - minEmpleo) / (maxEmpleo - minEmpleo);
    return [
      255 * normalized, // R: 0 para empleo bajo, 255 para empleo alto
      0,               // G: constante en 0
      255 * (1 - normalized), // B: 255 para empleo bajo, 0 para empleo alto
      128              // Alpha: semi-transparente
    ];
  },
  getLineColor: [0, 0, 0],
  getLineWidth: 10,
  dataTransform: (d) => {
    return d.features.filter((feature) => feature.properties.Empleos !== 0);
  },
};

export const MASIVE_TRANSPORT_LAYER = {  // New layer for public transport and its types
  id: "masive-transport-layer",
  data: "data/Sistemas_TransporteMasivo.geojson",
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
    d.features.filter((x) => SUBCENTERS.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [7, 3, 252, 10],
  getLineColor: [7, 3, 252, 200],
  getLineWidth: 10,
};

// Layers for dictionary, the data will apear deppending on the section chosen

export const PRIMARY_ROUTES = {
  id: "primary_routes",
  data: "data/Vias_Primarias.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
};

export const EMPLOYMENT_LAYER_1 = {
  id: "employment_layer_1",
  data: "data/DENUE2010_Empleos_Hexagonos_2.geojson",
  stroked: true,
  filled: false,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  dataTransform: (d) => {
    return d.features.filter((feature) => feature.properties.Empleos !== 0);
  },
};

export const PRUEBA_SECCION_CRECIMIENTO_LAYER = {
  id: "prueba_seccion_crecimiento_layer",
  data: "data/POB_2010.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [204, 153, 255, 255],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_VIVIENDA_LAYER = {
  id: "prueba_seccion_vivienda_layer",
  data: "data/POB_20.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [50, 50, 50, 255],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_SEGREGACION_LAYER = {
  id: "prueba_seccion_segregacion_layer",
  data: "data/POB_2000.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [64, 224, 208, 255],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_DELINCUENCIA_LAYER = {
  id: "prueba_seccion_delincuencia_layer",
  data: "data/POB_2090.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [255, 182, 193, 128],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
}

export const PRUEBA_SECCION_COSTOS_LAYER = {
  id: "prueba_seccion_costos_layer",
  data: "data/AreaMetropolitana2019.geojson",
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [0, 255, 0, 255],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
}

export const dictionaryMaps = {    // Dictionary for layer loading depending on the section in page
  'transporte' : PRIMARY_ROUTES, 
  'empleo' : EMPLOYMENT_LAYER_1,
  'expansion-urbana': PRUEBA_SECCION_CRECIMIENTO_LAYER,
  'vivienda': PRUEBA_SECCION_VIVIENDA_LAYER,
  'segregacion': PRUEBA_SECCION_SEGREGACION_LAYER,
  'delincuencia': PRUEBA_SECCION_DELINCUENCIA_LAYER,
  'costos': PRUEBA_SECCION_COSTOS_LAYER,
}

