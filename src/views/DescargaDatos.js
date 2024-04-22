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

const ISLAS_CALOR_COLORS = [
  "#C32B21",
  "#FF4945",
  "#FEBDBC",
  "#46A59C",
  "#528EAA",
  "#6A60C6",
  "#8132E1",
];

const datosMapas = [
  {
    name: "Delincuencia",
    color: "green2",
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
    color: "orange",
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
    color: "brown",
    description:
      "La información de crecimiento es un esfuerzo propio de este equipo de investigación para empatar las cartografías de los Censos del Instituto Nacional de Estadística y Geografía (INEGI) de los años 1990, 2000, 2010 y 2020.  La unidad base en que la información se muestra corresponde a las Áreas Geoestadísticas Básicas (AGEBs) del 2020. Los archivos muestran los diferenciales de población entre cada censo.",
    url: "https://sium.blob.core.windows.net/sium/datos/agebs-pob.geojson",
    column: "1990",
    titleLegend: "Leyenda crecimiento",
    itemsLegend: separateLegendItems(
      [-5100, 0, 11100],
      generateGradientColors("#4c4527", "#6a2eab", 8)
    ),
  },
  {
    name: "Segregación",
    color: "green1",
    description: [
      "Los datos de segregación e ingreso por Área Geoestadística Básica (AGEB) fueron calculados por nuestro equipo de investigación. La metodología se puede consultar en la siguiente publicación de acceso libre:",
      "Peraza‐Mues, G., Ponce‐Lopez, R., Muñoz Sanchez, J. A., Cavazos Alanis, F., Olivera Martínez, G., & Brambila Paz, C. (2024). Income Segregation Analysis in Limited‐Data Contexts: A Methodology Based on Iterative Proportional Fitting. Geographical Analysis, 56(1), 79-96.",
    ],
    url: "https://sium.blob.core.windows.net/sium/datos/income2.geojson",
    column: "income_pc",
    titleLegend: "Leyenda segregación",
    itemsLegend: separateLegendItems(
      [4000, 18000, 74000],
      generateQuantileColors("#ebede8", "#6a2eab", 3)
    ),
  },
  {
    name: "Vivienda",
    color: "brown2",
    description:
      "El Tecnológico de Monterrey tiene un convenio con el Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT). Los datos que se muestran corresponden a los créditos vigentes en 2019 de INFONAVIT que fueron otorgados por el instituto para adquirir una vivienda (parcial o totalmente) en los municipios de la Zona Metropolitana de Monterrey. Los datos se filtraron para analizar exclusivamente los créditos otorgados después del año 2000.",
    url: "https://sium.blob.core.windows.net/sium/datos/vivienda-hex.geojson",
    column: "IM_PRECIO_VENTA",
    titleLegend: "Precio de Venta 2000-2020",
    itemsLegend: separateLegendItems(
      [160000, 800000, 1800000],
      generateGradientColors("#7a724a", "#6a2eab", 8)
    ),
  },
  {
    name: "Costos",
    color: "green3",
    description:
      "La fuente de información de estos datos son las cifras del Subsistema de Información Económica a través del Programa de Finanzas Públicas Estatales y Municipales del Instituto Nacional de Estadística y Geografía (INEGI). Los datos fueron generados y consultados del sitio de INEGI en diciembre del 2023.",
    url: "https://sium.blob.core.windows.net/sium/datos/income.geojson",
    column: "local_centralization_q_5_k_100",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Transporte",
    color: "yellow",
    description:
      "La información de transporte proviene de la encuesta origen-destino del 2019 que el gobierno del estado de Nuevo León realizó como parte del Programa Integral de Movilidad Urbana Sustentable (PIMUS) del Área Metropolitana de Monterrey. Transconsult fue la empresa consultora responsable del levantamiento de la encuesta.",
    url: "https://sium.blob.core.windows.net/sium/datos/transporte.geojson",
    column: "Regreso A Casa",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Mancha urbana",
    color: "orange",
    description: [
      "Los datos de expansión urbana proceden de la capa del Global Human Settlement Layer (GHSL), un proyecto fondeado por la Unión Europea: https://human-settlement.emergency.copernicus.eu/",
      "El GHSL identifica superficies con techo, que se denomina superficie construida. Las capas que se pueden descargar y que alimentan la visualización corresponden a la superficie con techo que se agrega de forma quinquenal. Nuestro procesamiento de la información considera una celda de 30x30 metros como construida si al menos el 20% de su superficie tiene un techo. La superficie construida no es equivalente a la superficie urbanizada. Superficie construida, que es la que se reporta en este sitio, no incluye vialidades ni espacio público, sino exclusivamente la superficie con un techo. ",
    ],
    //url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/mancha_urbana.geojson",
    url: "https://sium.blob.core.windows.net/sium/datos/mancha_urbana.geojson",
    column: "year",
    titleLegend: "",
    itemsLegend: [],
    //column: "year"
  },
  {
    name: "Islas de calor",
    color: "teal1",
    description:
      "El equipo de investigación del Centro para el Futuro de las Ciudades generó los datos de islas de calor. La metodología se desarrolló como parte del proyecto titulado “Urban Reporting Base don Satellite Analysis (URSA)” con el equipo de Vivienda y Desarrollo Urbano del Banco Interamericano de Desarrollo (BID). Los datos en crudo proceden de las bandas térmicas de las imágenes Landsat y de la cobertura de suelo de World Dynamic.  La información de la visualización se reporta en dos formatos: 1) una categoría de calor que va de muy frío a muy caliente, estos datos proceden del diferencial entre la zona rural de análisis y cada píxel urbano (cada celda mide 30x30 metross); 2) la temperatura en grados centígrados en crudo. La nota y repositorio a continuación aportan información adicional sobre la metodología que se empleó para generar los datos que alimentan la visualización de islas de calor: https://blogs.iadb.org/ciudades-sostenibles/es/como-identificar-islas-de-calor-urbanas-descubre-ursa-el-nuevo-software-inteligente-del-bid/  y https://github.com/EL-BID/URSA",
    url: "https://sium.blob.core.windows.net/sium/datos/islas_calor.geojson",
    column: "muy_caliente",
    titleLegend: "",
    itemsLegend: [],
  },
  {
    name: "Escenarios de futuro",
    color: "teal2",
    description: [
      "Los escenarios de futuro se construyen con un modelo de expansión territorial basado en autómatas celulares llamado SLEUTH. El acrónimo de SLEUTH proviene del inglés y representa los siguientes elementos: pendiente (Slope), uso del suelo (Land use), exclusiones (Exclusions), urbanización (Urbanization), transporte (Transportation) y sombras de montañas (Hillshade). SLEUTH modela cuatro etapas de crecimiento urbano: expansión, intensificación, densificación y reurbanización. Estas fases de crecimiento son controladas por cuatro coeficientes, además de uno que controla el efecto de la pendiente. El coeficiente de difusión regula la velocidad a la que se propaga el crecimiento urbano desde áreas urbanizadas existentes hacia áreas adyacentes. El coeficiente de reproducción controla la tasa de aparición de nuevas áreas urbanizadas en el paisaje, mientras que el coeficiente de dispersión maneja la extensión del crecimiento urbano dentro de las áreas urbanizadas existentes. Por último, el coeficiente de caminos controla el impacto de las infraestructuras de transporte en el crecimiento urbano.",
      "Los escenarios son cualitativos para valorar contrastar futuros posibles y no se trata de predicciones. Esto es un proyecto en curso y trabajamos en mejoras a nuestro modelo de simulación. Si deseas conocer más acerca de la metodología detrás puedes consultar este trabajo académico:",
      "Chaudhuri, G., & Clarke, K. (2013). The SLEUTH land use change model: A review. Environmental Resources Research, 1(1), 88-105.",
    ],
    urls: [
      "https://sium.blob.core.windows.net/sium/datos/escenario_inercial.geojson",
      "https://sium.blob.core.windows.net/sium/datos/mancha_urbana_2020.geojson",
    ],
    column: "coordinates",
    titleLegend: "",
    itemsLegend: [],
  },
];

