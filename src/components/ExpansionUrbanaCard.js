import React, { useEffect, useState } from "react";
import {
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  ExpansionSpan,
} from "./Card";
import { useCardContext } from "../views/Problematica";
import { separateLegendItems, cleanedGeoData } from "../utils/constants";
import "../index.css";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Legend } from "./Legend";
import { Text } from "@chakra-ui/react";

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
    <>
      <Legend title={"Cambio Poblacional"} legendItems={legendItems} />
      <SliderHTML
        time={time}
        min={1990}
        max={2010}
        step={10}
        defaultValue={1990}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        handleSliderChange={handleSliderChange}
        marks={marks}
      />
    </>
  );
};

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState(null);
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(1990, 2010, 10, 2000, false);

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
      setLayers([]);
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
  }, [originalData, time, isPlaying]);

  return (
    <>
      <ResponseTitle color={color}>
        Hacia las Periferias, lejos unos de otros
      </ResponseTitle>
      <p>
        <b>En 1990</b>, las familias jóvenes, con edades comprendidas entre 19 y
        65 años, residían principalmente en las zonas centrales de la zona
        metropolitana, en Monterrey, Guadalupe, San Pedro y San Nicolás.
      </p>
      <p>
        <b>En 2020</b>, se observa un cambio: las familias jóvenes han migrado
        hacia la <PeripherySpan setOutline={setOutline} />, estableciéndose en
        lugares como Juárez, García, Apodaca, Santa Catarina y General Zuazua.
        Los adultos mayores permanecen en la zona central.
      </p>
      <p>
        En los últimos años, ha habido un cambio significativo en la
        distribución de la población en Monterrey, reflejando dinámicas
        demográficas notables. Se plantea la necesidad de una adaptación
        cuidadosa de las políticas públicas y servicios urbanos a las nuevas
        dinámicas. Una de las causas principales de la migración de los hogares
        jóvenes a la periferia urbana es la falta de una oferta de vivienda
        adecuada a su nivel de ingreso y estilo de vida en la zona central.
      </p>
      <ContextTitle color={color}>
        Promover programas de densificación y optar por soluciones
        habitacionales asequibles, fomentará la permanencia de una demografía
        diversa en centros y subcentros urbanos
      </ContextTitle>
      <Chart
        title={`Cambio poblacional de ${time} a 2020`}
        data={chartData}
        setOutline={setOutline}
        column="population_change"
        columnKey="nom_mun"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
        filtering={(x) => x.year == time}
      />

    </>
  );
}
