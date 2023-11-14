import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import * as d3 from 'd3';


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


export const TRANSPORTE_JEANNETTE = {
  id: "primary_routes",
  data: "data/TRANSPORTEJEANNETTE.geojson",
  getLineColor: [100, 100, 100, 200],
  getLineWidth: 150,

  //IMPLEMENTACION 2 DE FILTRADO
  dataTransform: (d, time) => {
    console.log("Entrando a dataTransform");

  const lineStringGenerator = d3.line();

  const transformedData = d.features.map((feature) => {
    const horaOri = feature.properties.HoraOri.split(":");
    const horaDest = feature.properties.HoraDest.split(":");
    const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
    const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);

    const timeInMinutes = time * 10;

    if (
      (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
      (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
    ) {
      // Tomar solo la primera y última coordenada del LineString
      const startCoords = feature.geometry.coordinates[0];
      const endCoords = feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

      //const startAngle = (horaOriNum / 144) * Math.PI * 2;
      //const endAngle = (horaDestNum / 144) * Math.PI * 2;
      // Calcular el ángulo entre la primera y última coordenada
      const startAngle = Math.atan2(startCoords[1], startCoords[0]);
      const endAngle = Math.atan2(endCoords[1], endCoords[0]);
      const startAltitude = startCoords[2] || 0; // Asegurarse de tener una altitud
      const endAltitude = endCoords[2] || 0;

      // Calcular puntos a lo largo del arco (aquí puedes ajustar la densidad)
      const numPoints = 100;
      // Puedes ajustar la longitud del arco multiplicando x e y por algún factor
      const factor = 0.1;
      const arcPoints = Array.from({ length: numPoints }, (_, i) => {
        const t = i / (numPoints - 1);
        //const angle = startAngle + t * (endAngle - startAngle);
        //const altitude = startAltitude + t * (endAltitude - startAltitude);
        //const x = Math.cos(angle);
        //const y = Math.sin(angle);
        const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
        const y = startCoords[1] + factor * Math.sin(Math.PI * t);

        
        //const lon = feature.geometry.coordinates[0][0] + factor * x;
        //const lat = feature.geometry.coordinates[0][1] + factor * y;
        //const lon = startCoords[0] + factor * x;
        //const lat = startCoords[1] + factor * y;

        //return [lon, lat, altitude];
        return [x, y, 0]; // Altitud puede ser 0 por ahora
      });

      const coordinates = arcPoints.map(([lon, lat, altitude]) => [lon, lat, altitude]);

      const lineString = lineStringGenerator(coordinates);

      /*console.log("Datos transformados:", {
        coordinates,
        lineString,
      });*/
      return {
        ...feature,
        geometry: {
          type: 'LineString',
          coordinates,
        },
        lineString,
      };
    } else {
      return null;
    }
  });

  const filteredData = transformedData.filter((feature) => feature !== null);

  //console.log("Datos filtrados:", filteredData);

  return { ...d, features: filteredData };
}
};

export const TRANSPORTE_JEANNETTE2 = {
  id: "primary_routes",
  data: "data/TRANSPORTEJEANNETTE.geojson",
  getLineColor: [100, 100, 100, 200],
  getLineWidth: 150,

  //IMPLEMENTACION 2 DE FILTRADO
  dataTransform: (d, time) => {

    const filteredData = d.features.filter((feature) => {
      const horaOri = feature.properties.HoraOri.split(":"); //separa la hora de los minutos
      const horaDest = feature.properties.HoraDest.split(":"); //separar la hora de los minutos

      // Convertir las horas y minutos en valores numéricos en minutos
      const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
      const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);

      const timeInMinutes = time * 10; // Convertir el valor del slider a minutos
      //filtrado
      //if (horaOriNum >= time && horaOriNum < time + 1 && horaDestNum >= time && horaDestNum < time+1) {
      if (horaOriNum >= timeInMinutes && horaOriNum < timeInMinutes + 10 && horaDestNum >= timeInMinutes && horaDestNum < timeInMinutes + 10) {
        return true; //pone los datos que entran en el rango
      } else {
        return false; //descarta los datos si no se cumple
      }
    });

    return { ...d, features: filteredData };
  },
}


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
  //transporte: PRIMARY_ROUTES,
  //transporte: TRANSPORTE_JEANNETTE, //lee los datos filtrados entre las 6 y 7 pm


  transporte: TRANSPORTE_JEANNETTE, //lee todos los datos
  empleo: EMPLOYMENT_LAYER_1,
  "expansion-urbana": PRUEBA_SECCION_CRECIMIENTO_LAYER,
  vivienda: PRUEBA_SECCION_VIVIENDA_LAYER,
  segregacion: PRUEBA_SECCION_SEGREGACION_LAYER,
  delincuencia: PRUEBA_SECCION_DELINCUENCIA_LAYER,
  costos: PRUEBA_SECCION_COSTOS_LAYER,
};
