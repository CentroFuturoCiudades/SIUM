import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle } from "./Card";
import {
  useFetch,
} from "../utils/constants";
import {
  CustomLegendArroyo,
  LegendItem,
  LegendTwoToneItem,
  LegendXItem,
  LegendLineItem
} from "./CustomLegend.js";
import { useMediaQuery} from "@chakra-ui/react";
import { GeoJsonLayer, TripsLayer, IconLayer, HeatmapLayer, DeckGL, ScatterplotLayer, TextLayer } from "deck.gl";
import { Treemap, ResponsiveContainer, Tooltip, Label} from 'recharts';
import {CollisionFilterExtension} from '@deck.gl/extensions';
import { Map } from "react-map-gl";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls.js";
import { animate } from "popmotion";
import DefaultTooltip from "./Tooltip";
import supercluster from 'supercluster';
import { ResponsiveFunnel } from "@nivo/funnel";
import * as d3 from "d3";

const legend = {
  arroyo: [{
    latitude: 25.6485,
    longitude: -100.295,
    zoom: 14,
    transitionDuration: 500,
    minZoom: 14,
    maxZoom: 20,
  }],
  tramo1: [
    {
    latitude: 25.64095,
    longitude: -100.31199,
    zoom: 16.15,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20,
  },
  {
    latitude: 25.640818214446263,
    longitude: -100.31223085,
    zoom: 16.25,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20
},
{
  latitude: 25.64070215835306,
  longitude: -100.31071809999999,
  zoom: 17.25,
  transitionDuration: 500,
  minZoom: 16.15,
  maxZoom: 20
},
{
  latitude: 25.640593809683946,
  longitude: -100.31161115000002,
  zoom: 16.85,
  transitionDuration: 500,
  minZoom: 16.15,
  maxZoom: 20
},
{
  latitude: 25.643034002555254,
  longitude: -100.31113314999999,
  zoom: 17.8,
  transitionDuration: 500,
  minZoom: 16.15,
  maxZoom: 20
}

],
  tramo2: [{
    latitude: 25.640122,
    longitude: -100.3018,
    zoom: 16.15,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20,
  
  },
  {
    latitude: 25.64014860434079,
    longitude: -100.3028934,
    zoom: 17.5,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20
},
{
    latitude: 25.63991645258668,
    longitude: -100.3028719,
    zoom: 17.8,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20
},
{
    latitude: 25.640170354871604,
    longitude: -100.30288265,
    zoom: 17.4,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20
},
{
    latitude: 25.642270001207088,
    longitude: -100.29830795,
    zoom: 17.9,
    transitionDuration: 500,
    minZoom: 16.15,
    maxZoom: 20
}


],
  tramo3: [{
    latitude: 25.644,
    longitude: -100.286,
    zoom: 15.15,
    transitionDuration: 500,
    minZoom: 15.15,
    maxZoom: 20,
  },
  {
    latitude: 25.641976563068056,
    longitude: -100.2915,
    zoom: 16.25,
    transitionDuration: 500,
    minZoom: 15.15,
    maxZoom: 20
},
{
    latitude: 25.641976563068056,
    longitude: -100.2933,
    zoom: 16.75,
    transitionDuration: 500,
    minZoom: 15.15,
    maxZoom: 20
},
{
    latitude: 25.64875497548667,
    longitude: -100.27739520000002,
    zoom: 15.9,
    transitionDuration: 500,
    minZoom: 15.15,
    maxZoom: 20
},
{
    latitude: 25.641976563068056,
    longitude: -100.29333600000001,
    zoom: 16.5,
    transitionDuration: 500,
    minZoom: 15.15,
    maxZoom: 20
}


]
};



