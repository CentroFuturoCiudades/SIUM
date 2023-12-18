import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { VIVIENDA_LAYER, separateLegendItems, filterDataAll } from "../utils/constants";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { TimeComponent, SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate, addNormalized } from "../utils/constants";


const marks = [
  { value: 1990, label: "1990" },
  { value: 1995, label: "1995" },
  { value: 2000, label: "2000" },
  { value: 2005, label: "2005" },
  { value: 2010, label: "2010" },
  { value: 2015, label: "2015" },
  { value: 2020, label: "2020" },
];

export const ViviendaControls = ({time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const valuesPrecio = data.features.map(
          (feat) => feat.properties["IM_PRECIO_VENTA"]
        );
        setLegendItems(
          separateLegendItems(valuesPrecio, 4, "blue", "red", (x) =>
            x.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching the geojson data: ", error)
      );
  }, []);

  return (
    <SliderHTML
      time={time}
      min={1990}
      max={2020}
      step={5}
      title={"Precio de Venta"}
      togglePlay={togglePlay}
      isPlaying={isPlaying}
      handleSliderChange={handleSliderChange}
      marks={marks}
      legendItems={legendItems}
    />
  );
};


//***************************************************************** */
export function ViviendaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps} = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]); //datos filtrados
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponentClean(1990, 2020, 5, 3000, false);

  

  useEffect(() => { //esto lee para las bar charts
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
  }, [isCurrentSection]);


  useEffect(() => {
    if (isCurrentSection) {
      console.log("Se llamaron a los datos de vivienda")
      //fetch("SIUM/data/vivienda-hex.geojson")
      fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  /*useEffect(() => { //pone la vivienda layer
    if (isCurrentSection) {
      setLayers([VIVIENDA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);*/

  const transformDataVivienda = (data, selectedYear, column, reversed = false) => {
    if (!data || !data.features || !Array.isArray(data.features)) {
      return [];
    }

    const toNormalize = addNormalized(
      data.features.map((x) => x.properties),
      column
    );
  
    const filteredData = data.features
      .filter((feature) => feature[column] !== 0 && feature.properties.year_end === selectedYear)
      .map((feature) => {
        const coordinates = feature.geometry.coordinates[0]; // Obtener las coordenadas del primer anillo del polígono
        return {
          ...feature,
          properties: {
            ...feature.properties,
            normalized: reversed
              ? 1 - toNormalize(feature.properties)
              : toNormalize(feature.properties),
          },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates], // Conservar solo el primer anillo
          },
        };
      });
  
    return filteredData
  };
  

  useEffect(() => {
    //para la animacion
    if (isCurrentSection && originalData) {

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });
      
      const viviendaLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_vivienda_layer",
          //data: transformDataVivienda(originalData, time, "IM_PRECIO_VENTA", true),
          data: filterDataAll(originalData, time, "IM_PRECIO_VENTA", true, "year_end"),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
          getLineWidth: 10,
        },
      };

      setLayers([viviendaLayer]);
    }
  }, [
    isCurrentSection,
    originalData,
    setLayers,
    setControlsProps,
    isPlaying,
    time,
    animationTime,
    handleSliderChange,
    togglePlay,
  ]);

  /*
    const animate = () => {
      //setTime((prevTime) => (prevTime + 2) % 2023);
      //setTime((prevTime) => (prevTime + 1) % (2023) + 1990);
      setTime((prevTime) => (prevTime + 15) % (2020 - 1990) + 1990);
      console.log(time);
      animationFrame = requestAnimationFrame(animate);
    };*/



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
