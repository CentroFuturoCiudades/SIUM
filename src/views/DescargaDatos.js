import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Text,
  Checkbox,
  Tbody,
  Td,
  Tooltip,
  Tr,
  useToken,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  IconButton,
} from "@chakra-ui/react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import FileSaver from "file-saver";
import {
  clenedGeoData,
  separateLegendItems,
  generateQuantileColors,
  generateGradientColors,
  hexToRgb,
  cleanedGeoData,
  colorInterpolate as constantColorInterpolate,
} from "../utils/constants";
import { Legend } from "../components/Legend";
import { DescargasLegend } from "../components/DescargasLegend";
import { LegendSlider, LegendSliderItem } from "../components/LegendSlider.js";
import { useMediaQuery } from "@chakra-ui/react";
import "../index.css";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ESCENARIOS_COLOR_MAPPING } from "../components/EscenariosFuturosCard.js";
import { INITIAL_STATE } from "../components/CustomMap.js";
import { filter } from "d3";
import { ISLAS_CALOR_COLORS } from "../components/IslasCalorCard.js";

const datosMapas = [
  {
    name: "Delincuencia",
    color: "green2.300",
    description:
      "Los datos presentados corresponden a cuatro tipos de delitos del fuero común: violencia familiar, robo a transeúnte, robo a negocio y robo a casa habitación. La información fue recolectada del 1 de enero del 2017 al 31 de diciembre del 2020. Los casos en la base de datos corresponden a llamadas reportadas al 911.",
    url: "https://sium.blob.core.windows.net/sium/datos/crimen-hex.geojson",
    column: "num_crimen",
    titleLegend: "Incidencia delictiva 2017-2020",
    itemsLegend: separateLegendItems(
      [0, 150, 520],
      generateQuantileColors("#ccd1c7", "#6a2eab", 3)
    ),
  },
  {
    name: "Empleo",
    color: "orange.300",
    description:
      "Los datos de empleo proceden del Directorio Estadístico Nacional de Unidades Económicas (DENUE) del Instituto Nacional de Estadística y Geografía (INEGI) del año 2010 y de diciembre del 2019 (antes de la pandemia de COVID19). El DENUE reporta un aproximado del número de empleos a través de categorías que describen el número de personas trabajando en el establecimiento. Se tomó el valor intermedio de cada categoría.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json",
    column: "Empleos",
    titleLegend: "Número de Empleos en 2020",
    itemsLegend: separateLegendItems(
      [0, 800, 8400],
      generateQuantileColors("#dbb385", "#6a2eab", 3)
    ),
  },
  {
    name: "Crecimiento",
    color: "brown.300",
    description:
      "La información de crecimiento es un esfuerzo propio de este equipo de investigación para empatar las cartografías de los Censos del Instituto Nacional de Estadística y Geografía (INEGI) de los años 1990, 2000, 2010 y 2020.  La unidad base en que la información se muestra corresponde a las Áreas Geoestadísticas Básicas (AGEBs) del 2020. Los archivos muestran los diferenciales de población entre cada censo.",
    url: "https://sium.blob.core.windows.net/sium/datos/agebs-pob.geojson",
    column: "1990",
    titleLegend: "Leyenda crecimiento",
    itemsLegend: separateLegendItems(
      [-5100, 0, 11100],
      generateQuantileColors("#afab98", "#6a2eab", 3)
    ),
  },
  {
    name: "Segregación",
    color: "green1.300",
    description: [
      "Los datos de segregación e ingreso por Área Geoestadística Básica (AGEB) fueron calculados por nuestro equipo de investigación. La metodología se puede consultar en la siguiente publicación de acceso libre:",
      "Peraza‐Mues, G., Ponce‐Lopez, R., Muñoz Sanchez, J. A., Cavazos Alanis, F., Olivera Martínez, G., & Brambila Paz, C. (2024). Income Segregation Analysis in Limited‐Data Contexts: A Methodology Based on Iterative Proportional Fitting. Geographical Analysis, 56(1), 79-96.",
    ],
    url: "https://sium.blob.core.windows.net/sium/datos/income2.geojson",
    column: "income_pc",
    titleLegend: "Leyenda segregación",
    itemsLegend: separateLegendItems(
      [4000, 18000, 74000],
      generateQuantileColors("#c2c8bb", "#6a2eab", 3)
    ),
    inverted: true,
  },
  {
    name: "Vivienda",
    color: "brown2.300",
    description:
      "El Tecnológico de Monterrey tiene un convenio con el Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT). Los datos que se muestran corresponden a los créditos vigentes en 2019 de INFONAVIT que fueron otorgados por el instituto para adquirir una vivienda (parcial o totalmente) en los municipios de la Zona Metropolitana de Monterrey. Los datos se filtraron para analizar exclusivamente los créditos otorgados después del año 2000.",
    url: "https://sium.blob.core.windows.net/sium/datos/vivienda-hex.geojson",
    column: "IM_PRECIO_VENTA",
    titleLegend: "Precio de Venta 2000-2020",
    filter: (d) => d.properties.year_end === 2020,
    itemsLegend: separateLegendItems(
      [160000, 800000, 1800000],
      generateQuantileColors("#ccc7ae", "#6a2eab", 3)
    ),
    inverted: true,
  },
  {
    name: "Costos",
    color: "green3.500",
    description:
      "La fuente de información de estos datos son las cifras del Subsistema de Información Económica a través del Programa de Finanzas Públicas Estatales y Municipales del Instituto Nacional de Estadística y Geografía (INEGI). Los datos fueron generados y consultados del sitio de INEGI en diciembre del 2023.",
    url: "https://sium.blob.core.windows.net/sium/datos/income.geojson",
    column: "local_centralization_q_5_k_100",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Transporte",
    color: "yellow.500",
    description:
      "La información de transporte proviene de la encuesta origen-destino del 2019 que el gobierno del estado de Nuevo León realizó como parte del Programa Integral de Movilidad Urbana Sustentable (PIMUS) del Área Metropolitana de Monterrey. Transconsult fue la empresa consultora responsable del levantamiento de la encuesta.",
    url: "https://sium.blob.core.windows.net/sium/datos/transporte.geojson",
    column: "Regreso A Casa",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Mancha urbana",
    color: "orange.500",
    description: [
      "Los datos de expansión urbana proceden de la capa del Global Human Settlement Layer (GHSL), un proyecto fondeado por la Unión Europea: https://human-settlement.emergency.copernicus.eu/",
      "El GHSL identifica superficies con techo, que se denomina superficie construida. Las capas que se pueden descargar y que alimentan la visualización corresponden a la superficie con techo que se agrega de forma quinquenal. Nuestro procesamiento de la información considera una celda de 30x30 metros como construida si al menos el 20% de su superficie tiene un techo. La superficie construida no es equivalente a la superficie urbanizada. Superficie construida, que es la que se reporta en este sitio, no incluye vialidades ni espacio público, sino exclusivamente la superficie con un techo. ",
    ],
    url: "https://sium.blob.core.windows.net/sium/datos/mancha_urbana.geojson",
    column: "year",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Islas de calor",
    color: "teal1.500",
    description:
      "El equipo de investigación del Centro para el Futuro de las Ciudades generó los datos de islas de calor. La metodología se desarrolló como parte del proyecto titulado “Urban Reporting Base don Satellite Analysis (URSA)” con el equipo de Vivienda y Desarrollo Urbano del Banco Interamericano de Desarrollo (BID). Los datos en crudo proceden de las bandas térmicas de las imágenes Landsat y de la cobertura de suelo de World Dynamic.  La información de la visualización se reporta en dos formatos: 1) una categoría de calor que va de muy frío a muy caliente, estos datos proceden del diferencial entre la zona rural de análisis y cada píxel urbano (cada celda mide 30x30 metross); 2) la temperatura en grados centígrados en crudo. La nota y repositorio a continuación aportan información adicional sobre la metodología que se empleó para generar los datos que alimentan la visualización de islas de calor: https://blogs.iadb.org/ciudades-sostenibles/es/como-identificar-islas-de-calor-urbanas-descubre-ursa-el-nuevo-software-inteligente-del-bid/  y https://github.com/EL-BID/URSA",
    url: "https://sium.blob.core.windows.net/sium/datos/islas_calor.geojson",
    column: "Value",
    titleLegend: "",
    itemsLegend: [],
    fill: (d) => {
      console.log(d);
      return constantColorInterpolate(
        d.properties["Value"],
        [7, 6, 5, 4, 3, 2, 1],
        ISLAS_CALOR_COLORS,
        0.5
      );
    },
  },
  {
    name: "Escenarios de futuro",
    color: "teal2.500",
    description: [
      "Los escenarios de futuro se construyen con un modelo de expansión territorial basado en autómatas celulares llamado SLEUTH. El acrónimo de SLEUTH proviene del inglés y representa los siguientes elementos: pendiente (Slope), uso del suelo (Land use), exclusiones (Exclusions), urbanización (Urbanization), transporte (Transportation) y sombras de montañas (Hillshade). SLEUTH modela cuatro etapas de crecimiento urbano: expansión, intensificación, densificación y reurbanización. Estas fases de crecimiento son controladas por cuatro coeficientes, además de uno que controla el efecto de la pendiente. El coeficiente de difusión regula la velocidad a la que se propaga el crecimiento urbano desde áreas urbanizadas existentes hacia áreas adyacentes. El coeficiente de reproducción controla la tasa de aparición de nuevas áreas urbanizadas en el paisaje, mientras que el coeficiente de dispersión maneja la extensión del crecimiento urbano dentro de las áreas urbanizadas existentes. Por último, el coeficiente de caminos controla el impacto de las infraestructuras de transporte en el crecimiento urbano.",
      "Los escenarios son cualitativos para valorar contrastar futuros posibles y no se trata de predicciones. Esto es un proyecto en curso y trabajamos en mejoras a nuestro modelo de simulación. Si deseas conocer más acerca de la metodología detrás puedes consultar este trabajo académico:",
      "Chaudhuri, G., & Clarke, K. (2013). The SLEUTH land use change model: A review. Environmental Resources Research, 1(1), 88-105.",
    ],
    url: "https://sium.blob.core.windows.net/sium/datos/escenarios.geojson",
    titleLegend: "",
    itemsLegend: [],
    filter: (d) =>
      d.properties.escenario === "actual" ||
      d.properties.escenario === "inercial",
    fill: (d) => {
      return hexToRgb(ESCENARIOS_COLOR_MAPPING[d.properties.escenario]);
    },
  },
];