export const ArroyoVivoControls = () => {
  const { data } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/mty_buildings_heights.geojson");
  const { data: arroyo_anim } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo_vivo_flow.json");
  const { data: sedimentos } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/sedimentos.geojson");
  const { data: arroyo } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo_vivo.geojson");
  const { data: aguas_pluviales } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/agua_pluvial_flow.json");
  const { data: grises } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/aguas_grises_flow.json");
  const { data: negras } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/aguas_negras_flow.json");
  const { data: aguas_pluviales_point } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/agua_pluvial.geojson");
  const { data: grises_point } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/aguas_grises.geojson");
  const { data: negras_point } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/aguas_negras.geojson");
  const { data: tiraderos } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/tiraderos.geojson");
  const { data: tramo2 } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/campana_tec.geojson");
  const { data: tramo1 } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/altamira_tec.geojson");
  const { data: tramo3 } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/distrito_tec.geojson");
  const { data: marine_debris } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/marine_debris.geojson");
  const { data: rio_la_silla } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/rio_la_silla.geojson");
  const { data: rio_la_silla_point } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/silla_point.geojson");
  const { data: santa_catarina } = useFetch("https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/santa_catarina_point.geojson");
  const [hoverInfo, setHoverInfo] = useState();
  const [processedNegras, setProcessedNegras] = useState([]);
  const [processedGrises, setProcessedGrises] = useState([]);
  const [processedPluviales, setProcessedPluviales] = useState([]);
  const { color,setTreemapData, activeJornada, setActiveJornada, activeButton, setActiveButton, tramo1_data, tramo2_data,tramo3_data, setTramo1, setTramo2, setTramo3, setHoveredPolygon} = useCardContext();
  setTramo1(tramo1)
  setTramo2(tramo2)
  setTramo3(tramo3)
  const [tramo1_Polygon, setTramo1_Polygon] = useState(tramo1)
  const [tramo2_Polygon, setTramo2_Polygon] = useState(tramo2)
  const [tramo3_Polygon, setTramo3_Polygon] = useState(tramo3)
  const [time, setTime] = useState(0);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false); // New state for tracking animation status
  const [viewState, setViewState] = useState({
    latitude: 25.6465,
    longitude: -100.295,
    zoom: 14.25,
    transitionDuration: 500,
    minZoom: 14.25,
    maxZoom: 20,
  });

  const collisionFilter = new CollisionFilterExtension({ 
    radius: 10,
    enabled: true
  });

  const colors = {
    "Plásticos en general": "#650046",
    "Llantas": "#A40034",
    "Textiles (incluyendo ropa, telas, zapatos)": "#E3001E",
    "Aluminio y metal": "#FFCB00",
    "Vidrio": "#FD8A05",
    "Residuos de construcción/materiales de construcción": "#EF5606"
  };
  const layers = [
    "Plásticos en general",
    "Llantas",
    "Textiles (incluyendo ropa, telas, zapatos)",
    "Aluminio y metal",
    "Vidrio",
    "Residuos de construcción/materiales de construcción"
  ]

  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }
  const [clusters, setClusters] = useState([]);
  const [zoom, setZoom] = useState(viewState.zoom);

  useEffect(() => {
    if (marine_debris) {
      const classificationClusters = {};

      Object.keys(colors).forEach(classification => {
        const index = new supercluster({
          radius: 30,
          maxZoom: 18,
        });

        const dataToLoad = marine_debris.features
          .filter(feature => feature.properties['Clasificación Grande'] === classification)
          .map(feature => ({
            geometry: {
              coordinates: feature.geometry.coordinates
            },
            properties: {
              ...feature.properties,
              color: colors[classification] || '#000000'
            }
          }));

        index.load(dataToLoad);
        classificationClusters[classification] = index;
      });

      const allClusters = Object.keys(classificationClusters).flatMap(classification => {
        return classificationClusters[classification].getClusters(
          [-180, -85, 180, 85], zoom
        ).map(cluster => ({
          ...cluster,
          classification
        }));
      });

      setClusters(allClusters);
    }
  }, [marine_debris, zoom]);


  const loopLength = 11500;
  const animationSpeed = 75;
  const trailLength = 2370;
  useEffect(() => {
    const animation = animate({
      from: 0,
      to: loopLength,
      duration: (loopLength * 60) / animationSpeed,
      repeat: 0,
      onUpdate: setTime,
      onComplete: () => setIsAnimationFinished(true)
    });
    return () => animation.stop();
  }, [loopLength, animationSpeed]);

  useEffect(() => {
    if (aguas_pluviales_point) {
      const esc = aguas_pluviales_point.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#80533e",
      }));
      setProcessedPluviales(esc);
    }
  }, [aguas_pluviales_point]);

  useEffect(() => {
    if (negras_point) {
      const esc = negras_point.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#000000",
      }));
      setProcessedNegras(esc);
    }
  }, [negras_point]);

  useEffect(() => {
    if (grises_point) {
      const esc = grises_point.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#617183",
      }));
      setProcessedGrises(esc);
    }
  }, [grises_point]);

    useEffect(() => {
    if (activeJornada != "Tramo Completo" )
      {
        setActiveJornada("Tramo Completo")
        setTramo1_Polygon(tramo1);
        setTramo2_Polygon(tramo2);
        setTramo3_Polygon(tramo3);

      }
    console.log(activeButton,activeJornada)
    
  }, [activeButton]);

  useEffect(() => {
    let index;
    if (activeButton === "arroyo"){
      index = 0
      setActiveJornada("Tramo Completo")
      setTramo1_Polygon(tramo1);
      setTramo2_Polygon(tramo2);
      setTramo3_Polygon(tramo3);
    }
    else{
      index = activeJornada === "1ra Jornada" ? 1 :  activeJornada === "2da Jornada" ? 2 :  activeJornada === "3ra Jornada" ? 3 :  activeJornada === "4ta Jornada" ? 4 : 0 
    }
    setViewState(legend[activeButton][index])
  }, [viewState, activeButton, activeJornada]);

  /* useEffect(() => {
    if (tiraderos) {
      const finalData = tiraderos.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#ffffff",
      }));
      setProcessedTiraderos(finalData);
    }
  }, [tiraderos]); */

    useEffect(() => {
    let filteredData = [{
      "properties": {
        "Periodo": "Julio 2022 a Abril 2024",
        "Residuos Removidos": 21664.64,
        "Residuos Mezclados": 10899.39,
        "Planta Invasora": 2870.87,
        "Escombro": 88906,
        "PET": 591.52,
        "Otros plásticos": 93.25,
        "Metal": 21,
        "Vidrio": 635.1,
        "Textil": 2404.48,
        "Cartón": 14.8,
        "Aluminio": 2.3,
        "Llantas": 1072.9,
        "Muebles": 1687.89,
        "Electrónicos": 163.6,
      },
    }];
  
    let activeTramo = activeButton === "tramo1" ? tramo1: activeButton === "tramo2" ? tramo2 : activeButton === "tramo3" ? tramo3 : tramo1;
  
    if (activeButton !== "arroyo") {
      activeTramo = activeButton === "tramo1" ? tramo1_data
                    : activeButton === "tramo2" ? tramo2_data
                    : activeButton === "tramo3" ? tramo3_data
                    : null;
    }
  
    if (activeTramo && activeTramo.features && activeTramo.features.length > 0) {
      if (activeJornada !== "Tramo Completo") {
        const jornadaFilteredData = activeTramo.features.filter(feature => 
          feature.properties && feature.properties.Jornada === activeJornada
        );
        
        if (jornadaFilteredData.length > 0) {
          filteredData = jornadaFilteredData;
          if (activeButton === "tramo1"){
            const filteredPolygon = activeTramo.features.filter(feature => 
              feature.properties.Jornada === activeJornada
            );
            setTramo1_Polygon(filteredPolygon);
          }
          if (activeButton === "tramo2"){
            const filteredPolygon = activeTramo.features.filter(feature => 
              feature.properties.Jornada === activeJornada
            );
            setTramo2_Polygon(filteredPolygon);
          }
          if (activeButton === "tramo3"){
            const filteredPolygon = activeTramo.features.filter(feature => 
              feature.properties.Jornada === activeJornada
            );
            setTramo3_Polygon(filteredPolygon);
          }
        }
        
      } else {
        let summedProperties = activeTramo.features.reduce((acc, feature) => {
          const properties = feature.properties;
          for (let key in properties) {
            if (typeof properties[key] === 'number') {
              acc[key] = (acc[key] || 0) + properties[key];
            }
          }
          return acc;
        }, {});

        filteredData = [{ properties: summedProperties }];
  
        setTramo1_Polygon(tramo1);
        setTramo2_Polygon(tramo2);
        setTramo3_Polygon(tramo3);
      }
    }
  
    if (filteredData.length > 0) {

      setTreemapData(filteredData[0].properties);
      setHoveredPolygon(filteredData[0].properties);
    }
  
  }, [activeButton, activeJornada]);
  


  if (!data) return <Loading />;

  

  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        initialViewState={viewState}
        controller={true}
        onViewStateChange={({ viewState }) => {setZoom(viewState.zoom)}}
      >

        <Map
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/lameouchi/clvboacrd041l01pk9gyf4yve"
          mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        />

        <GeoJsonLayer
          id="silla_layer"
          data={rio_la_silla}
          opacity={1}
          getLineColor={[136,159,206]}
          lineWidthScale={30}
        />

        <GeoJsonLayer
          id="arroyo_layer"
          data={arroyo}
          opacity={1}
          getLineColor={[52, 152, 219,65]}//{[136,159,206]}//{[52, 152, 219]}
          lineWidthScale={30}
        />

        <GeoJsonLayer
          id="distrito_layer"
          data={data}
          opacity={0.25}
          getFillColor={[160, 160, 160]}
          getLineColor={[0, 0, 0, 0]}
          lineWidthScale={7.5}
        />


        {activeButton === "tramo1" ? 
        <>
       
        
        <GeoJsonLayer
          id="tramo1"
          data={tramo1_Polygon}
          opacity={1}
          filled={false}
          getLineColor={[56, 56, 56, 125]}
          lineWidthScale={4}
          lineWidthUnits={"meters"}
          lineWidthMinPixels={1}
          lineWidthMaxPixels={4}
        />
    
        </>
         : <></>}

        {activeButton === "tramo2" ? 
        
        <>
        
        
        <GeoJsonLayer
          id="tramo2"
          data={tramo2_Polygon}
          opacity={1}
          filled={false}
          getLineColor={[56, 56, 56, 179]}
          lineWidthScale={10}
          lineWidthUnits={"meters"}
          lineWidthMinPixels={1}
          lineWidthMaxPixels={10}
        />

        

         

        </>
        
        
       : <></>}

        {activeButton === "tramo3" ? 

          <>
          <GeoJsonLayer
            id="tramo3"
            data={tramo3_Polygon}
            opacity={1}
            filled={false}
            getLineColor={[56, 56, 56, 179]}
            lineWidthScale={10}
            lineWidthUnits={"meters"}
            lineWidthMinPixels={1}
            lineWidthMaxPixels={10}
          />

          
           
          </>
          : <></>}
  {activeButton === "arroyo" ? <></> : <>
          {clusters ?
            <>
            {/* Filtrar por poligono */}
              {Object.keys(colors).map(classification => {
                const color = hex2rgb(colors[classification]);
                return <ScatterplotLayer
                  id={`scatterplot-${classification}`}
                  data={clusters.filter(d => d.classification === classification)}
                  getPosition={d => d.geometry.coordinates}
                  getFillColor={color}
                  getRadius={d => {
                    const radius = d.properties.point_count ? ((d.properties.point_count)) * (zoom * 0.0075) : 1;
                    return radius;
                  }}
                  pickable={true}
                  onHover={info => setHoverInfo(info)}
                />
              })}
            </>
            : <></>
          }
        </>
        }

        {activeButton === "arroyo" ? <>
          <TripsLayer
            id="flow_layer"
            data={arroyo_anim}
            getPath={d => d.path}
            getTimestamps={d => d.timestamps}
            getColor={[162, 209, 211]}
            opacity={0.50}
            widthMinPixels={10}
            trailLength={trailLength}
            currentTime={time}
            shadowEnabled={false}
          />
          <TripsLayer
            id="pluvial_flow_layer"
            data={aguas_pluviales}
            getPath={d => d.path}
            getTimestamps={d => d.timestamps}
            getColor={[	164, 0, 52, 155]}
            opacity={0.15}
            widthMinPixels={10}
            trailLength={trailLength}
            currentTime={time}
            shadowEnabled={true}
          />
          <TripsLayer
            id="grises_flow_layer"
            data={grises}
            getPath={d => d.path}
            getTimestamps={d => d.timestamps}
            getColor={[	255, 85, 0, 155]}
            opacity={0.15}
            widthMinPixels={10}
            trailLength={trailLength}
            currentTime={time}
            shadowEnabled={true}
          />
          <TripsLayer
            id="negras_flow_layer"
            data={negras}
            getPath={d => d.path}
            getTimestamps={d => d.timestamps}
            getColor={[19, 22, 25, 155]}
            opacity={0.9}
            widthMinPixels={10}
            trailLength={trailLength}
            currentTime={time}
            shadowEnabled={true}
          />
          
          <GeoJsonLayer
            id="sedimentos_layer"
            data={sedimentos}
            opacity={0.35}
            getFillColor={[57,53,60]}
            lineWidthScale={0}
          />
        </>
          : <></>}

          {(activeButton === "arroyo" && isAnimationFinished ===true) ? <>
            <HeatmapLayer
            id="tiraderos_heatmap"
            data={tiraderos.features}
            getPosition={(d) => d.geometry.coordinates}
            colorRange={[
              [241, 234, 255, 255],  
              [219, 201, 255, 255],    
              [196, 168, 255, 255],    
              [163, 128, 238, 255],  
              [147, 104, 228, 255],
              [131, 81, 218, 255],  
            ]}
            radiusPixels={20}
            intensity={1}
            opacity={0.5}
            aggregation={"MEAN"}
          />
          <IconLayer
            id="pluviales"
            data={processedPluviales}
            getPosition={d => d.position}
            iconAtlas="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-icon.png"
            iconMapping="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-materiales.json"
            getIcon={d => `${d.color}`}
            sizeUnits={"meters"}
            sizeScale={2}
            sizeMinPixels={0.0001}
            sizeMaxPixels={40}
            getSize={d => 30}
            extensions={[new CollisionFilterExtension()]}
            collisionGroup={'contaminacion'}
            collisionTestProps={{radiusScale: 5}}
            collisionEnabled={true}
            alphaCutoff={-1}  
            anchorY={124}
            opacity={100}
          />
        <IconLayer
          id="grises"
          data={processedGrises}
          getPosition={d => d.position}
          iconAtlas="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-icon.png"
          iconMapping="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-materiales.json"
          getIcon={d => `${d.color}`}
          sizeUnits={"meters"}
          sizeScale={2}
          sizeMinPixels={0.0001}
          sizeMaxPixels={40}
          getSize={d => 30}
          extensions={[new CollisionFilterExtension()]}
          collisionGroup={'contaminacion'}
          collisionTestProps={{radiusScale: 5}}
          collisionEnabled={true}
          alphaCutoff={-1}
          anchorY={248}
          opacity={100}
        />
        <IconLayer
          id="negras"
          data={processedNegras}
          getPosition={d => d.position}
          iconAtlas="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-icon.png"
          iconMapping="https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo-vivo-materiales.json"
          getIcon={d => `${d.color}`}
          sizeUnits={"meters"}
          sizeScale={2}
          sizeMinPixels={0.0001}
          sizeMaxPixels={40}
          getSize={d => 30}
          extensions={[new CollisionFilterExtension()]}
          collisionGroup={'contaminacion'}
          collisionTestProps={{radiusScale: 5}}
          collisionEnabled={true}
          alphaCutoff={-1}
          anchorY={372}
          opacity={100}
          
        />
        
      </> : <></>}
   
    <TextLayer
    id="text-layer-catarina"
    data={santa_catarina.features}
    getPosition={d => d.geometry.coordinates}  
    getText={d => "Río Santa Catarina"}
    getSize={d => 15} 
    getAngle={d => -12}
    getColor={d => [163, 163, 164]}
    outlineWidth={7.5}
  outlineColor={[248,248,248, 255]}
  fontSettings={{ sdf: true }} 

    characterSet={['R', 'í', 'o', ' ', 'S', 'a', 'n', 't',"a", 'C',"a","t","a","r","i","n","a"]}
    fontFamily="Roboto Mono"
    getTextAnchor="middle"
    getAlignmentBaseline="center"

  />
      <TextLayer
    id="text-layer"
    data={rio_la_silla_point.features}
    getPosition={d => d.geometry.coordinates}  
    getText={d => "Río La Silla"} 
    getSize={d => 15} 
    getAngle={d => -40}
    getColor={d => [163, 163, 164]}
    characterSet={['R', 'í', 'o', ' ', "L","a", " ", "S", "i", "l", "l","a"]}
    fontFamily="Roboto Mono"
    getTextAnchor="middle"
    getAlignmentBaseline="center"
    outlineWidth={7.5}
  outlineColor={[248,248,248, 255]}
  fontSettings={{ sdf: true }} 
    
  />
  
        

        {hoverInfo && hoverInfo.object && (
          <DefaultTooltip hoverInfo={hoverInfo}>
            {hoverInfo.object.properties.cluster ? (
              <>
                <span className="tooltip-label">
                <b>Material Principal:</b> {hoverInfo.object.classification}
                   
                </span>
                <span className="tooltip-label">
                <b>Tamaño:</b> {hoverInfo.object.properties.point_count} elementos
                </span>
              </>
            ) : (
              <>
                {hoverInfo.object.properties["material"] && (
                  <span className="tooltip-label">
                    <b>Material Principal:</b> {hoverInfo.object.properties["material"]}
                  </span>
                )}
                {hoverInfo.object.properties["itemname"] && (
                  <span className="tooltip-label">
                    <b>Producto:</b> {hoverInfo.object.properties["itemname"]}
                  </span>
                )}
                {hoverInfo.object.properties["quantity"] && (
                  <span className="tooltip-label">
                    <b>Cantidad:</b> {hoverInfo.object.properties["quantity"]}
                  </span>
                )}
                {hoverInfo.object.properties["dt"] && (
                  <span className="tooltip-label">
                    <b>Fecha de Recolección:</b> {hoverInfo.object.properties["dt"]}
                  </span>
                )}
              </>
            )}
          </DefaultTooltip>
        )}

      </DeckGL>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={[
          { id: "arroyo", name: "Arroyo Vivo" },
          { id: "tramo1", name: "Altamira" },
          { id: "tramo2", name: "Campana" },
          { id: "tramo3", name: "Distritotec" },
        ]}
      />
      {activeButton == "arroyo" ? <>
        <CustomLegendArroyo
          title={"Puntos de contaminación"}
          color={color}
          description={
            <>
              <b>Fuente</b>
              <p>Información recolectada en levantamiento de campo.</p>
            </>
          }
        >
          <LegendItem color="#ACCED1" label="Corriente natural" />
          <LegendItem color="#39353C" label="Escombros y sedimentos" />
          <LegendTwoToneItem  label="Tiraderos a cielo abierto" />
          <LegendXItem color="#A40034" label="Descargas de drenaje pluvial" />
          <LegendXItem color="#FF5500" label="Descargas de aguas grises" />
          <LegendXItem color="#131619" label="Descargas de aguas negras" />

          <div
    style={{
      
      bottom: "10px",  
      height: "40px",
    }}
  >
    </div>

          <div
    style={{
      position: "absolute",
      bottom: "-20px",
      right: "10px",
      width: "80px", 
      height: "80px",
    }}
  >
    <img
      src={"https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/arroyo.svg"}
      alt="SVG Icon"
      style={{ width: "100%", height: "100%" }}
    />
  </div>
          

        </CustomLegendArroyo>
      </> : <CustomLegendArroyo
        title={<>Principales residuos registrados - Marine Debris Tracker</>}
        color={color}
        description={
          <>
            <b>Residuos registrados con Marine Debris Tracker</b>
            <p>Marine Debris Tracker es una aplicación de ciencia ciudadana y datos abiertos desarrollada por la Oficina Nacional de Administración Oceánica y Atmosférica (NOAA) de los Estados Unidos con el propósito de que los ciudadanos puedan contribuir datos sobre la contaminación hídrica en sus comunidades.</p>
          </>
        }
      >
        <LegendItem color="#650046" label="Plásticos en general" />
        <LegendItem color="#A40034" label="Llantas" />
        <LegendItem color="#E3001E" label="Textiles" />
        <LegendItem color="#EF5606" label="Escombro"/>
        <LegendItem color="#FD8A05" label="Vidrio" />
        <LegendItem color="#FFCB00" label="Aluminio y metal" />
        <LegendLineItem color="#383838" label="Tramo seleccionado" />
        <div
    style={{
      
      bottom: "10px",  
      height: "40px",
    }}
  >
    </div>

          <div
    style={{
      position: "absolute",
      bottom: "-20px",
      right: "10px",
      width: "80px", 
      height: "80px",
    }}
  >
    <img
      src={"https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/arroyo.svg"}
      alt="SVG Icon"
      style={{ width: "100%", height: "100%" }}
    />
  </div>

      </CustomLegendArroyo>}
    </>
  );
};


