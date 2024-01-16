import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { separateLegendItems, filterDataAll, filterDataPob05, INFANCIAS2_LAYER, filterDataPoints, filterIcons } from "../utils/constants";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { IconLayer } from "deck.gl";
import {IconClusterLayer} from "./icon-cluster-layer";
import Supercluster from 'supercluster';


export function InfanciasCard({ color, isCurrentSection }) {
    const { setLayers, setOutline, setControlsProps} = useCardContext();
    const [chartData, setChartData] = useState([]);
    const [originalData, setOriginalData] = useState([]); //datos filtrados manzanas
    const [originalData2, setOriginalData2] = useState([]); //datos filtrados puntos

    const [supercluster, setSupercluster] = useState(null);
    const [clusters, setClusters] = useState([]);

    const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponentClean(1990, 2020, 5, 3000, false);
    //const superclusterInstance = new Supercluster(); // Crea una nueva instancia de Supercluster
    const superclusterInstance = new Supercluster({
      log: true,
      radius: 50, // Tamaño del clúster
      maxZoom: 16, // Nivel máximo de zoom para la formación de clústeres
      nodeSize: 16, // Ajusta este valor
    });
    const index = new Supercluster({
      log: true,
      radius: 20,
      extent: 256,
      maxZoom: 20,
      //nodeSize: 1
    });
  
    //lee el geojson de poblacion de 0-5 años y guarda los datos en setOriginalData
    useEffect(() => {
      if (isCurrentSection) {
        fetch("SIUM/data/pob_infancia.geojson")
          .then((response) => response.json())
          .then((data) => setOriginalData(data))
          .catch((error) => console.error("Error cargando el GeoJSON:", error));
        fetch("SIUM/data/denue_infancia.geojson")
          .then((response) => response.json())
          .then((data) => setOriginalData2(data))
          .catch((error) => console.error("Error cargando el 2do geojson: ", error));
      } else {
        setOriginalData(null);
        setOriginalData2(null);
      }
    }, [isCurrentSection]);



    useEffect(() => {
      if (isCurrentSection && originalData) {
  
        setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });
        
        const infanciaLayer = {
          type: GeoJsonLayer,
          props: {
            id: "seccion_pobinfancia_layer",
            //data: filterDataAll(originalData, time, "IM_PRECIO_VENTA", true, "year_end"),
            data: filterDataPob05(originalData, "ratio_pob05", true), //no usa time ni cve_ent solo normaliza el originalData a base de la columna ratio_pob05
            getFillColor: (d) =>
              colorInterpolate(1 - d.properties.normalized, "blue", "red", 1),
            getLineColor: (d) =>
              colorInterpolate(1 - d.properties.normalized, "blue", "red", 1),
            getLineWidth: 10,
          },
        };

        const serviciosLayer = {
          type: GeoJsonLayer,
          props: {
            id: "seccion_servicios_layer",
            data: filterDataPoints(originalData2, "codigo_act", true),
            getFillColor: (d) => d.properties.color || [0, 0, 0, 0],
            /*getLineColor: (d) =>
              colorInterpolate(d.properties.normalized, "blue", "red", 0.5),*/
            //getLineColor: [0, 0, 255, 255],
            getLineColor: (d) => d.properties.color || [0, 0, 0, 0],
            //getLineWidth: 50,
            getPointRadius: 10
          }
        };
        
        index.load(
          originalData2.features.map(d => ({
            geometry: { coordinates: d.geometry.coordinates }, // Asegúrate de que las coordenadas estén en el formato correcto
            properties: d.properties
          }))
        );
        console.log("index dsp de cargar originalData2", index)
        //console.log("Puntos cargados:", superclusterInstance.points.features.length);
       

        //if (supercluster) {
          //console.log("superclusterInstance points:", superclusterInstance.points);

          const calculateBounds = (latitude, longitude, zoom, width, height) => {
            const metersPerPixel = 40075016.686 / 2 ** zoom / 256; // Circunferencia de la Tierra en metros dividida por el número de píxeles en el mapa
            const centerPixelX = width / 2;
            const centerPixelY = height / 2;
            
            const minX = longitude - (centerPixelX * metersPerPixel);
            const minY = latitude + (centerPixelY * metersPerPixel);
            const maxX = longitude + (centerPixelX * metersPerPixel);
            const maxY = latitude - (centerPixelY * metersPerPixel);
            
            return [minX, minY, maxX, maxY];
          };
          
         // const bounds = calculateBounds(25.675, -100.286419, 9.6, window.innerWidth, window.innerHeight);
          
          const bounds = [-100.30427, -25.65534, 100.30427, 25.65534]; // Coordenadas de la vista actual

          const bounds2 = [-180, -90, 180, 90]; // Ejemplo de límites mundiales

          const zoom = 9.6; // Nivel de zoom bajo
          const zoom2 = 16; // Nivel de zoom bajo
          
          //console.log("supercluster now is", supercluster);
          const newClusters = index.getClusters(bounds2, zoom2);
          setClusters(newClusters);
          setTimeout(function() {
            //Test to get the clusters
            //const clusters = index.getClusters(bounds, zoom);
            console.log("clusters dsp de segundos", newClusters);
            //console.log(markerCluster.getTotalClusters());
          },10000);

        
        const createClusterLayer2 = (clusters) => {
          const validClusters = clusters.filter(cluster => cluster.geometry && cluster.geometry.type === 'Point');
        
          return {
            type: GeoJsonLayer,
            props: {
              id: 'cluster-layer',
              data: validClusters,
              pickable: true,
              // Ajusta el estilo según tus preferencias
              getFillColor: [0, 255, 0, 255],
              getLineColor: [0, 0, 0, 0],
              getRadius: 20,
              pointRadiusMinPixels: 2
            }
          };
        };
        
        setLayers([infanciaLayer, serviciosLayer, createClusterLayer2(clusters)]);      
      }
    }, [
      isCurrentSection,
      originalData,
      setLayers,
      setControlsProps,
      isPlaying,
      time,
      animationTime,
    ]);
  
    return (
      <>
        <ResponseTitle color={color}>
          La vivienda es más asequible en las periferias.
        </ResponseTitle>
        <p>
          En <b>1990</b> había vivienda asequible en los{" "}
          <SubcentersSpan setOutline={setOutline} />, como Santa Catarina,
          Cumbres, San Nicolás y Guadalupe. <b>Actualmente</b> la vivienda barata
          se encuentra en la <PeripherySpan setOutline={setOutline} /> como
          García, Juárez, Pesquería, Zuazua y Cadereyta.
        </p>
        <p>
          De 1990 a 2020 el costo de la vivienda asequible aumentó en un{" "}
          <b>50%</b> y la vivienda en general en más del <b>300%</b>. El{" "}
          <b>45%</b> de viviendas han sido financiadas con crédito{" "}
          <b>INFONAVIT</b> de los cuales el <b>87%</b> se encuentran en la{" "}
          <PeripherySpan setOutline={setOutline} />.
        </p>
        <p>
          El 50% de las solicitudes para el crédito tienen ingresos inferiores a
          $12,614. Considerando que el 60% de hogares viven con menos de $12,800,
          los costos de comprar casa y automóvil son, en la mayoría de los casos,
          incosteables.
        </p>
        <br />
        <br />
        {/* <ContextTitle color={color}>
          Aunque los costos de la vivienda son menores en las periferias, otros
          costos se elevan, aumentando la desigualdad.
        </ContextTitle> */}
        <Chart
          data={chartData}
          setOutline={setOutline}
          column="IM_PRECIO_VENTA"
          columnKey="NOMGEO"
          formatter={(d) => `$${d.toLocaleString("en-US")}`}
        />
      </>
    );
  }