const downloadFile = async (url, filename) => {
  const response = await fetch(url);
  if (response.status === 200) {
    const blob = await response.blob();
    FileSaver.saveAs(blob, filename);
  } else {
    console.error("No se pudo descargar el archivo GeoJSON:", response);
  }
};

// This function interpolates between blue and red based on the normalized value.
function colorInterpolate(value, r1, g1, b1, inverted = false) {
  const alpha = 1;
  // Colores en componentes RGB
  const color = { r: r1, g: g1, b: b1 }; // #6a2eab
  const purple = { r: 106, g: 46, b: 171 }; // #8b4513

  // Interpolación de cada componente del color
  if (inverted) {
    const r = Math.round(purple.r * (1 - value) + color.r * value);
    const g = Math.round(purple.g * (1 - value) + color.g * value);
    const b = Math.round(purple.b * (1 - value) + color.b * value);

    // Retorno del color interpolado en formato RGBA
    return [r, g, b, 255 * alpha];
  } else {
    const r = Math.round(color.r * (1 - value) + purple.r * value);
    const g = Math.round(color.g * (1 - value) + purple.g * value);
    const b = Math.round(color.b * (1 - value) + purple.b * value);

    // Retorno del color interpolado en formato RGBA
    return [r, g, b, 255 * alpha];
  }
}