export function ArroyoVivoCard() {
  const { color, currentSection,treemapData, activeJornada, setActiveJornada, activeButton, hoveredPolygon } = useCardContext();

  const colorPalette = {
    "Planta Invasora": "#00955B",
    "Escombro": "#EF5606",
    "PET": "#8F0D68",
    "Otros plásticos": "#C50B90",
    "Metal": "#F7DE89",
    "Vidrio": "#FD8A05",
    "Textil": "#E3001E",
    "Cartón": "#a52a2a",
    "Aluminio": "#DCB835",
    "Llantas": "#A40034",
    "Muebles": "#684E3B",
    "Electrónicos": "#3D72D5",
    "Otros": "#956BD9"
};

const CustomTooltipTreemap = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: `2.5px solid ${colorPalette[data.name]}`,
        borderRadius: '5px'
      }}>
        {data.name != "Otros"
        ? <p><strong>{data.name}: <br/> {new Intl.NumberFormat("es-MX", {
                style: "unit",
                unit: "kilogram",
              }).format(data.size)}</strong></p>
        : <p><strong>{data.name} Residuos: <br/> {new Intl.NumberFormat("es-MX", {
          style: "unit",
          unit: "kilogram",
        }).format(data.size)}</strong></p>
        }
      </div>
    );
  }
};


  const treeData = Object.entries(treemapData)
    .filter(([key, value]) =>  
      (
        key !== "Periodo" 
        && key !== "Residuos removidos" 
        && key != "Distancia lineal  (m)"
        && key != "Residuos Removidos "
      ) 
        && value > 0)
    .map(([name, size]) => ({ name, size, fill: colorPalette[name] || "#956BD9" }));

    const THRESHOLD = 165;
    let groupedData = [];
    let otrosSize = 0;

    treeData.forEach((item) => {

      if (item.name === "Residuos Removidos") {
        return;
      }

      if (item.size < THRESHOLD) {
        otrosSize += item.size;
      } else {
        groupedData.push(item);
      }
    });

    if (otrosSize > 0) {
      groupedData.push({
        name: "Otros",
        size: otrosSize,
      });
    }

  return (
    <>
    
      {activeButton != "arroyo" ?




      <>
     
      <p>
      La participación ciudadana ha sido clave para el desarrollo y la consolidación del modelo. Con el levantamiento de datos se registraron en el Arroyo Seco más de 23,000 piezas de residuos sólidos urbanos, siendo en su mayoría escombro de construcción, diversos tipos de plásticos y textiles. Esta información se recopiló con la aplicación Marine Debris Tracker, que permite georreferenciar la ubicación exacta de los residuos. 
      </p>

      <p>
      Durante las jornadas de limpieza se separaron y pesaron los residuos con potencial valorizable como el PET, cartón, aluminio, vidrio y metal. 
      </p>
      
      <Legend hoveredPolygon={hoveredPolygon} />
      </>
      :
      <>
       <ResponseTitle color={color}>
        Porque no gestionamos adecuadamente los residuos.
      </ResponseTitle>
      
      <p>
      El proyecto<strong> Arroyo Vivo </strong> es un modelo de regeneración ambiental, remediación y reciclaje inclusivo ubicado en el Arroyo Seco, al sur de la ciudad. Es uno de los pocos cuerpos de agua naturales que subsisten en la zona metropolitana, y por años ha sido contaminado al utilizarse como tiradero a cielo abierto. 
      </p>
      <p>
      Desde el 2022, mediante un proceso participativo de jornadas de limpieza y levantamiento de datos, <strong>Arroyo Vivo</strong> ha documentado la presencia de residuos, tiraderos domésticos y descargas ilegales de aguas grises y negras en el Arroyo Seco. Esto con el objetivo de crear una línea base de información que permita mejorar la calidad del agua y promover la salud del ecosistema.
      </p>
      <p>
      En el mapa se aprecian los puntos de contaminación identificados durante el levantamiento de datos en campo y la presencia de residuos sólidos urbanos registrados con la herramienta Marine Debris Tracker.
      </p>
      <FunnelChart/>
      </>
    }
    {activeButton === "arroyo" ? <></>:<>

      
      <TimelineSelector activeJornada={activeJornada} setActiveJornada={setActiveJornada} />
      <ResponsiveContainer width="100%" height={200} style={{"padding-bottom":"5vh"}}>
        <Treemap
          data={groupedData}
          dataKey="size"
          nameKey="name"
          aspectRatio={4/3}
          stroke="#fff"
          content={<CustomTooltip />}
        >
           <Tooltip content={<CustomTooltipTreemap />}/>
          </Treemap>

      </ResponsiveContainer>
      </>}
    </>
  );
}

