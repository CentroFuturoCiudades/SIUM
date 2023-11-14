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
import { TripsLayer } from "@deck.gl/geo-layers";
import { Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

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
  //VARIABLES JEANNETTE NUEVAS
  const [time, setTime] = useState(0); //el tiempo que filtra los datos
  const [originalData, setOriginalData] = useState(null); //data que va a ser la de la layer
  const [isPlaying, setIsPlaying] = useState(false); //var de estado para manejar el play de la animacion
  const [animationTime, setAnimationTime] = useState(0); //tiempo cambiante de la animacion
  
 

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

  //****************************CONSTANTES JEANNETTE (a partir de aqui)
  //para el slider (sigo trabajando con poner el de chakra pero me da un errorsillo)
  const handleSliderChange = (event) => {
    const newTime = event.target.value; //obtiene el valor del tiempo del slider
    console.log("New Time:", newTime); //checar que valor tiene el slider
    setTime(newTime); //actualiza el estado de 'time' con el nuevo valor
    setAnimationTime(newTime); 
    setIsPlaying(false); //pausa la animación al cambiar manualmente el slider
  };

  //para la animacion
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAnimationTime(time); //inicia la animación desde la posición actual del slider
  };

  //esto para el cambio del tiempo y la animacion (no funciona yet)
  useEffect(() => {
    let animationFrame;
  
    const animate = () => {
      setAnimationTime((prevTime) => (prevTime + 1) % 144);
      animationFrame = requestAnimationFrame(animate);
    };
  
    if (isPlaying) {
      animate();
    } else {
      cancelAnimationFrame(animationFrame);
    }
  
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  //Lectura del geoJSON de transporte
  useEffect(() => {
    // Lógica para cargar el GeoJSON desde un archivo
    fetch("data/TRANSPORTEJEANNETTE.geojson")
      .then(response => response.json())
      .then(data => setOriginalData(data))
      .catch(error => console.error("Error cargando el GeoJSON:", error));
  }, []); // Esto se ejecutará solo una vez al montar el componente

  //Transformación y filtrado de datos
  const transformData = (data, time) => {
    //solo un catch porq en una de mis pruebas me dio error (pero creo que si se quita no pasa nada)
    if (!data || !data.features) {
      return { ...data, features: [] };
    }
    const lineStringGenerator = d3.line();
  
    const transformedData = data.features.map((feature) => {
      const horaOri = feature.properties.HoraOri.split(":");
      const horaDest = feature.properties.HoraDest.split(":");
      const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
      const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);
  
      const timeInMinutes = time * 10;
  
      //Filtrado del tiempo
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
  
          return [x, y, 0]; //puse el 0 de por mientras
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
  
    return { ...data, features: filteredData, transformedData };
  };
  
  //Esto es los datos finales del geoJSON de transporte filtrados
  const primaryRoutesLayer = useMemo(() => {
    if (!originalData) {
      return null;
    }
  
    const filteredData = transformData(originalData, time);
    console.log("Los datos filtrados para manual",filteredData)
  
    return {
      id: "primary_routes",
      data: filteredData,
      getLineColor: [100, 100, 100, 200],
      getLineWidth: 150,
    };
  }, [originalData, time]);



  //console.log("Transformed Data:", transformedData);
  //console.log("Filtered Data:", filteredData);

  /*const modifiedLayers = layers.map((layer) =>
    //layer.id === "primary_routes" ? (primaryRoutesLayer ? primaryRoutesLayer : []) : layer
    layer.id === "primary_routes" ? (primaryRoutesLayer ? primaryRoutesLayer : []) : layer
  );*/


  const convertToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  //Aqui checa que layer va
  const modifiedLayers = layers.map((layer) => {
    if (layer.id === 'primary_routes' && isPlaying) { //el primer if es para la animacion (pero aun tengo errores)
      //agrega la capa de arcos solo si es la capa primaryRoutesLayer y está reproduciéndose
      const filteredData = transformData(originalData, animationTime);
      //console.log("Los datos filtrados para trip layer", filteredData)
      console.log("Current animation time:", animationTime); // Agrega esta línea

      const arcsLayer = new TripsLayer({
        id: 'trips',
        data: filteredData, // Usa filteredData en lugar de transformedData
        getPath: (d) => d.geometry.coordinates, // Usa las coordenadas directas del GeoJSON
        getColor: [100, 100, 100, 200],
        getWidth: 150,
        currentTime: animationTime, // Pasa el tiempo actual
        trailLength: 50, // Longitud de la estela
        getTimestamps: (d) => [
          convertToMinutes(d.properties.HoraOri),
          convertToMinutes(d.properties.HoraDest),
        ],
        loopLength: 144, // Longitud del bucle en segundos
        animationSpeed: 1, // Velocidad de la animación
      });
      return arcsLayer;
    } 
    else if(layer.id === 'primary_routes' && !isPlaying) //si es la de primary_routes pero esta manual con el slider
    {
      return primaryRoutesLayer ? primaryRoutesLayer : [] //pone los datos de primaryRoutesLayer
    }
    
    else {
      //sino usa las otras capas tal como están
      return layer;
    }
  });

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
      </div>
      <Box
        className="mapContainer"
        borderColor={`${sectionsInfo[currentSection].color}.500`}
      >
        <div>
          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

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
          layers={modifiedLayers} //esto es lo que checa que capa va
          handleSliderChange={handleSliderChange} 
          time={time}
          isPlaying={isPlaying} // Pasa el estado de reproducción al componente CustomMap
          togglePlay={togglePlay}
        />
      </Box>
    </div>
  );
}
