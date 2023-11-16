import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { GeoJsonLayer } from "@deck.gl/layers";

import { MdHome, MdDirectionsCar, MdOutlineAttachMoney } from "react-icons/md";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { GiInjustice, GiRobber } from "react-icons/gi";
import { FaPeopleArrows } from "react-icons/fa";

import { ExpansionUrbanaCard } from "../components/ExpansionUrbanaCard";
import {
  TransporteCard,
  TransporteControls,
} from "../components/TransporteCard";
import { EmpleoCard } from "../components/EmpleoCard";
import { ViviendaCard } from "../components/ViviendaCard";
import { SegregacionCard } from "../components/SegregacionCard";
import { DelincuenciaCard } from "../components/DelincuenciaCard";
import { CostosCard } from "../components/CostosCard";

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
  type: GeoJsonLayer,
  props: {
    id: "perfifery-layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson",
    dataTransform: (d) =>
      d.features.filter((x) => PERIPHERIES.includes(x.properties.NOMGEO)),
    getFillColor: [255, 174, 0, 10],
    getLineColor: [255, 174, 0, 200],
    getLineWidth: 120,
  },
};

export const SUBCENTERS_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "subcenters-layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson",
    dataTransform: (d) =>
      d.features.filter((x) => SUBCENTERS.includes(x.properties.NOMGEO)),
    getFillColor: [7, 3, 252, 10],
    getLineColor: [7, 3, 252, 200],
    getLineWidth: 120,
  },
};

export const CENTER_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "center-layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson",
    dataTransform: (d) =>
      d.features.filter((x) => CENTER.includes(x.properties.NOMGEO)),
    getFillColor: [7, 3, 252, 10],
    getLineColor: [7, 3, 252, 200],
    getLineWidth: 120,
  },
};

export const MASIVE_TRANSPORT_LAYER = {
  type: GeoJsonLayer,
  props: {
    // New layer for public transport and its types
    id: "masive-transport-layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte-masivo.geojson",
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
  },
};

export const PRIMARY_ROUTES_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "primary_routes",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vias-primarias.geojson",
    getLineColor: [180, 180, 180, 255],
    getLineWidth: 50,
  },
};

export const SECCION_SEGREGACION__QUINTIL_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_segregacion_quintil_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/pobres.geojson",
    dataTransform: (d) => cleanedGeoData(d.features, "Ingreso"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "blue", 2),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "blue", 2),
    getLineWidth: 50,
  },
};

export const SECCION_CRECIMIENTO_LAYER_1990 = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_crecimiento_layer_1990",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson",
    dataTransform: (d) => cleanedGeoData(d.features, "1990"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 30,
  },
};

export const EXPANSION_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_crecimiento_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson",
    dataTransform: (d) => cleanedGeoData(d.features, "2020"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1.5),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 30,
  },
};

export const EMPLEO_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "empleo_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2010_Municipios_Geo2.json",
    dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "yellow", "red", 2),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "yellow", "red", 0.5),
    getLineWidth: 10,
  },
};

// export const TRANSPORTE_JEANNETTE = {
//   id: "seccion_transporte_layer",
//   data: "SIUM/data/TRANSPORTEJEANNETTE.geojson",
//   getLineColor: [100, 100, 100, 200],
//   getLineWidth: 150,

//   //IMPLEMENTACION 2 DE FILTRADO
//   dataTransform: (d, time) => {
//     console.log("Entrando a dataTransform");

//     const lineStringGenerator = d3.line();

//     const transformedData = d.features.map((feature) => {
//       const horaOri = feature.properties.HoraOri.split(":");
//       const horaDest = feature.properties.HoraDest.split(":");
//       const horaOriNum =
//         parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
//       const horaDestNum =
//         parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);

//       const timeInMinutes = time * 10;

//       if (
//         (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
//         (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
//       ) {
//         // Tomar solo la primera y última coordenada del LineString
//         const startCoords = feature.geometry.coordinates[0];
//         const endCoords =
//           feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

//         //const startAngle = (horaOriNum / 144) * Math.PI * 2;
//         //const endAngle = (horaDestNum / 144) * Math.PI * 2;
//         // Calcular el ángulo entre la primera y última coordenada
//         const startAngle = Math.atan2(startCoords[1], startCoords[0]);
//         const endAngle = Math.atan2(endCoords[1], endCoords[0]);
//         const startAltitude = startCoords[2] || 0; // Asegurarse de tener una altitud
//         const endAltitude = endCoords[2] || 0;

//         // Calcular puntos a lo largo del arco (aquí puedes ajustar la densidad)
//         const numPoints = 100;
//         // Puedes ajustar la longitud del arco multiplicando x e y por algún factor
//         const factor = 1;
//         const arcPoints = Array.from({ length: numPoints }, (_, i) => {
//           const t = i / (numPoints - 1);
//           //const angle = startAngle + t * (endAngle - startAngle);
//           //const altitude = startAltitude + t * (endAltitude - startAltitude);
//           //const x = Math.cos(angle);
//           //const y = Math.sin(angle);
//           const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
//           const y = startCoords[1] + factor * Math.sin(Math.PI * t);