const Legend = ({ hoveredPolygon }) => {
  const defaultInfo =   {
  "Periodo": "Julio 2022 a Abril 2024",
  "Residuos Removidos": 21665,
  "Escombro Removido": 88906,
  "Planta Invasora": 2870.87,
  "Escombro": 88906,
  "PET": 591.52,
  "Otros plásticos": 93.25,
  "Metal": 21,
  "Vidrio": 635.1,
  "Textil": 2404.48,
  "Cartón": 14.8,
  "Aluminio": 2.3,
  "Llantas": 1072.9,
  "Muebles": 1687.89,
  "Electrónicos": 163.6,

  };

  const keysToDisplay = [
    "Periodo",
    "Tramo",
    "Tramo/zona",
    "Residuos Removidos",
    "Distancia lineal  (m)",
  ];

  const filteredInfo = keysToDisplay.reduce((acc, key) => {
    if (hoveredPolygon && hoveredPolygon[key] !== undefined) {
      acc[key] = hoveredPolygon[key];
    } else if (defaultInfo[key] !== undefined) {
      acc[key] = defaultInfo[key];
    }
    return acc;
  }, {});

  const iconMapping = {
    'Periodo': 'https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/fecha.svg',
    'Residuos Removidos': 'https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/residuos_recolectados.svg',
    'Escombro Removido': 'https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/escombro_remvodio.svg',
    'Distancia lineal  (m)': 'https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/distancia.svg',
    "pesajeIcon": "https://sium.blob.core.windows.net/sium/datos/arroyo_vivo/arroyo/pesaje.svg"
  };
  


  return (
    <>
    <h3 style={{ fontSize: '0.95rem' }}>
      <strong>
        {hoveredPolygon.Periodo !== "Julio 2022 a Abril 2024" ? "Residuos removidos por jornada" : "Datos Globales de Jornada"}
      </strong>
    </h3>
    <ul>
      {Object.entries(filteredInfo).map(([key, value]) => {
        return (
          <>
          <li style={{ display: 'flex', alignItems: 'center', marginLeft: "2px", fontSize: '0.5rem' }} key={key}>
            <img src={iconMapping[key] || iconMapping["Periodo"]} alt={key} style={{ width: '20px', height: '15px', marginRight: '0px' }} />
            {
              key === "Residuos Removidos" 
              ? <p><strong>Residuos removidos:  </strong> {new Intl.NumberFormat("es-MX", {
                style: "unit",
                unit: "kilogram",
              }).format(value)}</p>
              : key === "Distancia lineal  (m)" 
              ? <p><strong>Longitud del tramo:  </strong> {new Intl.NumberFormat("es-MX",
                {
                  style: "unit",
                  unit: "meter",
                }
              ).format(value)}</p>
              : key === "Tramo/zona"
              ? <p><strong>Zona: </strong> {value} </p>
              : <p><strong>{key}: </strong> {value} </p> }
          </li>
          </>
        );
      })}
    </ul>
    </>
  );
};