const INITIAL_VIEW_STATE = {
  latitude: 25.675,
  longitude: -100.286419,
  zoom: 9.6,
  pitch: 0,
  bearing: 0,
};

const DescargaDatos = () => {
  const [selectedMaps, setSelectedMaps] = useState([]);
  const [expandedPanels, setExpandedPanels] = useState([]);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [layers, setLayers] = useState([]);
  const [mapTitleLegend, setMapTitleLegend] = useState([]);
  const [mapLegends, setMapLegends] = useState([]);

  const [opacities, setOpacities] = useState({});

  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [showMobileMessage] = useState(true);

  const deckRef = useRef();
  const mapRef = useRef();

  const colorTokens = datosMapas.map((map) => `${map.color}.500`); // Asume una propiedad 'color' en cada mapa
  const colors = useToken("colors", colorTokens);
  // This function interpolates between blue and red based on the normalized value.
  function colorInterpolate(value, r1, g1, b1) {
    const alpha = 1;
    // Colores en componentes RGB
    const purple = { r: r1, g: g1, b: b1 }; // #6a2eab
    const brown = { r: 106, g: 46, b: 171 }; // #8b4513

    // Interpolación de cada componente del color
    const r = Math.round(purple.r * (1 - value) + brown.r * value);
    const g = Math.round(purple.g * (1 - value) + brown.g * value);
    const b = Math.round(purple.b * (1 - value) + brown.b * value);

    // Retorno del color interpolado en formato RGBA
    return [r, g, b, 255 * alpha];
  }
  useEffect(() => {
    selectedMaps.forEach((map) => {
      if (!originalData || !originalData[map.name]) {
        if (Array.isArray(map.urls)) {
          // Maneja múltiples urls
          Promise.all(
            map.urls.map((url) => fetch(url).then((res) => res.json()))
          )
            .then((dataArray) => {
              setOriginalData((prevData) => ({
                ...prevData,
                [map.name]: dataArray,
              }));
            })
            .catch((error) =>
              console.error("Error loading multiple GeoJSONs:", error)
            );
        } else {
          // Manejo estándar para una sola url
          fetch(map.url)
            .then((response) => response.json())
            .then((data) => {
              setOriginalData((prevData) => ({
                ...prevData,
                [map.name]: data,
              }));
            })
            .catch((error) => console.error("Error loading GeoJSON:", error));
        }
      }
    });
  }, [selectedMaps]); // Removed originalData from dependencies to avoid refetching when originalData changes

  useEffect(() => {
    const newLayers = selectedMaps
      .map((map) => {
        const data = originalData && originalData[map.name];

        if (!data) return null;

        if (map.name === "Islas de calor") {
          // Pre-process data if needed using cleanedGeoData function
          const processedData = cleanedGeoData(data.features, "Value");
          // Special configuration for "Islas de calor"
          return new GeoJsonLayer({
            id: `${map.name}-layer`,
            opacity: opacities[`${map.name}-layer`] / 100 || 1,
            data: processedData,
            getFillColor: (d) =>
              constantColorInterpolate(
                d.properties["Value"],
                [7, 6, 5, 4, 3, 2, 1],
                ISLAS_CALOR_COLORS,
                0.5
              ),

            getLineWidth: 0,
          });
        } else if (map.name === "Escenarios de futuro") {
          return map.urls.map((url, index) => {
            const data = originalData[map.name][index]; // Asumiendo que originalData[map.name] es un arreglo con los datos de cada URL.
            return new GeoJsonLayer({
              id: `${map.name}-layer-${index}`,
              opacity: opacities[`${map.name}-layer-${index}`] / 100 || 0.8,
              data: data,
              getFillColor: index === 0 ? [138, 115, 166] : [168, 174, 193], // Ejemplo de colores distintos por capa
              getLineColor: [0, 0, 0, 255],
              lineWidthMinPixels: 0,
            });
          });
        } else {
          // Standard configuration for other maps
          const colorIndex = datosMapas.findIndex((m) => m.name === map.name);
          const fillColor = colors[colorIndex] || "#0000ff";
          const values = data.features.map((d) => d.properties[map.column]);
          const minVal = Math.min(...values);
          const maxVal = Math.max(...values);
          const isDiverse = minVal !== maxVal;

          return new GeoJsonLayer({
            id: `${map.name}-layer`,
            opacity: opacities[`${map.name}-layer`] / 100 || 1,
            data,
            getFillColor: (d) => {
              if (!isDiverse) return [0, 0, 255, 255]; // Default color if all values are the same
              const normalizedValue =
                (d.properties[map.column] - minVal) / (maxVal - minVal);
              const rgb = hexToRgb(fillColor);
              return colorInterpolate(normalizedValue, rgb[0], rgb[1], rgb[2]);
            },
            getLineColor: [118, 124, 130],
            getLineWidth: 1,
          });
        }
      })
      .filter((layer) => layer); // Filter out any undefined layers

    setLayers(newLayers);
  }, [originalData, selectedMaps, opacities]);

  const handleMapSelection = (map) => {
    setSelectedMaps((prevSelectedMaps) => {
      if (prevSelectedMaps.find((m) => m.name === map.name)) {
        // Remove the map if it's already selected
        return prevSelectedMaps.filter((m) => m.name !== map.name);
      } else {
        // Add the map if it's not already selected
        return [...prevSelectedMaps, map];
      }
    });

    const existingIndex = mapLegends.findIndex(
      (m) => m.title === map.titleLegend
    );
    if (existingIndex !== -1) {
      //el mapa seleccionado ya existe en el array de mapLegens
      //remover el map de mapLegens
      const newMapLegends = [...mapLegends];
      newMapLegends.splice(existingIndex, 1);
      setMapLegends(newMapLegends);
    } else {
      // si no existe agregarlo
      const newMapLegends = [
        ...mapLegends,
        {
          title: map.titleLegend,
          legendItems: map.itemsLegend,
        },
      ];
      setMapLegends(newMapLegends);
    }
  };

  const handleDownloadAll = async () => {
    for (let map of selectedMaps) {
      const response = await fetch(map.url);
      if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${map.name}.geojson`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        // Espera un corto tiempo antes de iniciar la siguiente descarga
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        console.error("No se pudo descargar el archivo GeoJSON para", map.name);
      }
    }
  };

  const handleOpacityChange = (layerId, opacity) => {
    // Especifica las IDs de las capas para "Escenarios de futuro"
    console.log(layerId);
    const escenariosFuturoLayers = [
      "Escenarios de futuro-layer-0",
      "Escenarios de futuro-layer-1",
    ];

    if (escenariosFuturoLayers.includes(layerId)) {
      // Ajusta la opacidad para ambos layers de "Escenarios de futuro"
      setOpacities((prevOpacities) => ({
        ...prevOpacities,
        "Escenarios de futuro-layer-0": opacity,
        "Escenarios de futuro-layer-1": opacity,
      }));
    } else {
      // Manejo estándar de opacidad para otros mapas
      setOpacities((prevOpacities) => ({
        ...prevOpacities,
        [layerId]: opacity,
      }));
    }
  };
  const handleReverseChange = (layerId, reverse) => {};
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
          ref={deckRef}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          layers={[layers]}
          controller={true}
          onLoad={() => setIsMapLoaded(true)}
          id="deck-gl-canvas"
        >
          <Map
            ref={mapRef}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/lameouchi/cls55h898029301pfb1t07mtc"
            mapboxAccessToken="pk.eyJ1IjoidXJpZWxzYTk2IiwiYSI6ImNsbnV2MzBkZDBlajYya211bWk2eTNuc2MifQ.ZnhFC3SyhckuIQBLO59HxA"
          />
        </DeckGL>
        {mapLegends.length && <DescargasLegend legends={mapLegends} />}
        {layers.length && (
          <LegendSlider title={"Opacidad"}>
            {layers.map((layer) => (
              <LegendSliderItem
                key={layer.id}
                layerId={layer.id}
                opacity={opacities[layer.id]}
                onOpacityChange={handleOpacityChange}
              />
            ))}
          </LegendSlider>
        )}
        <Spacer />

        <Text mb="5">Mapa de: {selectedMaps.name}</Text>
      </Box>

      {isMobile && showMobileMessage && (
        <div className="fullscreenMessage">
          <Link to="/problematica#expansion-urbana">
            <button className="closeButton">x</button>
          </Link>
          <Text color="black" fontSize="xl" textAlign="center" mt="4">
            Esta sección no se encuentra disponible en móvil por el momento.
            Para ver esta sección, por favor visita la página en una
            computadora.
          </Text>
        </div>
      )}
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
