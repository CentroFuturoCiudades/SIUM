import React, { useEffect, useState } from "react";
import {
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  ExpansionSpan,
} from "./Card";
import { useCardContext } from "../views/Body";
import { EXPANSION_LAYER, separateLegendItems } from "../utils/constants";
import "../index.css";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { TimeComponent, SliderHTML } from "./TimeComponent";
import { colorInterpolate, addNormalized } from "../utils/constants";

const marks = [
  { value: 1990, label: "1990" },
  { value: 2000, label: "2000" },
  { value: 2010, label: "2010" },
  { value: 2020, label: "2020" },
];

export const ExpansionUrbanaControls = ({time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map((feat) => feat.properties["2020"]);
        setLegendItems(separateLegendItems(values, 4, "blue", "red"));
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
      step={10}
      title={"Cambio Poblacional"}
      togglePlay={togglePlay}
      isPlaying={isPlaying}
      handleSliderChange={handleSliderChange}
      marks={marks}
      legendItems={legendItems}
    />
  );
};

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponent(1990, 2020, 1);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/expansion_municipality.json")
        .then((response) => response.json())
        .then((data) => setChartData(data));
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    if (isCurrentSection) {
      console.log("Se llamaron a los datos de expansion")
      fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/expansion.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  /*useEffect(() => {
    if (isCurrentSection) {
      setLayers([EXPANSION_LAYER]);
    }
  }, [isCurrentSection, setLayers]);*/

  const transformDataExpansion = (data, selectedYear, column, reversed = false) => {
    if (!data || !data.features || !Array.isArray(data.features)) {
      return [];
    }

    const toNormalize = addNormalized(
      data.features.map((x) => x.properties),
      column
    );
  
    const filteredData = data.features
      .filter((feature) => feature[column] !== 0 && parseInt(feature.properties.year) === selectedYear)
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
    
    console.log('filteredData:', filteredData);
    return filteredData
  };

  useEffect(() => {
    //para la animacion
    if (isCurrentSection && originalData) {

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });

      const expansionLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_expansion_layer",
          data: transformDataExpansion(originalData, time, "population_change", true),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
          getLineWidth: 10,
        },
      };

      setLayers([expansionLayer]);
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
        Hacia las periferias, lejos unos de otros.
      </ResponseTitle>
      <p>
        En <ExpansionSpan setOutline={setOutline} /> los <b>adultos mayores</b>{" "}
        vivían en el <CenterSpan setOutline={setOutline} /> de Monterrey,
        mientras que las <b>familias jóvenes</b> vivían en{" "}
        <SubcentersSpan setOutline={setOutline} /> como Guadalupe, San Pedro,
        San Nicolás y Cumbres.
      </p>
      <p>
        En contraste, <b>actualmente</b> los <b>adultos mayores</b> viven en los{" "}
        <SubcentersSpan setOutline={setOutline} />, mientras que las{" "}
        <b>familias jóvenes</b> viven en la{" "}
        <PeripherySpan setOutline={setOutline} />, como Juárez, García, Apodaca,
        Santa Catarina y Suaza.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La migración de subcentros a la periferia, conocido como expansión
        urbana, nos aleja de servicios y empleo.
      </ContextTitle>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="2020"
        columnKey="nom_mun"
        formatter={(d) => `${d.toLocaleString("en-US")} pob`}
      />
    </>
  );
}