const TimelineSelector = ({ activeJornada, setActiveJornada }) => {
  const jornadas = ["Tramo Completo", "1ra Jornada", "2da Jornada", "3ra Jornada", "4ta Jornada"];

  return (
    <div className="timeline-selector">
      {jornadas.map(jornada => (
        <button
          key={jornada}
          onClick={() => setActiveJornada(jornada)}
          className={`button ${activeJornada === jornada ? 'active' : ''}`}
        >
          {jornada === "Tramo Completo" ? "Tramo completo": jornada}
        </button>
      ))}
    </div>
  );
};

const FunnelChart = () => {
  const [selectedVariable, setSelectedVariable] = useState("Total Global");
  const [sortBy, setSortBy] = useState("Fecha");
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  const monthMapping = {
    "enero": 0,
    "febrero": 1,
    "marzo": 2,
    "abril": 3,
    "mayo": 4,
    "junio": 5,
    "julio": 6,
    "agosto": 7,
    "septiembre": 8,
    "octubre": 9,
    "noviembre": 10,
    "diciembre": 11
  };

  const colorMapping = {
    "Total Global": "#3f007d",
    "PET": "#8F0D68",
    "Otros plásticos": "#C50B90",
    "Llantas": "#A40034",
    "Textil": "#E3001E",
    "Escombro": "#EF5606",
    "Vidrio": "#FD8A05",
    "Aluminio": "#DCB835",
    "Metal": "#F7DE89",
    "Muebles": "#684E3B",
    "Electrónicos": "#3D72D5",
    "Planta Invasora": "#00955B",
    "Residuos Mezclados": "#956BD9"
  };
  
  const generateColorPalette = (selectedVariable, data) => {
    const baseColor = d3.color(colorMapping[selectedVariable]);
    if (!baseColor) return () => "#ffffff";
  
    const lightColor = baseColor.brighter(1);
    const darkColor = baseColor; 
  
    const colorInterpolator = d3.interpolateRgb(lightColor, darkColor);
    const valueRange = data.map(d => d.value);
    const min = Math.min(...valueRange);
    const max = Math.max(...valueRange);
    
    const colorScale = d3.scaleLinear().domain([min, max]).range([0, 1]);
  
    return data.map(d => {
      const t = colorScale(d.value);
      let color = d3.color(colorInterpolator(t));
  
      if (t < 0.1) {
        color = d3.color(baseColor.darker(0.5)); 
      }
  
      color.opacity = Math.max(0.5, t); 
      return color.formatRgb();
    });
  };
  
  
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split(" ");
    return new Date(year, monthMapping[month.toLowerCase()], day);
  };
  
  const formattedData = data
    .filter(d => d[selectedVariable] > 0)  
    .map(d => ({
      id: d.Fecha,
      value: d[selectedVariable],
      fecha: d.Fecha,
    }))
    .sort((a, b) => {
      if (sortBy === "Fecha") {
        return parseDate(a.fecha) - parseDate(b.fecha); 
      } else {
        return b.value - a.value;
      }
    });

    const CustomTooltipFunnel = ({ part }) => {
      return <div
        style={{
          background: "white",
          padding: "12px",
          border: "1px solid #3498DB",
          borderRadius: "7px"        }}
      >
        <strong>Jornada:</strong> {part.data.id}<br />
        <strong>Variable:</strong> {selectedVariable}<br />
        <strong>Cantidad:</strong> {new Intl.NumberFormat("es-MX",
                {
                  style: "unit",
                  unit: "kilogram",
                }).format(part.data.value)}
      </div>
    };

    const getLabelColor = (color) => {
      const hsl = d3.hsl(color);
      return hsl.l > 0.3 ? "black" : "white";
    };

    const colorPalette = generateColorPalette(selectedVariable, formattedData);

  return (
    <div style={{ height: isMobile?"300px":"27.5vh", width:isMobile?"100vw":"30vw", fontSize:"0.65em", marginLeft:"-2%"}}>
      <div style={{ marginBottom: "20px" }}>
        <label>
          Ordenar Por: 
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          >
            <option value="Fecha">Fecha</option>
            <option value="Cantidad">Cantidad</option>
          </select>
        </label>

        <label>
          Variable: 
          <select
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="Total Global">Total global</option>
            <option value="PET">PET</option>
            <option value="Otros plásticos">Otros plásticos</option>
            <option value="Llantas">Llantas</option>
            <option value="Textil">Textiles</option>
            <option value="Escombro">Escombro</option>
            <option value="Vidrio">Vidrio</option>
            <option value="Aluminio">Aluminio</option>
            <option value="Metal">Metal</option>
            <option value="Muebles">Muebles</option>
            <option value="Electrónicos">Electrónicos</option>
            <option value="Planta Invasora">Planta invasora</option>
            <option value="Residuos Mezclados">Residuos mezclados</option>
            
            
            
      
           {/*  <option value="Cartón">Cartón</option>
             */}
            
            

          </select>
        </label>
      </div>

      <ResponsiveFunnel
          data={formattedData}
          margin={{ top: 5, right: isMobile?20:30, bottom: 60, left: isMobile?15:45 }}
          enableLabel={true}
          direction="horizontal"
          valueFormat={" =-,.4r"}
          labelColor={({ color }) => getLabelColor(color)}
          colors={colorPalette}
          borderWidth={0}          
          tooltip={CustomTooltipFunnel}
          
        />

      <div style={{display: "flex", flexDirection: "column", width:isMobile?"60%":"100%"}}>
        

        <div
          style={{
            display: "flex",
            marginTop: "-8%",
            marginLeft: isMobile? "-9%":"1.7vw",
            justifyContent: "space-around",
            padding: isMobile?"0px -20px":"0px 25px",
            fontSize: isMobile?"7px":"0.4rem",
            fontWeight: "bold",
            color: "#3498DB",
          }}
        >
          {formattedData.map((d) => (
            isMobile?
            <div 
            style={{transform: "rotate(-90deg)", marginRight:"-30px"}}
            key={d.id}><p style={{fontSize:"7px", marginRight:"6.25px",width: "max-content"}}>{d.fecha}</p></div>
            :
            <div 
            style={{transform: "rotate(-90deg)"}}
            key={d.id}>{d.fecha}</div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: isMobile?"relative":"absolute",
          top: isMobile?"-67%":"70.5%",
          right: isMobile?"12%":"85%",
          transform: "rotate(-90deg)",
          width: isMobile?"25vw":"25%",
          fontSize: isMobile ? "9px" : "10px",
          fontWeight: "bold",
          color: "#3498DB",
        }}
      >
        Cantidad (kg)
      </div>

      <div
        style={{
          fontWeight: "bold",
          fontSize: isMobile ? "8px" : "min(0.8dvw, 1.4dvh)",
          textAlign: "center",
          marginTop: "12px",
          color: "#3498DB",
        }}
      >
        Residuos removidos por jornada (kg)
      </div>
    </div>
  );
};



