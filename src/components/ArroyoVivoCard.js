import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle } from "./Card";
import {
  sectionsInfo,
  useFetch,
} from "../utils/constants";
import {
  CustomLegend,
  LegendItem,
} from "./CustomLegend.js";
import { GeoJsonLayer, TripsLayer, IconLayer, HeatmapLayer, DeckGL, ScatterplotLayer } from "deck.gl";
import { Treemap, ResponsiveContainer, Tooltip} from 'recharts';
import { Map } from "react-map-gl";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls.js";
import { animate } from "popmotion";
import DefaultTooltip from "./Tooltip";
import supercluster from 'supercluster';
import { ResponsiveFunnel } from "@nivo/funnel";
import { Tooltip as RechartsTooltip} from "recharts";

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
  const { data } = useFetch("TestData/mty_buildings_heights.geojson");
  const { data: arroyo_anim } = useFetch("TestData/arroyo_vivo_flow.json");
  const { data: sedimentos } = useFetch("TestData/sedimentos.geojson");
  const { data: arroyo } = useFetch("TestData/arroyo_vivo.geojson");
  const { data: aguas_pluviales } = useFetch("TestData/agua_pluvial_flow.json");
  const { data: grises } = useFetch("TestData/aguas_grises_flow.json");
  const { data: negras } = useFetch("TestData/aguas_negras_flow.json");
  const { data: escombros } = useFetch("TestData/escombros.geojson");
  const { data: tiraderos } = useFetch("TestData/tiraderos.geojson");
  const { data: tramo2 } = useFetch("TestData/campana_tec.geojson");
  const { data: tramo1 } = useFetch("TestData/altamira_tec.geojson");
  const { data: tramo3 } = useFetch("TestData/distrito_tec.geojson");
  const { data: marine_debris } = useFetch("TestData/marine_debris.geojson");
  const [hoverInfo, setHoverInfo] = useState();
  const [processedTiraderos, setProcessedTiraderos] = useState([]);
  const [processedEscombros, setProcessedEscombros] = useState([]);
  const { color, treemapData,setTreemapData, activeJornada, setActiveJornada, activeButton, setActiveButton, tramo1_data, tramo2_data,tramo3_data, setTramo1, setTramo2, setTramo3 } = useCardContext();
  setTramo1(tramo1)
  setTramo2(tramo2)
  setTramo3(tramo3)
  const [tramo1_Polygon, setTramo1_Polygon] = useState(tramo1)
  const [tramo2_Polygon, setTramo2_Polygon] = useState(tramo2)
  const [tramo3_Polygon, setTramo3_Polygon] = useState(tramo3)
  const [time, setTime] = useState(0);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 25.6465,
    longitude: -100.295,
    zoom: 14.25,
    transitionDuration: 500,
    minZoom: 14.25,
    maxZoom: 20,
  });

  const colors = {
    "Plásticos en general": "#5a1846",
    "Llantas": "#900c3f",
    "Textiles (incluyendo ropa, telas, zapatos)": "#c70239",
    "Aluminio y metal": "#fdc203",
    "Vidrio": "#ea8b10",
    "Residuos de construcción/materiales de construcción": "#e3611c"
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
      repeat: Infinity,
      onUpdate: setTime
    });
    return () => animation.stop();
  }, [loopLength, animationSpeed]);

  useEffect(() => {
    if (escombros) {
      const esc = escombros.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#38363B",
      }));
      setProcessedEscombros(esc);
    }
  }, [escombros]);

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

  useEffect(() => {
    if (tiraderos) {
      const finalData = tiraderos.features.map(feature => ({
        position: feature.geometry.coordinates,
        color: "#ffffff",
      }));
      setProcessedTiraderos(finalData);
    }
  }, [tiraderos]);

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
        "Fierro": 21,
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
          id="arroyo_layer"
          data={arroyo}
          opacity={0.1}
          getLineColor={[52, 152, 219]}
          lineWidthScale={30}
        />

        <GeoJsonLayer
          id="distrito_layer"
          data={data}
          opacity={1}
          getFillColor={[160, 160, 160]}
          getLineColor={[0, 0, 0, 0]}
          lineWidthScale={7.5}
        />