const DescargaDatos = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [selectedMaps, setSelectedMaps] = useState([]);
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [originalData, setOriginalData] = useState(null);
  const [layers, setLayers] = useState([]);
  const [opacities, setOpacities] = useState({});

  const colorTokens = datosMapas.map((map) => map.color); // Asume una propiedad 'color' en cada mapa
  const colors = useToken("colors", colorTokens);
  useEffect(() => {
    const newLayers = selectedMaps
      .map((map) => {
        const data = originalData && originalData[map.name];
        if (!data) return null;
        // Standard configuration for other maps
        const colorIndex = datosMapas.findIndex((m) => m.name === map.name);
        const fillColor = colors[colorIndex] || "#0000ff";
        const values = data.features.map((d) => d.properties[map.column]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const isDiverse = minVal !== maxVal;
        const opacity = opacities[`${map.name}-layer`] / 100 || 1;

        function standardFill(d, opacity) {
          if (!isDiverse) return [0, 0, 255, 255]; // Default color if all values are the same
          const normalizedValue =
            (d.properties[map.column] - minVal) / (maxVal - minVal);
          const rgb = hexToRgb(fillColor);
          return colorInterpolate(
            normalizedValue,
            rgb[0],
            rgb[1],
            rgb[2],
            map.inverted
          );
        }
        return {
          id: `${map.name}-layer`,
          opacity: 0.8,
          data: data.features
            .filter((d) => (map.filter ? map.filter(d) : true))
            .filter(
              (d) =>
                !map.column ||
                (map.inverted
                  ? d.properties[map.column] <
                    opacity * (maxVal - minVal) + minVal
                  : d.properties[map.column] >
                    (1 - opacity) * (maxVal - minVal) + minVal)
            ),
          getFillColor: (d) =>
            map.fill ? map.fill(d) : standardFill(d, opacity),
          getLineWidth: 0,
        };
      })
      .filter((layer) => layer); // Filter out any undefined layers

    setLayers(newLayers);
  }, [originalData, selectedMaps, opacities]);

  const handleMapSelection = async (map) => {
    if (!selectedMaps.some((m) => m.name === map.name)) {
      setSelectedMaps((prevSelectedMaps) => [...prevSelectedMaps, map]);
      const data = await fetch(map.url).then((res) => res.json());
      setOriginalData((prevData) => ({
        ...prevData,
        [map.name]: data,
      }));
    } else {
      setSelectedMaps((prevSelectedMaps) =>
        prevSelectedMaps.filter((m) => m.name !== map.name)
      );
      setOriginalData((prevData) => ({
        ...prevData,
        [map.name]: undefined,
      }));
    }
  };

  const handleDownloadAll = async () => {
    for (let map of selectedMaps) {
      downloadFile(map.url, `${map.name}.geojson`);
    }
  };

  const handleOpacityChange = (layerId, opacity) => {
    // Manejo estándar de opacidad para otros mapas
    setOpacities((prevOpacities) => ({
      ...prevOpacities,
      [layerId]: opacity,
    }));
  };
  const handleReverseChange = (layerId, reverse) => {};
  const legendItems = selectedMaps.map((m) => ({
    title: m.titleLegend,
    legendItems: m.itemsLegend,
  }));

  if (isMobile) {
    return (
      <div className="fullscreenMessage">
        <Link to="/problematica#expansion-urbana">
          <button className="closeButton">x</button>
        </Link>
        <Text color="black" fontSize="xl" textAlign="center" mt="4">
          Esta sección no se encuentra disponible en móvil por el momento. Para
          ver esta sección, por favor visita la página en una computadora.
        </Text>
      </div>
    );
  }
  return (
    <Flex h="100vh" direction={{ base: "column", md: "row" }}>
      {/* Contenedor de categorías a la izquierda */}
      <Flex
        w="35%"
        overflowY="auto"
        mr="0.4rem"
        bg="white"
        h="calc(100vh - 1dvh)"
        direction="column"
        borderRadius="0 0 2dvh 0"
      >
        <Flex
          direction="column"
          h="calc(100% - 5dvh)"
          borderColor="purple.600"
          borderWidth="0 0.25dvh 0 0"
        >
          <Flex textAlign="center" alignItems="center" py="min(1dvh, 0.5dvw)">
            <IconButton
              aria-label="Regresar"
              icon={<ArrowBackIcon />}
              variant="ghost"
              href="/"
              as="a"
              colorScheme="purple"
              mx="0.5dvw"
              h="min(5dvh, 2.5dvw)"
              w="min(4dvh, 2dvw)"
              fontSize="min(2.5dvh, 1.2dvw)"
            />
            <Heading align="center" fontSize="min(3dvh, 1.5dvw)">
              Categorías
            </Heading>
          </Flex>
          <Accordion
            allowMultiple
            flex="1"
            overflowY="auto"
            colorScheme="purple"
          >
            {datosMapas.map((map) => (
              <CategoriaItem
                key={map.name}
                title={map.name}
                description={map.description}
                onDownload={() => handleMapSelection(map)}
                selected={selectedMaps.some(
                  (selectedMap) => selectedMap.name === map.name
                )}
              />
            ))}
          </Accordion>
        </Flex>
        {/* Botones de descarga al pie de las categorías */}
        <Flex direction="column" w="full" mt="auto" zIndex={10}>
          <Button
            borderRadius="0 0 2dvh 0"
            borderWidth="0.25dvh 0.25dvh 0.25dvh 0"
            borderColor="purple.600"
            height="5dvh"
            fontSize="min(1.5dvh, 3dvw)"
            colorScheme="purple"
            onClick={handleDownloadAll}
          >
            Descargar GeoJSONs
          </Button>
          {/* El botón para descargar como imagen no está implementado */}
          {/* 
          <Button colorScheme="teal" onClick={handleDownloadImage}>
            Descargar como Imagen
          </Button>*/}
        </Flex>
      </Flex>

      {/* Área de contenido a la derecha */}
      <Box
        className="mapContainer"
        borderColor="purple.600"
        flex="1"
        borderRadius="0 0 0 2dvh"
      >
        <DeckGL
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          controller={true}
          id="deck-gl-canvas"
        >
          <Map
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/lameouchi/clvboacrd041l01pk9gyf4yve"
            mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
          />
          {layers.map((layer) => (
            <GeoJsonLayer key={layer.id} {...layer} />
          ))}
        </DeckGL>
        {legendItems.length && <DescargasLegend legends={legendItems} />}
        {layers.length && (
          <LegendSlider title={"Opacidad"}>
            {layers.map((layer) => (
              <LegendSliderItem
                key={layer.id}
                title={
                  datosMapas.find((m) => m.name === layer.id.split("-")[0]).name
                }
                layerId={layer.id}
                opacity={opacities[layer.id]}
                onOpacityChange={handleOpacityChange}
              />
            ))}
          </LegendSlider>
        )}
      </Box>
    </Flex>
  );
};

