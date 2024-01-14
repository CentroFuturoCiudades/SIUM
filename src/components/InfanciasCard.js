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

const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

export function InfanciasCard({ color, isCurrentSection }) {
    const { setLayers, setOutline, setControlsProps} = useCardContext();
    const [chartData, setChartData] = useState([]);
    const [originalData, setOriginalData] = useState([]); //datos filtrados
    const [originalData2, setOriginalData2] = useState([]); //datos filtrados

    const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponentClean(1990, 2020, 5, 3000, false);
  
  
    /*useEffect(() => { //esto lee para las bar charts
      if (isCurrentSection) {
        fetch("SIUM/data/vivienda_municipality.json")
          .then((response) => response.json())
          .then((data) => {
            const newData = data.filter((x) => x.year === 2019);
            setChartData(newData);
          });
      } else {
        setChartData([]);
      }
    }, [isCurrentSection]);*/
  
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

  /*   useEffect(() => {
    if (isCurrentSection) {
      setLayers([INFANCIAS2_LAYER]);
    }
  }, [isCurrentSection, setLayers]);*/
    
  
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
            getPointRadius: 20
          }
        };

        /*const serviciosIconLayer = {
          type: IconLayer,
          props: {
            id: 'icon-layer',
            data: filterIcons(originalData2),
            //iconAtlas: "",
            //iconMapping: ICON_MAPPING,
            //getIcon: d => 'marker',

            //sizeScale: 15,
            getPosition: d => d.geometry.coordinates,
            getIcon: (d) => ({
              url: d.properties.iconPath,
              width: 1000, // ajusta según el tamaño real de tus iconos
              height: 1000,
              anchorY: 1000, // ajusta según la ubicación del punto que deseas señalar
            }),
          }
        }*/


        setLayers([infanciaLayer, serviciosLayer]);
        //setLayers([serviciosIconLayer]);
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