{activeButton === "arroyo" ? <></> : <>
          {clusters ?
            <>
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
        {activeButton === "tramo1" ? 
        <>
       
        
        <GeoJsonLayer
          id="tramo1"
          data={tramo1_Polygon}
          opacity={1}
          filled={false}
          getLineColor={[172, 211, 164, 255]}
          lineWidthScale={10}
          lineWidthUnits={"meters"}
          lineWidthMinPixels={1}
          lineWidthMaxPixels={10}
        />
         <Legend hoveredPolygon={hoveredPolygon} />
        </>
         : <></>}

        {activeButton === "tramo2" ? 
        
        <>
        
        
        <GeoJsonLayer
          id="tramo2"
          data={tramo2_Polygon}
          opacity={1}
          filled={false}
          getLineColor={[108, 135, 172, 255]}
          lineWidthScale={10}
          lineWidthUnits={"meters"}
          lineWidthMinPixels={1}
          lineWidthMaxPixels={10}
        />

         <Legend hoveredPolygon={hoveredPolygon} />

         

        </>
        
        
       : <></>}

        {activeButton === "tramo3" ? 

          <>
          <GeoJsonLayer
            id="tramo3"
            data={tramo3_Polygon}
            opacity={1}
            filled={false}
            getLineColor={[210, 174, 149, 255]}
            lineWidthScale={10}
            lineWidthUnits={"meters"}
            lineWidthMinPixels={1}
            lineWidthMaxPixels={10}
          />

           <Legend hoveredPolygon={treemapData} />
           
          </>
          : <></>}

        {activeButton === "arroyo" ? <>
          <GeoJsonLayer
            id="sedimentos_layer"
            data={sedimentos}
            opacity={0.5}
            getFillColor={[54, 56, 59]}
            lineWidthScale={0}
          />

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
            getColor={[145, 92, 67, 155]}
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
            getColor={[108, 128, 148, 155]}
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
            getColor={[0, 0, 0, 155]}
            opacity={0.9}
            widthMinPixels={10}
            trailLength={trailLength}
            currentTime={time}
            shadowEnabled={true}
          />
        </>
          : <></>}

        {activeButton === "arroyo" ? <>
{/*           <IconLayer
            id="escombros"
            data={processedEscombros}
            getPosition={d => d.position}
            iconAtlas="TestData/arroyo-vivo-icon.png"
            iconMapping="TestData/arroyo-vivo-materiales.json"
            getIcon={d => `${d.color}`}
            sizeUnits={"meters"}
            sizeScale={2}
            sizeMinPixels={0.0001}
            sizeMaxPixels={10}
            getSize={d => 12.5}
          /> */}
          <HeatmapLayer
            id="tiraderos_heatmap"
            data={tiraderos.features}
            getPosition={(d) => d.geometry.coordinates}
            radiusPixels={20}
            intensity={1}
            opacity={0.35}
            aggregation={"MEAN"}
          />
        </> : <></>}

        

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
          { id: "tramo3", name: "Distrito Tec" },
        ]}
      />
      {activeButton == "arroyo" ? <>
        <CustomLegend
          title={"Arroyo Vivo"}
          color={color}
        >
          <LegendItem color="#A2D1D3" label="Corriente" />
          <LegendItem color="#38363B" label="Escombros y Sedimentos" />
          <LegendItem color="#FFFFFF" label="Tiraderos establecidos" />
          <LegendItem color="#915C439B" label="Descargas de drenaje pluvial" />
          <LegendItem color="#6C80949B" label="Descargas de aguas grises" />
          <LegendItem color="#000000" label="Descargas de aguas negras" />
        </CustomLegend>
      </> : <CustomLegend
        title={"Arroyo Vivo - Principales Residuos"}
        color={color}
      >
        <LegendItem color="#5a1846" label="Plásticos en general " />
        <LegendItem color="#900c3f" label="Llantas" />
        <LegendItem color="#c70239" label="Textiles (incluyendo ropa, telas, zapatos)" />
        <LegendItem color="#e3611c" label="Residuos de construcción/materiales de construcción" />
        <LegendItem color="#ea8b10" label="Vidrio" />
        <LegendItem color="#fdc203" label="Aluminio y metal" />
      </CustomLegend>}
    </>
  );
};