const parseDescription = (description) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return description.replace(urlRegex, (match) => {
    return `<a href="${match}" style="color: blue; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });
};

const CategoriaItem = ({ title, description, onDownload, selected }) => (
  <AccordionItem borderTopColor="gray.100">
    <AccordionButton
      _expanded={{ bg: selected ? "purple.100" : "white" }}
      onClick={onDownload}
      fontSize="min(2dvh, 1dvw)"
    >
      <AccordionIcon />
      <Box flex="1" textAlign="left" zIndex="1">
        {title}
      </Box>
      <Box pointerEvents="none">
        <Checkbox
          colorScheme="purple"
          isChecked={selected}
          style={{ verticalAlign: "middle" }}
        />
      </Box>
    </AccordionButton>
    <AccordionPanel pb={4}>
      {Array.isArray(description) ? (
        description.map((para, index) => (
          <Text
            key={index}
            mb={index === description.length - 1 ? 0 : 4}
            dangerouslySetInnerHTML={{ __html: parseDescription(para) }}
            fontSize="min(1.6dvh, 0.8dvw)"
          />
        ))
      ) : (
        <Text
          dangerouslySetInnerHTML={{ __html: parseDescription(description) }}
          fontSize="min(1.6dvh, 0.8dvw)"
        />
      )}
    </AccordionPanel>
  </AccordionItem>
);
export default DescargaDatos;
