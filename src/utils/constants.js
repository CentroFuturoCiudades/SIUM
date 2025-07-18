import * as d3 from "d3";
import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { scaleQuantile } from "d3-scale";
import { GeoJsonLayer } from "@deck.gl/layers";

import {
  MdOutlineAttachMoney,
  MdOutlineFamilyRestroom,
  MdDeviceThermostat,
  MdOutlineAccessTime,
  wav
} from "react-icons/md";
import { LuWaves } from "react-icons/lu";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { GiInjustice, GiRobber } from "react-icons/gi";
import { FaPeopleArrows } from "react-icons/fa";
import { BsHouseFill } from "react-icons/bs";
import { IoMdSubway } from "react-icons/io";
import { VscTriangleLeft } from "react-icons/vsc";

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
import { InfanciasCard, InfanciasControls } from "../components/InfanciasCard";
import {
  IslasCalorCard,
  IslasCalorControls,
} from "../components/IslasCalorCard";
import {
  EscenariosFuturosCard,
  EscenariosFuturosControls,
} from "../components/EscenariosFuturosCard";
import { ArroyoVivoCard, ArroyoVivoControls } from "../components/ArroyoVivoCard";
import { BrushingExtension } from "@deck.gl/extensions";
import { useEffect, useState } from "react";
import { FlatGeobufLoader } from '@loaders.gl/flatgeobuf';
import { load } from '@loaders.gl/core';
import { geojson } from 'flatgeobuf';

export function colorInterpolate(value, thresholds, colors, opacity = 1) {
  // Create a scale using the thresholds and colors
  const scale = d3
    .scaleLinear()
    .domain(thresholds)
    .range(colors)
    .interpolate(d3.interpolateRgb);

  const thresholdColor = rgb(scale(value));
  thresholdColor.opacity = opacity;

  return [
    thresholdColor.r,
    thresholdColor.g,
    thresholdColor.b,
    thresholdColor.opacity * 255,
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

export const DATA_URL = "https://sium.blob.core.windows.net/sium/datos";
export const MANCHA_URBANA_URL = `${DATA_URL}/mancha_urbana.geojson`;
export const SATELLITE_IMAGES_URL = (x) => `${DATA_URL}/expansion_${x}.jpg`;
export const MUNICIPIOS_URL = `${DATA_URL}/div-municipal.geojson`;
export const EXPANSION_URL = `${DATA_URL}/agebs-pob.geojson`;
export const EXPANSION_CHART_URL = `${DATA_URL}/expansion_municipality.json`;
export const POBLACION_SUPERFICIE_CONST_URL = `${DATA_URL}/pob-built.json`;
export const EMPLEO_URL = `${DATA_URL}/empleo_hex_2023.geojson`;
export const EMPLEO_CHART_URL = `${DATA_URL}/empleo_municipality_2023.json`;
export const TRANSPORTE_CHART_URL = `${DATA_URL}/transporte_municipality.json`;
export const TRANSPORTE_URL = `${DATA_URL}/transporte.geojson`;
export const TRANSPORTE_MASIVO_URL = `${DATA_URL}/transporte-masivo.geojson`;
export const VIAS_URL = `${DATA_URL}/vias-primarias.geojson`;
export const VIAS_CICLISTAS_URL = `${DATA_URL}/infraestructura_ciclista.geojson`;
export const VIVIENDA_URL = `${DATA_URL}/vivienda_hex2.geojson`;
export const VIVIENDA_CHART_URL = `${DATA_URL}/vivienda_municipality.json`;
export const SEGREGATION_URL = `${DATA_URL}/income2.geojson`;
export const ASENTAMIENTOSINF_URL = `${DATA_URL}/asentamientos_informales.geojson`;
export const SEGREGACION_CHART_URL = `${DATA_URL}/income_municipality.json`;
export const DELINCUENCIA_URL = `${DATA_URL}/crimen_hex2.geojson`;
export const DELINCUENCIA_CHART_URL = `${DATA_URL}/crimen_municipality.json`;
export const COSTOS_URL = `${DATA_URL}/crimen-hex.geojson`;
export const COSTOS_MUNICIPALITY_URL = `${DATA_URL}/costos_municipality.json`;
export const POB05_URL = `${DATA_URL}/pob_infancia.fgb`;
export const POB05_AGEB_URL = `${DATA_URL}/pob_infancia_ageb.fgb`;
export const POB05_CHART_URL = `${DATA_URL}/pob_infancia_municipality.json`;
export const PARQUES_URL = `${DATA_URL}/parques.fgb`;
export const PARQUES_URL2 = `${DATA_URL}/parques.geojson`;
export const SERVICIOS_URL = `${DATA_URL}/denue_infancia.fgb`;
export const ISLAS_CALOR_URL = `${DATA_URL}/suhi_categorical.tif`;
export const ISLAS_CALOR_CHART_URL = `${DATA_URL}/heat_island_municipality.json`;
export const INDUSTRIA_URL = `${DATA_URL}/industria.geojson`;

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
    data: "https://sium.blob.core.windows.net/sium/datos/div-municipal.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/div-municipal.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/div-municipal.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/transporte-masivo.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/vias-primarias.geojson",
    getLineColor: [180, 180, 180, 255],
    getLineWidth: 50,
  },
};