export function ArroyoVivoCard() {
  const { color, currentSection,treemapData, activeJornada, setActiveJornada, activeButton } = useCardContext();

  const colorPalette = {
    "Planta Invasora": "#2e8b57",
    "Escombro": "#8b4513",
    "PET": "#7d4051",
    "Otros plásticos": "#a05283",
    "Fierro": "#708090",
    "Vidrio": "#ea8b10",
    "Textil": "#c70239",
    "Cartón": "#a52a2a",
    "Aluminio": "#fdc203",
    "Llantas": "#900c3f",
    "Muebles": "#8b4513",
    "Electrónicos": "#1e90ff"
};

const CustomTooltipTreemap = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px'
      }}>
        <p><strong>{data.name}</strong></p>
        <p><strong>KG Recolectados: {parseFloat(data.size).toFixed(2)}</strong></p>
      </div>
    );
  }
};


  const treeData = Object.entries(treemapData)
    .filter(([key, value]) =>  
      (
        key !== "Periodo" 
        && key !== "Residuos Removidos" 
        && key != "Distancia lineal  (m)"
        && key != "Residuos Removidos "
      ) 
        && value > 0)
    .map(([name, size]) => ({ name, size, fill: colorPalette[name] || "#8884d8" }));

  return (
    <>
     
      {activeButton === "tramo1" ?
      <>
     
      <p>
      La participación ciudadana ha sido clave para el desarrollo y la consolidación de este modelo de trabajo, durante el 2022 a 2024 contamos con la participación de más de 2,000 personas voluntarias que se sumaron a diversas actividades de ciencia ciudadana como las jornadas de limpieza selectiva, donde realizamos 16 intervenciones en diversos tramos del arroyo.
      </p>
      <p>
      Gracias a las jornadas de datos se logró documentar a lo largo del Arroyo Seco más de 23,000 piezas de diversos tipos de residuos sólidos urbanos, siendo en su mayoría escombros, plásticos y textiles. 
      </p>
      </>
      :
      activeButton === "tramo2" ?
      <>
      <p>
      Diversas actividades a nivel comunitario se trabajaron a la par que hacíamos las intervenciones de limpieza en el cause, una de las más relevantes fue lograr la transformación de un espacio que era tiradeo de residuos oficial en un área de juegos. Este hecho ayudó de manera considerable a la disminución de los residuos en ese tramo del arroyo, haciendo también posible comprobar que los residuos que mayoritariamente encontramos en el arroyo son de manejo especial y que hasta el día de hoy no hay alternativas o soluciones eficientes para el manejo y/o transformación de estos elementos.
      </p>
      <p>
      Los textiles por ejemplo son uno de los residuos de mayor presencia y de cual casi no tenemos alternativas para su recolección, reciclaje y destino final del mismo. 
      </p>
      
      </>
      :

      activeButton === "tramo3" ?
      <>
      <p>
        
      </p>
      </>
      :
      <>
      <p>
      El Arroyo Seco, ubicado al sur de Monterrey, es uno de los pocos cuerpos de agua naturales que subsisten en la zona metropolitana, y por años ha sufrido contaminación al ser utilizado como tiradero a cielo abierto. De acuerdo a estimaciones oficiales, cada día se tiran ilegalmente alrededor de 800 toneladas de residuos en ríos, arroyos y riachuelos de Nuevo León.
      </p>
      <p>
      Ante esta problemática Arroyo Vivo consolidó una estrategia de documentación y clasificación de residuos con el objetivo de identificar las zonas con mayores problemáticas. 
      </p>
      <p>
      Arroyo Vivo es un proyecto colaborativo lidereado desde el Tecnológico de Monterrey, que recibió inversión de la Oficina Nacional del Gobierno de Estados Unidos de Administración Oceánica y Atmosférica (National Oceanic and Atmospheric Administration, NOAA por sus siglas en ingles) y de Fundación FEMSA; desde el 2022 ha estado trabajando en conjunto con los cuatro socios operativos y territoriales que son WWF México, Sociedad Sostenible A.C., distritotec y la Iniciativa Campana-Altamira. 
      </p>
      <FunnelChart/>
      </>
    }
    {activeButton === "arroyo" ? <></>:<>
      <h3> <strong>Periodo: {treemapData.Periodo}</strong></h3>
      <TimelineSelector activeJornada={activeJornada} setActiveJornada={setActiveJornada} />
      <ResponsiveContainer width="100%" height={300} style={{"padding-bottom":"5vh"}}>
        <Treemap
          data={treeData}
          dataKey="size"
          nameKey="name"
          ratio={4/3}
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
  "Fierro": 21,
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
    "Escombro Removido",
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
    'Periodo': '/TestData/arroyo/fecha.svg',
    'Residuos Removidos': '/TestData/arroyo/residuos_recolectados.svg',
    'Escombro Removido': '/TestData/arroyo/escombro_remvodio.svg',
    'Distancia lineal  (m)': '/TestData/arroyo/distancia.svg',
    "pesajeIcon": "/TestData/arroyo/pesaje.svg"
  };
  


  return (
    <div className="legend">
      <h3><strong>{hoveredPolygon.Periodo != "Julio 2022 a Abril 2024" ? "Análisis por Jornada" : "Datos Globales de Jornada"}</strong></h3>
      <ul>
      {Object.entries(filteredInfo).map(([key, value]) => (
        <li style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }} key={key}>
        <img src={iconMapping[key] || iconMapping["Periodo"]} alt={key} style={{ width: '16px', height: '16px', marginRight: '8px' }} />
        <strong>{key}:</strong> {value}
      </li>
      ))}
      </ul>
    </div>
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
          {jornada}
        </button>
      ))}
    </div>
  );
};

