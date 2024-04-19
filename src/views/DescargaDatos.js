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
  useToken,
} from "@chakra-ui/react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import FileSaver from "file-saver";
import { cleanedGeoData, hexToRgb } from "../utils/constants";

const datosMapas = [
  {
    name: "Delincuencia",
    color: "green2",
    description: "Los datos presentados corresponden a cuatro tipos de delitos del fuero común: violencia familiar, robo a transeúnte, robo a negocio y robo a casa habitación. La información fue recolectada del 1 de enero del 2017 al 31 de diciembre del 2020. Los casos en la base de datos corresponden a llamadas reportadas al 911.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson",
    column: "num_crimen",
  },
  {
    name: "Empleo",
    color: "orange",
    description: "Los datos de empleo proceden del Directorio Estadístico Nacional de Unidades Económicas (DENUE) del Instituto Nacional de Estadística y Geografía (INEGI) del año 2010 y de diciembre del 2019 (antes de la pandemia de COVID19). El DENUE reporta un aproximado del número de empleos a través de categorías que describen el número de personas trabajando en el establecimiento. Se tomó el valor intermedio de cada categoría.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json",
    column: "Empleos",
  },
  {
    name: "Crecimiento",
    color: "brown",
    description: "La información de crecimiento es un esfuerzo propio de este equipo de investigación para empatar las cartografías de los Censos del Instituto Nacional de Estadística y Geografía (INEGI) de los años 1990, 2000, 2010 y 2020.  La unidad base en que la información se muestra corresponde a las Áreas Geoestadísticas Básicas (AGEBs) del 2020. Los archivos muestran los diferenciales de población entre cada censo.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob.geojson",
    column: "1990",
  },
  {
    name: "Segregación",
    color: "green1",
    description: ["Los datos de segregación e ingreso por Área Geoestadística Básica (AGEB) fueron calculados por nuestro equipo de investigación. La metodología se puede consultar en la siguiente publicación de acceso libre:","Peraza‐Mues, G., Ponce‐Lopez, R., Muñoz Sanchez, J. A., Cavazos Alanis, F., Olivera Martínez, G., & Brambila Paz, C. (2024). Income Segregation Analysis in Limited‐Data Contexts: A Methodology Based on Iterative Proportional Fitting. Geographical Analysis, 56(1), 79-96."],
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income2.geojson",
    column: "income_pc",
  },
  {
    name: "Vivienda",
    color: "brown2",
    description: "El Tecnológico de Monterrey tiene un convenio con el Instituto del Fondo Nacional de la Vivienda para los Trabajadores (INFONAVIT). Los datos que se muestran corresponden a los créditos vigentes en 2019 de INFONAVIT que fueron otorgados por el instituto para adquirir una vivienda (parcial o totalmente) en los municipios de la Zona Metropolitana de Monterrey. Los datos se filtraron para analizar exclusivamente los créditos otorgados después del año 2000.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson",
    column: "IM_PRECIO_VENTA",
  },
  {
    name: "Costos",
    color: "green3",
    description: "La fuente de información de estos datos son las cifras del Subsistema de Información Económica a través del Programa de Finanzas Públicas Estatales y Municipales del Instituto Nacional de Estadística y Geografía (INEGI). Los datos fueron generados y consultados del sitio de INEGI en diciembre del 2023.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
    column: "local_centralization_q_5_k_100",
  },
  {
    name: "Transporte",
    color: "yellow",
    description: "La información de transporte proviene de la encuesta origen-destino del 2019 que el gobierno del estado de Nuevo León realizó como parte del Programa Integral de Movilidad Urbana Sustentable (PIMUS) del Área Metropolitana de Monterrey. Transconsult fue la empresa consultora responsable del levantamiento de la encuesta.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte.geojson",
    column: "Regreso A Casa",
  },
  {
    name: "Mancha urbana",
    color: "orange",
    description: ["Los datos de expansión urbana proceden de la capa del Global Human Settlement Layer (GHSL), un proyecto fondeado por la Unión Europea: https://human-settlement.emergency.copernicus.eu/", "El GHSL identifica superficies con techo, que se denomina superficie construida. Las capas que se pueden descargar y que alimentan la visualización corresponden a la superficie con techo que se agrega de forma quinquenal. Nuestro procesamiento de la información considera una celda de 30x30 metros como construida si al menos el 20% de su superficie tiene un techo. La superficie construida no es equivalente a la superficie urbanizada. Superficie construida, que es la que se reporta en este sitio, no incluye vialidades ni espacio público, sino exclusivamente la superficie con un techo. "], 
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/mancha_urbana.geojson",
    column: "year"
  },
  {
    name: "Islas de calor",
    color: "teal1",
    description: "El equipo de investigación del Centro para el Futuro de las Ciudades generó los datos de islas de calor. La metodología se desarrolló como parte del proyecto titulado “Urban Reporting Base don Satellite Analysis (URSA)” con el equipo de Vivienda y Desarrollo Urbano del Banco Interamericano de Desarrollo (BID). Los datos en crudo proceden de las bandas térmicas de las imágenes Landsat y de la cobertura de suelo de World Dynamic.  La información de la visualización se reporta en dos formatos: 1) una categoría de calor que va de muy frío a muy caliente, estos datos proceden del diferencial entre la zona rural de análisis y cada píxel urbano (cada celda mide 30x30 metross); 2) la temperatura en grados centígrados en crudo. La nota y repositorio a continuación aportan información adicional sobre la metodología que se empleó para generar los datos que alimentan la visualización de islas de calor: https://blogs.iadb.org/ciudades-sostenibles/es/como-identificar-islas-de-calor-urbanas-descubre-ursa-el-nuevo-software-inteligente-del-bid/  y https://github.com/EL-BID/URSA",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson",
    column: "features",
  },
  {
    name: "Escenarios de futuro",
    color: "teal2",
    description: "El patrón de urbanización de Monterrey en las últimas tres décadas, muestra una expansión de baja densidad hacia las periferias. Utilizando datos históricos, simulamos y proyectamos que, de continuar así, en 2040 la superficie urbanizada crecerá un XXXX%, fragmentando la ciudad y aumentando la integración de centralidades lejanas como Santiago, Saltillo y Ramos Arizpe a la metrópoli.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/escenario_inercial.geojson",
    column: "coordinates",
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
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [layers, setLayers] = useState([]);
  const [mapColors, setMapColors] = useState({});

  const mapContainerRef = useRef();
  const deckRef = useRef();
  const mapRef = useRef();

  const colorTokens = datosMapas.map(map => `${map.color}.500`); // Asume una propiedad 'color' en cada mapa
  const colors = useToken("colors", colorTokens);
console.log(colorTokens)
  // This function interpolates between blue and red based on the normalized value.
  function colorInterpolate(value, r1, g1, b1) {
    const alpha = 1
    // Colores en componentes RGB
    const purple = { r: r1, g: g1, b: b1 }; // #6a2eab
    const brown = { r: 106, g: 46, b: 171 };   // #8b4513

    // Interpolación de cada componente del color
    const r = Math.round(purple.r * (1 - value) + brown.r * value);
    const g = Math.round(purple.g * (1 - value) + brown.g * value);
    const b = Math.round(purple.b * (1 - value) + brown.b * value);

    // Retorno del color interpolado en formato RGBA
    return [r, g, b, 255 * alpha];
}

  useEffect(() => {
    // Iterate over selectedMaps array and fetch data for each map
    selectedMaps.forEach((map) => {
      if (!originalData || !originalData[map.name]) {
        // Check if originalData exists and has data for the map
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
    });
  }, [selectedMaps]); // Removed originalData from dependencies to avoid refetching when originalData changes

  useEffect(() => {
    const newLayers = selectedMaps
      .map((map) => {
        const data = originalData && originalData[map.name];
        if (!data) return null;
        const colorIndex = datosMapas.findIndex(m => m.name === map.name);
        console.log(map)
        const fillColor = colors[colorIndex] || '#0000ff'; // Default blue


        // Calculate min and max values for normalization
        const values = data.features.map((d) => d.properties[map.column]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);

        // Ensure minVal and maxVal are not equal to avoid division by zero
        const isDiverse = minVal !== maxVal;

        return new GeoJsonLayer({
          id: `${map.name}-layer`,
          data,
          getFillColor: (d) => {
            if (!isDiverse) return [0, 0, 255, 255]; // Default color if all values are the same

            // Normalize the value
            const normalizedValue =
              (d.properties[map.column] - minVal) / (maxVal - minVal);
              const rgb=hexToRgb(fillColor)

            return colorInterpolate(normalizedValue,rgb[0], rgb[1], rgb[2] ); // Apply your color interpolation function here
          },
          getLineColor: [118, 124, 130],
          getLineWidth: 1,
        });
      })
      .filter((layer) => layer); // Filter out any undefined layers

    setLayers(newLayers);
  }, [originalData, selectedMaps]);

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

  return (
    <Flex h="100vh" direction={{ base: "column", md: "row" }}>
      {/* Contenedor de categorías a la izquierda */}
      <VStack
        w={{ base: "full", md: "450px" }}
        p="5"
        boxShadow="xl"
        align="stretch"
        spacing={5}
      >
        <Heading size="md">Categorías</Heading>
        <Accordion allowMultiple flex="1" overflowY="auto">
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
        {/* Botones de descarga al pie de las categorías */}
        <Flex direction="column" w="full" mt="auto">
          <Button colorScheme="blue" mb={2} onClick={handleDownloadAll}>
            Descargar GeoJSONs
          </Button>
          {/* El botón para descargar como imagen no está implementado */}
          {/* 
          <Button colorScheme="teal" onClick={handleDownloadImage}>
            Descargar como Imagen
          </Button>*/}
        </Flex>
      </VStack>

      {/* Área de contenido a la derecha */}
      <Box className="mapContainer" flex="1" p="5" ref={mapContainerRef}>
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
        <Spacer />
        <Text mb="5">Mapa de: {selectedMaps.name}</Text>
      </Box>
    </Flex>
  );
};

const parseDescription = (description) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return description.replace(urlRegex, (match) => {
    return `<a href="${match}" style="color: blue; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });
};

const CategoriaItem = ({ title, description, onDownload, selected }) => (
  <AccordionItem>
    <h2>
      <AccordionButton
        _expanded={{ bg: selected ? "blue.100" : "white" }} 
        onClick={onDownload}
      >
        <Box flex="1" textAlign="left" zIndex="1">
          {title}
        </Box>
        <Box pointerEvents="none">
            <Checkbox isChecked={selected} />
          </Box>
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    {Array.isArray(description)
        ? description.map((para, index) => (
            <Text key={index} mb={index === description.length - 1 ? 0 : 4} dangerouslySetInnerHTML={{ __html: parseDescription(para) }} />
          ))
        : <Text dangerouslySetInnerHTML={{ __html: parseDescription(description) }} />
      }
    </AccordionPanel>
  </AccordionItem>
);

export default DescargaDatos;

