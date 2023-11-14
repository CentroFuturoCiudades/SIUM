import { useEffect, useState, useMemo } from "react";
import { Box } from "@chakra-ui/react";

import { Sidebar, sectionsInfo } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CustomMap, INITIAL_STATE } from "./components/CustomMap";
import { ExpansionUrbanaCard } from "./components/ExpansionUrbanaCard";
import { TransporteCard } from "./components/TransporteCard";
import { EmpleoCard } from "./components/EmpleoCard";
import { ViviendaCard } from "./components/ViviendaCard";
import { SegregacionCard } from "./components/SegregacionCard";
import { DelincuenciaCard } from "./components/DelincuenciaCard";
import { CostosCard } from "./components/CostosCard";
import { geojsonsMapping } from "./utils/constants";
import "./index.css";
import * as d3 from 'd3';
//import { isMobile } from "./util/mobile";
//import { TripsLayer } from "@deck.gl/geo-layers";
//import { StaticMap } from "react-map-gl";

const isSectionInView = (section) => {
  const { top, bottom } = section.getBoundingClientRect();
  const midScreen = window.innerHeight * 0.5;

  return (
    (top > 0 && top <= midScreen) ||
    (bottom > midScreen && bottom <= window.innerHeight)
  );
};

const getCurrentSectionId = () => {
  const sections = document.querySelectorAll("section");
  const currentSection = Array.from(sections).find(isSectionInView);

  return currentSection ? currentSection.id : null;
};

const getSectionFromURL = () => {
  return window.location.hash?.replace("#", "") || null;
};

export default function App() {
  // Estado para manejar los datos filtrados
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [outline, setOutline] = useState(null);
  const [currentSection, setCurrentSection] = useState("expansion-urbana");
  const currentInfo = sectionsInfo[currentSection];
  const currentLayer = geojsonsMapping[currentSection]
    ? geojsonsMapping[currentSection]
    : null;
  const extraLayers = outline ? [outline] : []; // Change in layer
  const layers = currentLayer
    ? [currentLayer, ...extraLayers]
    : [...extraLayers];
  const [time, setTime] = useState(0); //el time que se va a mandar a filterdata de la const de TRANSPORTE_JEANNETTE2
  const [originalData, setOriginalData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Nuevo estado para manejar la reproducción

 

  useEffect(() => {
    const handleScroll = () => {
      const detectedSectionId = getCurrentSectionId();
      const currentHash = getSectionFromURL();

      if (detectedSectionId && detectedSectionId !== currentHash) {
        setCurrentSection(detectedSectionId);
        window.history.replaceState(null, null, `#${detectedSectionId}`);
      }
    };

    window.document.body.addEventListener("scroll", handleScroll);

    return () =>
      window.document.body.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentSection) {
      setViewState(INITIAL_STATE);
      console.log("Se volvio a crear el map")
    }
  }, [currentSection]);

  useEffect(() => {
    const sectionFromURL = getSectionFromURL();
    if (sectionFromURL) {
      const el = document.getElementById(sectionFromURL);
      if (el) {
        setCurrentSection(sectionFromURL);
        el.scrollIntoView();
      }
    }
  }, []);

  //nuevo jeannette
  const handleSliderChange = (event) => {
    const newTime = event.target.value; //Se obtiene el valor del tiempo del slider
    console.log("New Time:", newTime); //checar que valor tiene el slider
    setTime(newTime); //actualiza el estado de 'time' con el nuevo valor
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Lógica para cargar el GeoJSON desde un archivo
    fetch("data/TRANSPORTEJEANNETTE.geojson")
      .then(response => response.json())
      .then(data => setOriginalData(data))
      .catch(error => console.error("Error cargando el GeoJSON:", error));
  }, []); // Esto se ejecutará solo una vez al montar el componente

  // Función de transformación y filtrado de datos
  const transformData = (data, time) => {
    const lineStringGenerator = d3.line();
  
    const transformedData = data.features.map((feature) => {
      const horaOri = feature.properties.HoraOri.split(":");
      const horaDest = feature.properties.HoraDest.split(":");
      const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
      const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);
  
      const timeInMinutes = time * 10;
  
      if (
        (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
        (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
      ) {
        const startCoords = feature.geometry.coordinates[0];
        const endCoords = feature.geometry.coordinates[feature.geometry.coordinates.length - 1];
  
        const numPoints = 100;
        const factor = 0.1;
        const arcPoints = Array.from({ length: numPoints }, (_, i) => {
          const t = i / (numPoints - 1);
          const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
          const y = startCoords[1] + factor * Math.sin(Math.PI * t);
  
          return [x, y, 0];
        });
  
        const coordinates = arcPoints.map(([lon, lat, altitude]) => [lon, lat, altitude]);
        const lineString = lineStringGenerator(coordinates);
  
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
  
    return { ...data, features: filteredData };
  };
  
  // En tu componente TransporteCard
  const primaryRoutesLayer = useMemo(() => {
    // ...
    if (!originalData) {
      return null;
    }
  
    const filteredData = transformData(originalData, time);
  
    return {
      id: "primary_routes",
      data: filteredData,
      getLineColor: [100, 100, 100, 200],
      getLineWidth: 150,
    };
  }, [originalData, time]);

  // Agregar la capa específica de transporte si es la sección actual
  //const currentSection = "transporte";
  const modifiedLayers = layers.map((layer) =>
    layer.id === "primary_routes" ? (primaryRoutesLayer ? primaryRoutesLayer : []) : layer
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar section={currentSection} setSection={setCurrentSection} />
      <div className="cardsContainer">
        <Header
          section={currentSection}
          color={currentInfo.color}
          title={currentInfo.title}
        />
        <ExpansionUrbanaCard setOutline={setOutline} />
        <EmpleoCard setOutline={setOutline} />
        <TransporteCard setOutline={setOutline} handleSliderChange={handleSliderChange} time={time} />
        <ViviendaCard setOutline={setOutline} />
        <SegregacionCard setOutline={setOutline} />
        <DelincuenciaCard setOutline={setOutline} />
        <CostosCard setOutline={setOutline} />
        <div>
          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
      <Box
        className="mapContainer"
        borderColor={`${sectionsInfo[currentSection].color}.500`}
      >
        <CustomMap
          //key={time} // Agrega una key que cambia con el tiempo
          viewState={viewState}
          setViewState={setViewState}
          /*layers={layers.map(layer => layer.id === "primary_routes" ? { //solo para la layer de primary_routes (osea la de transporte)
            ...layer,
            dataTransform: (d) => layer.dataTransform(d, time) //se pasa el valor de 'time' a dataTransform
          } : layer)}*/
          //layers={layers}  // Pasar las capas actualizadas directamente
          //layers={primaryRoutesLayer ? [primaryRoutesLayer] : []}
          layers={modifiedLayers}
          handleSliderChange={handleSliderChange} 
          time={time}
          isPlaying={isPlaying} // Pasa el estado de reproducción al componente CustomMap

        />
      </Box>
    </div>
  );
}
