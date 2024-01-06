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
import {
  separateLegendItems,
  filterDataAll,
  cleanedGeoData,
} from "../utils/constants";
import "../index.css";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";

const marks = [
  { value: 1990, label: "1990-2020" },
  { value: 2000, label: "2000-2020" },
  { value: 2010, label: "2010-2020" },
];

export const ExpansionUrbanaControls = ({
  time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features
          .map((x) => [
            x.properties["1990"],
            x.properties["2000"],
            x.properties["2010"],
          ])
          .flat();
        setLegendItems(separateLegendItems(values, 4, "red", "blue"));
      })
      .catch((error) =>
        console.error("Error fetching the geojson data: ", error)
      );
  }, []);

  return (
    <SliderHTML
      time={time}
      min={1990}
      max={2010}
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
  const [originalData, setOriginalData] = useState(null);
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } =
    TimeComponentClean(1990, 2010, 10, 1000, false);

  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/expansion_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => setChartData(data));
      console.log("Se llamaron a los datos de expansion");
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob.geojson"
      )
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setChartData([]);
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    if (isCurrentSection && originalData) {
      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });
      const expansionLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_expansion_layer",
          data: cleanedGeoData(originalData.features, time),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "red", "blue", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "red", "blue", 0.5),
          getLineWidth: 10,
        },
      };
      setLayers([expansionLayer]);
    }
  }, [
    isCurrentSection,
    originalData,
    time,
    isPlaying,
    animationTime,
    setLayers,
    setControlsProps,
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
        title={`Población en ${time}`}
        data={chartData}
        setOutline={setOutline}
        column={time}
        columnKey="nom_mun"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