export const SECCION_SEGREGACION__QUINTIL_LAYER = {
  type: GeoJsonLayer,
  props: {
    id: "seccion_segregacion_quintil_layer",
    data: "https://sium.blob.core.windows.net/sium/datos/pobres.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/agebs-pob-1990-2020.geojson",
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
    data: "https://sium.blob.core.windows.net/sium/datos/income.geojson",
    dataTransform: (d) =>
      cleanedGeoData(d.features, "local_centralization_q_5_k_100"),
    getFillColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 1),
    getLineColor: (d) =>
      colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
    getLineWidth: 30,
    brushingEnabled: true,
    brushingRadius: 5000,
    extensions: [new BrushingExtension()],
  },
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
    ratio: width / height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(window)
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions(window));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

export function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function lightenColor(color, factor) {
  var lightened = color.map(function (c) {
    return Math.min(255, Math.round(c + 255 * factor));
  });
  return lightened;
}

export function generateGradientColors(startColor, endColor, steps) {
  var gradientColors = [];
  var startLight = lightenColor(hexToRgb(startColor), 0.5); // Adjust factor as needed
  var endLight = lightenColor(hexToRgb(endColor), 0.5); // Adjust factor as needed
  var halfSteps = Math.floor(steps / 2);

  for (var i = 0; i < halfSteps; i++) {
    gradientColors.push(
      rgbToHex(
        interpolateColor(hexToRgb(startColor), startLight, i / (halfSteps - 1))
      )
    );
  }

  for (var i = 0; i < halfSteps; i++) {
    gradientColors.push(
      rgbToHex(
        interpolateColor(endLight, hexToRgb(endColor), i / (halfSteps - 1))
      )
    );
  }

  return gradientColors;
}

export function generateQuantileColors(startColor, endColor, numberOfColors) {
  let colors = [];
  const interpolate = d3.interpolate(startColor, endColor);
  const step = 1 / (numberOfColors - 1);
  for (let i = 0; i < numberOfColors; i++) {
    const color = interpolate(i * step);
    colors.push(color);
  }
  return colors;
}

export function separateLegendItems(thresholds, colors) {
  // Generate legend items
  const newLegendItems = thresholds.slice(0, -1).map((threshold, index) => {
    const nextThreshold = thresholds[index + 1];
    const midpoint = (threshold + nextThreshold) / 2;
    const interpolatedColor = colorInterpolate(midpoint, thresholds, colors, 1);
    return {
      color: `rgba(${interpolatedColor.join(",")})`,
      item1: threshold,
      item2: nextThreshold,
    };
  });
  return newLegendItems;
}

// Separar la leyenda por categorías
export function separateLegendItemsByCategory(
  data,
  thresholds,
  colors,
  filtering = null
) {
  const filteringFn =
    filtering ||
    ((d) => d.toLocaleString("en-US", { maximumFractionDigits: 0 }));

  // Generate legend items
  const newLegendItems = thresholds.map((threshold, index) => {
    // El treshold es el valor del dato
    const interpolatedColor = colorInterpolate(
      threshold,
      thresholds,
      colors,
      1
    );
    return {
      color: `rgba(${interpolatedColor.join(",")})`,
      item: filteringFn(threshold),
    };
  });
  return newLegendItems;
}

export function countServicesLegend(data, colors) {
  const sectorCounts = {};
  const sectorColors = {};

  if (data) {
    console.log("entro");
    data.forEach((feature) => {
      const sector = feature.properties.sector;

      switch (sector) {
        case "comercio al por menor":
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          sectorColors[sector] = colors[0];
          break;
        case "preescolar":
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          sectorColors[sector] = colors[1];
          break;
        case "salud":
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          sectorColors[sector] = colors[2];
          break;
        case "guarderia":
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          sectorColors[sector] = colors[3];
          break;
        default:
          sectorCounts["other"] = (sectorCounts["other"] || 0) + 1;
          sectorColors[sector] = colors["gray"];
      }
    });

    console.log("servicios en el area", sectorCounts);
    //return sectorCounts;
  }

  const legend = Object.entries(sectorCounts).map(([sector, count]) => ({
    item1: sector,
    item2: count,
    color: sectorColors[sector],
  }));
}

