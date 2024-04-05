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
} from "@chakra-ui/react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import FileSaver from "file-saver";
import { cleanedGeoData } from "../utils/constants";

const datosMapas = [
  {
    name: "Delincuencia",
    description: "Entre más aumenta la mancha urbana, más aumenta la inseguridad: cuando la mancha urbana aumenta un kilómetro, el robo a casa habitación incrementa en un 0.04%. Las incidencias delictivas como robos a transeúntes o a viviendas, así como violencia familiar se concentran en regiones segregadas. Estar alejado de actividades económicas aumenta la incidencia delictiva. Estar cercano a centros con comercio al por menor, la disminuyen.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson",
    column: "num_crimen",
  },
  {
    name: "Empleo",
    description: "La migración de familias jóvenes a la periferia reduce población en centros urbanos, aumentando desplazamientos al trabajo. Los empleos continúan a diez kilómetros alrededor de la Macroplaza pero existen nuevas centralidades. En 2010, el 53% de empleos estaba en la Macroplaza; en 2020, bajó al 47%. El crecimiento de los centros de empleo se mantienen constantes ante la migración hacia la periferia. La población de Monterrey duplicó de 1990 a 2020, y la expansión urbana creció 2.8 veces, incrementando el tiempo de traslado.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json",
    column: "Empleos",
  },
  {
    name: "Crecimiento",
    description: "La zona central de Monterrey se ha convertido en un área comercial sin residentes. Los hogares se mudan mientras los comercios permanecen. Durante décadas, se ha invertido en infraestructura de transporte para conectar el empleo en el centro con las zonas residenciales. Esto le otorga un alto valor comercial al centro y hace inviable la producción de vivienda asequible. La vivienda económica, a la que las familias jóvenes tienen acceso, se construye en las periferias urbanas.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob.geojson",
    column: "1990",
  },
  {
    name: "Segregación",
    description: "Al expandirnos en estos niveles es innevitable que ciertos grupos poblacionales, incluyendo las familias jóvenes o con primeras infancias, queden alejados de las áreas con oportunidades y servicios. La expansión provoca una segregación espacial que divide zonas abruptamente. Las zonas de mayor ingreso como San Pedro o el Sur de Monterrey y las de menor ingreso, que cuentan con costos de suelo más bajos, como sucede en Céntrika y Loma Larga, y en Estanzuela Fomerrey y los límites de la colonia Independencia con Loma Larga.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income2.geojson",
    column: "income_pc",
  },
  {
    name: "Vivienda",
    description: "Mapa de vivienda",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson",
    column: "IM_PRECIO_VENTA",
  },
  {
    name: "Costos",
    description: "La expansión urbana no solo tiene altos costos sociales y ambientales, implica un gasto público mayor, en comparación con modelos de ciudades compactas. En 1995, se gastaban alrededor de tres mil millones en obras públicas de infrastructura para llevar servicios a las zonas urbananas. En 2020 se gastaron casi treinta y seis mil millones, un aumento del 1,200%. Aún con este aumento, el gasto no ha sido suficiente ya que el gasto per cápita ha disminuido en un 88% en el mismo periodo. Los municipios ahora gastan más por metro cuadrado de la mancha urbana, de $223/m2 en 1990 a $2,000/m2 en 2020.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
    column: "local_centralization_q_5_k_100",
  },
  {
    name: "Transporte",
    description: "El 45% de los desplazamientos en Monterrey son viajes al trabajo, casi la mitad en automóvil, con la particularidad de que la mitad se hace con una sola persona. Los residentes invierten en promedio 50 minutos por viaje redondo en auto, equivalente a doce días al año. El transporte público requiere mejoras; las personas pasan en promedio 70 minutos al día en él, con un tercio experimentando viajes de 3 horas diarias. El 40% de los traslados vienen de la periferia, como Apodaca, Escobedo, García y Juárez, mientras que el 26% se dirige a Monterrey. Solo el 21% utiliza transporte público y un 19% se traslada caminando. Es esencial expandir el acceso al transporte público y mejorar la infraestructura para contrarrestar el impacto negativo en la salud pública y el medio ambiente por el elevado número de viajes en automóvil.",
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte.geojson",
    column: "Regreso A Casa",
  },
  ,
  {
    name: "Mancha urbana",
    description: "Capa de mancha urbana", 
    url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/mancha_urbana.geojson",
    column: "year"
  }
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

  const mapContainerRef = useRef();
  const deckRef = useRef();
  const mapRef = useRef();

  // This function interpolates between blue and red based on the normalized value.
  function colorInterpolate(value, alpha = 1) {
    // Assuming value is normalized (0 to 1)
    const red = Math.round(255 * value);
    const blue = 255 - red;
    const green = 0; // No green component

    // Return as RGBA
    return [red, green, blue, 255 * alpha];
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
            return colorInterpolate(normalizedValue); // Apply your color interpolation function here
          },
          getLineColor: [255, 255, 255, 255],
          getLineWidth: 10,
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

  /* 
  const handleDownloadImage = useCallback(() => {
    if (isMapLoaded && deckRef.current && mapRef.current) {
      const mapboxCanvas = mapRef.current.getMap().getCanvas();
      const deckCanvas = deckRef.current.deck.canvas;

      let mergeCanvas = document.createElement("canvas");
      mergeCanvas.width = mapboxCanvas.width;
      mergeCanvas.height = mapboxCanvas.height;

      const context = mergeCanvas.getContext("2d");
      context.drawImage(mapboxCanvas, 0, 0);
      context.drawImage(deckCanvas, 0, 0);

      mergeCanvas.toBlob((blob) => {
        FileSaver.saveAs(blob, `${selectedMap.name}.png`);
      });
    }
  }, [isMapLoaded, selectedMap.name]);
*/
const togglePanel = (name) => {
  setExpandedPanels((prev) => {
    if (prev.includes(name)) {
      return prev.filter((panel) => panel !== name);
    } else {
      return [...prev, name];
    }
  });
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
    <AccordionPanel pb={4}>{description}</AccordionPanel>
  </AccordionItem>
);

export default DescargaDatos;