//           //const lon = feature.geometry.coordinates[0][0] + factor * x;
//           //const lat = feature.geometry.coordinates[0][1] + factor * y;
//           //const lon = startCoords[0] + factor * x;
//           //const lat = startCoords[1] + factor * y;

//           //return [lon, lat, altitude];
//           return [x, y, 0]; // Altitud puede ser 0 por ahora
//         });

//         const coordinates = arcPoints.map(([lon, lat, altitude]) => [
//           lon,
//           lat,
//           altitude,
//         ]);

//         const lineString = lineStringGenerator(coordinates);

//         /*console.log("Datos transformados:", {
//         coordinates,
//         lineString,
//       });*/
//         return {
//           ...feature,
//           geometry: {
//             type: "LineString",
//             coordinates,
//           },
//           lineString,
//         };
//       } else {
//         return null;
//       }
//     });

//     const filteredData = transformedData.filter((feature) => feature !== null);

//     //console.log("Datos filtrados:", filteredData);

//     return { ...d, features: filteredData };
//   },
// };

// export const TRANSPORTE_JEANNETTE2 = {
//   id: "primary_routes",
//   data: "data/TRANSPORTEJEANNETTE.geojson",
//   getLineColor: [100, 100, 100, 200],
//   getLineWidth: 150,

//   //IMPLEMENTACION 2 DE FILTRADO
//   dataTransform: (d, time) => {
//     const filteredData = d.features.filter((feature) => {
//       const horaOri = feature.properties.HoraOri.split(":"); //separa la hora de los minutos
//       const horaDest = feature.properties.HoraDest.split(":"); //separar la hora de los minutos

//       // Convertir las horas y minutos en valores numéricos en minutos
//       const horaOriNum =
//         parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
//       const horaDestNum =
//         parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);

//       const timeInMinutes = time * 10; // Convertir el valor del slider a minutos
//       //filtrado
//       //if (horaOriNum >= time && horaOriNum < time + 1 && horaDestNum >= time && horaDestNum < time+1) {
//       if (
//         horaOriNum >= timeInMinutes &&
//         horaOriNum < timeInMinutes + 10 &&
//         horaDestNum >= timeInMinutes &&
//         horaDestNum < timeInMinutes + 10
//       ) {
//         return true; //pone los datos que entran en el rango
//       } else {
//         return false; //descarta los datos si no se cumple
//       }
//     });

//     return { ...d, features: filteredData };
//   },
// };

export const VIVIENDA_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_vivienda_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson",
    dataTransform: (d) => cleanedGeoData(d.features, "IM_PRECIO_VENTA", true),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 10,
  },
};

export const SEGREGACION_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_segregacion_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
    dataTransform: (d) =>
      cleanedGeoData(d.features, "local_centralization_q_1_k_100"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 20,
  },
};

export const DELINCUENCIA_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_delincuencia_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson",
    dataTransform: (d) => cleanedGeoData(d.features, "num_crimen"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 10,
  },
};

export const COSTOS_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_costos_layer",
    data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
    dataTransform: (d) =>
      cleanedGeoData(d.features, "local_centralization_q_5_k_100"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 30,
  },
};

export const sectionsInfo = {
  "expansion-urbana": {
    title: "¿Hacia dónde crecemos?",
    answer: "Hacia las periferias, lejos unos de otros.",
    color: "brown",
    icon: FaPeopleArrows,
    component: ExpansionUrbanaCard,
    controls: null,
  },
  empleo: {
    title: "¿En dónde trabajamos?",
    answer: "En el centro.",
    color: "brown2",
    icon: HiMiniBuildingOffice,
    component: EmpleoCard,
    controls: null,
  },
  transporte: {
    title: "¿Cómo nos movemos?",
    answer: "Mayormente en automovil.",
    color: "orange",
    icon: MdDirectionsCar,
    component: TransporteCard,
    controls: TransporteControls,
  },
  vivienda: {
    title: "¿Por qué nos expandimos?",
    answer: "La vivienda es más asequible en las periferias.",
    color: "yellow",
    icon: MdHome,
    component: ViviendaCard,
    controls: null,
  },
  segregacion: {
    title: "¿Qué nos segrega?",
    answer: "Aisla a personas con menos recursos de zonas con mayor inversión.",
    color: "sage",
    icon: GiInjustice,
    component: SegregacionCard,
    controls: null,
  },
  delincuencia: {
    title: "¿Qué causa inseguridad?",
    answer: "Porque la segregación aumenta la delincuencia.",
    color: "green",
    icon: GiRobber,
    component: DelincuenciaCard,
    controls: null,
  },
  costos: {
    title: "¿Cuánto cuesta expandirnos?",
    answer: "Porque hay que llevar servicios públicos cada vez más lejos.",
    color: "teal",
    icon: MdOutlineAttachMoney,
    component: CostosCard,
    controls: null,
  },
};