export function countServicesLegendNOREP(data, sectors, colors) {
  const legend = Object.entries(sectors).map(([sector, count]) => ({
    item1: sector,
    item2: count,
    color: colors[sector],
  }));

  //console.log(legend)
  return legend;
}

export const useFetch = (url, initialData = undefined, aborter = undefined) => {
  const [data, setData] = useState(initialData);
  const abortController = new AbortController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    if (aborter) {
      abortController.abort();
    }

    return () => {
      abortController.abort();
    };
  }, [url, aborter]);
  return { data };
};

export const fetchGeo = async (url, rect = undefined) => {
  if (!rect) {
    return await load(url, FlatGeobufLoader);
  }
  let iterFeatures = await geojson.deserialize(url,
    {
      minX: rect[0],
      minY: rect[1],
      maxX: rect[2],
      maxY: rect[3],
    });
  let features = [];
  for await (const feature of iterFeatures) {
    features.push(feature);
  }
  return { features };
}

export const sectionsInfo = {
  "expansion-urbana": {
    title: "¿Hacia dónde nos expandimos?",
    answer: "Hacia las periferias, lejos unos de otros",
    color: "brown",
    icon: FaPeopleArrows,
    component: ExpansionUrbanaCard,
    controls: ExpansionUrbanaControls,
  },
  vivienda: {
    title: "¿Por qué nos expandimos?",
    answer: "La vivienda es más asequible en las periferias",
    color: "brown2",
    icon: BsHouseFill,
    component: ViviendaCard,
    controls: ViviendaControls,
  },
  empleo: {
    title: "¿En dónde trabajamos?",
    answer: "Principalmente en el centro, aunque hay nuevas centralidades",
    color: "orange",
    icon: HiMiniBuildingOffice,
    component: EmpleoCard,
    controls: EmpleoControls,
  },
  transporte: {
    title: "¿Cómo nos movemos?",
    answer: "En auto, demasiados de nosotros.",
    color: "yellow",
    icon: IoMdSubway,
    component: TransporteCard,
    controls: TransporteControls,
  },
  infancias: {
    title: "¿Por qué limita el desarrollo infantil?",
    answer: "Porque los servicios no están en donde se requieren.",
    color: "sage",
    icon: MdOutlineFamilyRestroom,
    component: InfanciasCard,
    controls: InfanciasControls,
  },
  segregacion: {
    title: "¿Por qué segrega?",
    answer: "Porque expulsa a los más vulnerables hacia la periferia",
    color: "green1",
    icon: GiInjustice,
    component: SegregacionCard,
    controls: SegregacionControls,
  },
  delincuencia: {
    title: "¿Por qué aumenta la inseguridad?",
    answer:
      "Porque al estar alejados, no podemos cuidarnos los unos a los otros",
    color: "green2",
    icon: GiRobber,
    component: DelincuenciaCard,
    controls: DelincuenciaControls,
  },
  costos: {
    title: "¿Por qué nos cuesta tanto dinero?",
    answer: "Hay que llevar servicios públicos más lejos",
    color: "green3",
    icon: MdOutlineAttachMoney,
    component: CostosCard,
    controls: CostosControls,
  },
  islasCalor: {
    title: "¿Por qué sentimos tanto calor?",
    answer:
      "Porque el 25% del área de la zona urbana son vialidades, hemos construido una ciudad de asfalto.",
    color: "teal1",
    icon: MdDeviceThermostat,
    component: IslasCalorCard,
    controls: IslasCalorControls,
  },
  escenariosFuturos: {
    title: "¿Qué pasaría si no cambiamos?",
    answer:
      "Tendremos una ciudad más dispersa, con centralidades desconectadas y social y territorialmente fragmentada",
    color: "teal2",
    icon: MdOutlineAccessTime,
    component: EscenariosFuturosCard,
    controls: EscenariosFuturosControls,
  },
  arroyoVivo: {
    title: "¿Por qué se contaminan nuestros arroyos?",
    answer:
      "Arroyo vivo. Modelo de regeneración, remediación y reciclaje en cuerpos de agua en Monterrey.",
    color: "blue",
    icon: LuWaves,
    component: ArroyoVivoCard,
    controls: ArroyoVivoControls,
  }
};
