import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { GeoJsonLayer } from "@deck.gl/layers";

import { MdHome, MdDirectionsCar, MdOutlineAttachMoney } from "react-icons/md";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { GiInjustice, GiRobber } from "react-icons/gi";
import { FaPeopleArrows } from "react-icons/fa";

import {
  ExpansionUrbanaCard,
  ExpansionUrbanaControls,
} from "../components/ExpansionUrbanaCard";
import {
  TransporteCard,
  TransporteControls,
} from "../components/TransporteCard";
import { EmpleoCard, EmpleoControls } from "../components/EmpleoCard";
import { ViviendaCard, ViviendaControls } from "../components/ViviendaCard";
import {
  SegregacionCard,
  SegregacionControls,
} from "../components/SegregacionCard";
import {
  DelincuenciaCard,
  DelincuenciaControls,
} from "../components/DelincuenciaCard";
import { CostosCard, CostosControls } from "../components/CostosCard";

export function colorInterpolate(
  normalizedValue,
  startColor,
  endColor,
  opacity = 1
) {
  const interpolator = interpolateRgb(startColor, endColor);
  const resultColor = rgb(interpolator(normalizedValue));
  const minOpacity = 0.8;

  return [
    resultColor.r,
    resultColor.g,
    resultColor.b,
    normalizedValue > 0
      ? Math.max(opacity * normalizedValue, minOpacity) * 255
      : 0,
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

//lo que filtra los datos en base al tiempo para (vivienda, expansion y delincuencia)
export const filterDataAll = (
  data,
  selectedYear,
  column,
  reversed = false,
  nomcol
) => {
  if (!data || !data.features || !Array.isArray(data.features)) {
    return [];
  }

  const toNormalize = addNormalized(
    data.features.map((x) => x.properties),
    column
  );

  const filteredData = data.features
    .filter(
      (feature) =>
        feature[column] !== 0 &&
        parseInt(feature.properties[nomcol]) === selectedYear
    )
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

  return filteredData;
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

export function separateLegendItems(
  data,
  quartiles,
  colorStart,
  colorEnd,
  filtering = null
) {
  const filteringFn =
    filtering ||
    ((d) => d.toLocaleString("en-US", { maximumFractionDigits: 0 }));
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  // Genera puntos de quiebre basados en el rango de valores normalizados
  const breakpoints = Array.from(
    { length: quartiles + 1 },
    (_, i) => minVal + (i * (maxVal - minVal)) / quartiles
  );
  const newLegendItems = breakpoints.slice(0, -1).map((breakpoint, index) => {
    const nextBreakpoint = breakpoints[index + 1];
    // El punto medio se utiliza para calcular el color de la leyenda
    const midpoint = (breakpoint + nextBreakpoint) / 2;
    // Normaliza el punto medio para la interpolación de colores
    const normalizedMidpoint = (midpoint - minVal) / (maxVal - minVal);
    const interpolatedColor = colorInterpolate(
      normalizedMidpoint,
      colorStart,
      colorEnd,
      1
    );
    return {
      color: `rgba(${interpolatedColor.join(",")})`, // Convierte el color a cadena para CSS
      item1: filteringFn(breakpoint),
      item2: filteringFn(nextBreakpoint),
    };
  });
  return newLegendItems;
}

export const sectionsInfo = {
  "expansion-urbana": {
    title: "¿Hacia dónde nos expandimos?",
    answer: "Hacia las Periferias, lejos unos de otros",
    color: "brown",
    icon: FaPeopleArrows,
    component: ExpansionUrbanaCard,
    controls: ExpansionUrbanaControls,
  },
  empleo: {
    title: "¿En dónde trabajamos?",
    answer: "Principalmente en el centro, aunque hay nuevas centralidades",
    color: "brown2",
    icon: HiMiniBuildingOffice,
    component: EmpleoCard,
    controls: EmpleoControls,
  },
  transporte: {
    title: "¿Cómo nos movemos?",
    answer: "Demasiados de nosotros en auto",
    color: "orange",
    icon: MdDirectionsCar,
    component: TransporteCard,
    controls: TransporteControls,
  },
  vivienda: {
    title: "¿Por qué nos expandimos?",
    answer: "La vivienda es más asequible en las periferias",
    color: "yellow",
    icon: MdHome,
    component: ViviendaCard,
    controls: ViviendaControls,
  },
  segregacion: {
    title: "¿Por qué la expansión segrega?",
    answer: "Porque expulsa a los más vulnerables a la periferia",
    color: "sage",
    icon: GiInjustice,
    component: SegregacionCard,
    controls: SegregacionControls,
  },
  delincuencia: {
    title: "¿Por qué la expansión aumenta la inseguridad?",
    answer:
      "Porque al estar alejados, no nos podemos cuidar los unos a los otros",
    color: "green",
    icon: GiRobber,
    component: DelincuenciaCard,
    controls: DelincuenciaControls,
  },
  costos: {
    title: "¿Por qué la expansión nos cuenta tanto dinero?",
    answer: "Hay que llevar servicios públicos más lejos",
    color: "teal",
    icon: MdOutlineAttachMoney,
    component: CostosCard,
    controls: CostosControls,
  },
};
