import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
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
      <Legend title={"Precio de Venta 2000-2020"} legendItems={legendItems} />
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
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(2000, 2020, 5, 2000, false, 2020);

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
  }, [isCurrentSection]);

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
  }, [originalData, time, isPlaying]);

  return (
    <>
      <ResponseTitle color={color}>
        La vivienda es más asequible en las periferias
      </ResponseTitle>
      <p>
        La zona central de Monterrey se ha ido transformando en una zona
        comercial sin residentes: los hogares migran y los comercios se quedan.
        El centro es la zona mejor conectada de la ciudad porque, durante
        décadas, la mejor infrastructura de transporte y vialidades se construyó
        para conectar la zona del empleo, el centro, con el resto de las zonas
        residenciales. El centro es la zona mejor conectada y accesible de la
        ciudad y eso le otorga un gran valor comercial, y por tanto, un alto
        valor a su suelo. El alto valor del suelo hace inviable la producción de
        vivienda asequible en la zona central de la ciudad; la vivienda
        económica se construye en las periferias urbanas y hacia allá migran los
        hogares en busca de un espacio para poder habitar.
      </p>
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