const FunnelChart = () => {
  const [selectedVariable, setSelectedVariable] = useState("Total Global");
  const [sortBy, setSortBy] = useState("Fecha");

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
  
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split(" ");
    return new Date(year, monthMapping[month.toLowerCase()], day);
  };
  
  const formattedData = data
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
          border: "1px solid #ccc",
          borderRadius: "4px"        }}
      >
        <strong>Jornada:</strong> {part.data.id}<br />
        <strong>Variable:</strong> {selectedVariable}<br />
        <strong>Cantidad:</strong> {part.data.value}
      </div>
    };


  return (
    <div style={{ height: "300PX" }}>
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
            <option value="Total Global">Total Global</option>
            <option value="Residuos Mezclados">Residuos Mezclados</option>
            <option value="Planta Invasora">Planta Invasora</option>
            <option value="Escombro">Escombro</option>
            <option value="PET">PET</option>
            <option value="Otros plásticos">Otros plásticos</option>
            <option value="Fierro">Fierro</option>
            <option value="Vidrio">Vidrio</option>
            <option value="Textil">Textil</option>
            <option value="Cartón">Cartón</option>
            <option value="Aluminio">Aluminio</option>
            <option value="Llantas">Llantas</option>
            <option value="Muebles">Muebles</option>
            <option value="Electrónicos">Electrónicos</option>
          </select>
        </label>
      </div>

      

      <ResponsiveFunnel
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        enableLabel={true}
        direction="horizontal"
        valueFormat=">-.2s"
        labelColor="black"
        colors={{ scheme: "purples" }}
        borderWidth={20}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        tooltip={CustomTooltipFunnel}
      />
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
    "Fierro": 1.5, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Escombro": 87000, 
    "PET": 0, 
    "Otros plásticos": 0, 
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 0, 
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
    "Fierro": 19.5, 
    "Vidrio": 23.8, 
    "Textil": 49.7, 
    "Cartón": 1.3, 
    "Aluminio": 1.2, 
    "Llantas": 0, 
    "Muebles": 0, 
    "Electrónicos": 0 
  }
];
