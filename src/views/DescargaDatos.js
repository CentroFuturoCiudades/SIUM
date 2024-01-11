import React, { useCallback, useRef, useState } from 'react';
import { Box, Button, Flex, Heading, VStack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spacer, Text } from '@chakra-ui/react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl';
import { GeoJsonLayer } from '@deck.gl/layers';
import FileSaver from 'file-saver';

const datosMapas = [
    {name: "Periferia", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson", column: "CVEGEO"},
    {name: "Transporte", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte-masivo.geojson", column: "MultiLineString"},
    {name: "Segregacion", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/pobres.geojson", column: "income_pc"},
    {name: "Crecimiento", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson", column: "income_pc"},
    {name: "Empleo", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2010_Municipios_Geo2.json", column: "income_pc"},
    {name: "Vivienda", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson", column: "income_pc"},
    {name: "Segregacion", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson", column: "income_pc"},
    {name: "Delicuencia", description: "lorem ipsun", url: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson", column: "income_pc"},
  ]

  const INITIAL_VIEW_STATE = {
    latitude: 25.675,
    longitude: -100.286419,
    zoom: 9.6,
    pitch: 0,
    bearing: 0,
  };

  const DescargaDatos = () => {
    // Estado para el mapa seleccionado
    const [selectedMap, setSelectedMap] = useState(datosMapas[0]);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapContainerRef = useRef();
    const deckRef = useRef();
    const mapRef = useRef();

    // Función para manejar la descarga del archivo GeoJSON
    const handleDownload = async (map) => {
      const response = await fetch(map.url);
      if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${map.name}.geojson`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('No se pudo descargar el archivo GeoJSON.');
      }
    };

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
  
        mergeCanvas.toBlob(blob => {
          FileSaver.saveAs(blob, `${selectedMap.name}.png`);
        });
      }
    }, [isMapLoaded, selectedMap.name]);
  

    const layer = new GeoJsonLayer({
      id: 'geojson-layer',
      data: selectedMap.url,
      filled: true,
      stroked: true,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: [0, 0, 0, 255],
    });
  
    return (
      <Flex h="100vh" direction={{ base: 'column', md: 'row' }}>
        {/* Contenedor de categorías a la izquierda */}
        <VStack w={{ base: 'full', md: '250px' }} p="5" boxShadow="xl" align="stretch" spacing={5}>
          <Heading size="md">Categorías</Heading>
          <Accordion allowToggle flex="1" overflowY="auto">
            {datosMapas.map((map) => (
              <CategoriaItem
                key={map.name}
                title={map.name}
                description={map.description}
                onDownload={() => setSelectedMap(map)}
              />
            ))}
          </Accordion>
          {/* Botones de descarga al pie de las categorías */}
          <Flex direction="column" w="full" mt="auto">
            <Button colorScheme="blue" mb={2} onClick={() => handleDownload(selectedMap)}>
              Descargar GeoJSON
            </Button>
            {/* El botón para descargar como imagen no está implementado */}
            <Button colorScheme="teal" onClick={handleDownloadImage}>
              Descargar como Imagen
            </Button>
          </Flex>
        </VStack>
  
        {/* Área de contenido a la derecha */}
        <Box className="mapContainer" flex="1" p="5" ref={mapContainerRef}>
        <DeckGL
        ref={deckRef}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          layers={[layer]}
          controller={true}
          onLoad={() => setIsMapLoaded(true)}
          id="deck-gl-canvas"
        >
          <Map 
            ref={mapRef}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken="pk.eyJ1IjoidXJpZWxzYTk2IiwiYSI6ImNsbnV2MzBkZDBlajYya211bWk2eTNuc2MifQ.ZnhFC3SyhckuIQBLO59HxA"
          />
        </DeckGL>
        <Spacer />
        <Text mb="5">Mapa de: {selectedMap.name}</Text>
      </Box>
      </Flex>
    );
  };
  
  const CategoriaItem = ({ title, description, onDownload }) => (
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: 'blue.100' }} onClick={onDownload}>
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {description}
      </AccordionPanel>
    </AccordionItem>
  );
   
export default DescargaDatos;