const CustomTooltip = ({ root, depth, x, y, width, height, index, payload, colors, rank, name , size, fill}) => {

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:fill,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
        }}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        fill="#fff"
        fontSize={10}
      >
        {name}
      </text>
    </g>
  );
};

const data = [
  { 
    "Fecha": "10 agosto 2023", 
    "Total Global": 909.3, 
    "Residuos Mezclados": 376.22, 
    "Planta Invasora": 0, 
    "Escombro": 0, 
    "PET": 35.33, 
    "Otros plásticos": 74.25, 
    "Metal": 1.5, 
    "Vidrio": 29.65, 
    "Textil": 215.2, 
    "Cartón": 13.5, 
    "Aluminio": 1.1, 
    "Llantas": 125.85, 
    "Muebles": 22.5, 
    "Electrónicos": 14.2 
  },
  { 
    "Fecha": "11 febrero 2023", 
    "Total Global": 1240, 
    "Residuos Mezclados": 1218, 
    "Planta Invasora": 600, 
    "Escombro": 0, 
    "PET": 22.5, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 0, 
    "Textil": 0, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  },
  { 
    "Fecha": "12 noviembre 2022", 
    "Total Global": 1650, 
    "Residuos Mezclados": 1597, 
    "Planta Invasora": 146.1, 
    "Escombro": 0, 
    "PET": 23, 
    "Otros plásticos": 10.5, 
    "Metal": 0, 
    "Vidrio": 19.5, 
    "Textil": 0, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  },
  { 
    "Fecha": "2 septiembre 2023", 
    "Total Global": 2023.18, 
    "Residuos Mezclados": 397.15, 
    "Planta Invasora": 152.2, 
    "Escombro": 0, 
    "PET": 103.92, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 252.35, 
    "Textil": 260.1, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 315.25, 
    "Muebles": 534.26, 
    "Electrónicos": 7.95 
  },
  { 
    "Fecha": "20 abril 2024", 
    "Total Global": 2040.43, 
    "Residuos Mezclados": 0, 
    "Planta Invasora": 211.5, 
    "Escombro": 0, 
    "PET": 126.49, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 37.2, 
    "Textil": 706.89, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 0, 
    "Muebles": 79.35, 
    "Electrónicos": 20.55 
  },
  { 
    "Fecha": "24 febrero 2024", 
    "Total Global": 2031.86, 
    "Residuos Mezclados": 0, 
    "Planta Invasora": 208.07, 
    "Escombro": 0, 
    "PET": 29.38, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 42.6, 
    "Textil": 248.48, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 125.7, 
    "Muebles": 503.13, 
    "Electrónicos": 2.4 
  },
  { 
    "Fecha": "25 marzo 2023", 
    "Total Global": 5492.42, 
    "Residuos Mezclados": 4143.22, 
    "Planta Invasora": 116, 
    "Escombro": 1798, 
    "PET": 55.5, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 150.15, 
    "Textil": 147.95, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 291.3, 
    "Muebles": 311.8, 
    "Electrónicos": 76.2 
  },
  { 
    "Fecha": "28 octubre 2023", 
    "Total Global": 1897.8, 
    "Residuos Mezclados": 0, 
    "Planta Invasora": 26, 
    "Escombro": 0, 
    "PET": 103.55, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 35.5, 
    "Textil": 275.51, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 115.1, 
    "Muebles": 209.35, 
    "Electrónicos": 34 
  },
  { 
    "Fecha": "3 septiembre 2022", 
    "Total Global": 1900, 
    "Residuos Mezclados": 1900, 
    "Planta Invasora": 814, 
    "Escombro": 870, 
    "PET": 0, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 0, 
    "Textil": 0, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  },
  { 
    "Fecha": "6 mayo 2023", 
    "Total Global": 1400, 
    "Residuos Mezclados": 531, 
    "Planta Invasora": 368, 
    "Escombro": 108, 
    "PET": 33.5, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 44.35, 
    "Textil": 500.65, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 99.7, 
    "Muebles": 27.5, 
    "Electrónicos": 8.3 
  },
  { 
    "Fecha": "7 julio 2022", 
    "Total Global": 176.4, 
    "Residuos Mezclados": 176.4, 
    "Planta Invasora": 0, 
    "Escombro": 0, 
    "PET": 0, 
    "Otros plásticos": 0, 
    "Metal": 0, 
    "Vidrio": 0, 
    "Textil": 0, 
    "Cartón": 0, 
    "Aluminio": 0, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  },
  { 
    "Fecha": "8 octubre 2022", 
    "Total Global": 571, 
    "Residuos Mezclados": 460.9, 
    "Planta Invasora": 229, 
    "Escombro": 0, 
    "PET": 6.1, 
    "Otros plásticos": 8.5, 
    "Metal": 19.5, 
    "Vidrio": 23.8, 
    "Textil": 49.7, 
    "Cartón": 1.3, 
    "Aluminio": 1.2, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  }
];
