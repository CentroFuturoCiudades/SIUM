import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { separateLegendItems, filterDataAll } from "../utils/constants";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Legend } from "./Legend";

const marks = [
  { value: 2000, label: "2000" },
  { value: 2005, label: "2005" },
  { value: 2010, label: "2010" },
  { value: 2015, label: "2015" },
  { value: 2020, label: "2020" },
];

export const ViviendaControls = ({
  time,
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
          separateLegendItems(valuesPrecio, 4, "red", "blue", (x) =>
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
    <>
      <Legend title={"Precio de Venta"} legendItems={legendItems} />
      <SliderHTML
        time={time}
        min={2000}
        max={2020}
        step={5}
        defaultValue={time}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        handleSliderChange={handleSliderChange}
        marks={marks}
      />
    </>
  );
};

export function ViviendaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]); //datos filtrados
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } =
    TimeComponentClean(2000, 2020, 5, 1000, false, 2020);

  useEffect(() => {
    //esto lee para las bar charts
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => setChartData(data));
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson"
      )
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setChartData([]);
      setOriginalData(null);
      setLayers([]);
    }
  }, [isCurrentSection, originalData, setLayers]);

  useEffect(() => {
    if (isCurrentSection && originalData) {
      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });

      const viviendaLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_vivienda_layer",
          data: filterDataAll(
            originalData,
            time,
            "IM_PRECIO_VENTA",
            true,
            "year_end"
          ),
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
    originalData,
    setLayers,
    setControlsProps,
    isPlaying,
    time,
    animationTime,
    handleSliderChange,
    togglePlay,
    isCurrentSection,
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
      <ContextTitle color={color}>
        Aunque los costos de la vivienda son menores en las periferias, otros
        costos se elevan, aumentando la desigualdad.
      </ContextTitle>
      <Chart
        title={`Número de Creditos acumulados en ${time}`}
        data={chartData}
        setOutline={setOutline}
        column="creditos"
        columnKey="NOMGEO"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
        filtering={(x) => x.year_end === time}
      />
    </>
  );
}
