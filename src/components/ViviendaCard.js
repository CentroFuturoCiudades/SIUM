import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  separateLegendItems,
  filterDataAll,
  useFetch,
  VIVIENDA_URL,
  VIVIENDA_CHART_URL,
} from "../utils/constants";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Legend } from "./Legend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";

const marks = [
  { value: 2000, label: "2000" },
  { value: 2005, label: "2005" },
  { value: 2010, label: "2010" },
  { value: 2015, label: "2015" },
  { value: 2020, label: "2020" },
];

const VIVIENDA_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 50, 50)",
  "rgb(255, 150, 150)",
  "rgb(255, 200, 200)",
  "rgb(250, 200, 250)",
  "rgb(150, 150, 255)",
  "rgb(50, 50, 255)",
  "rgb(0, 0, 255)",
];
const VIVIENDA_QUANTILES = [
  160000, 400000, 500000, 600000, 800000, 1000000, 1200000, 1800000,
];

export const ViviendaControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(VIVIENDA_URL);
  const [legendItems, setLegendItems] = useState([]);
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(2000, 2020, 5, 2000, false, 2020);

  useEffect(() => {
    if (!data) return;
    const valuesPrecio = data.features.map(
      (feat) => feat.properties["PRECIO_AJUSTADO"]
    );
    setLegendItems(
      separateLegendItems(
        valuesPrecio,
        VIVIENDA_QUANTILES,
        VIVIENDA_COLORS,
        (x) =>
          x.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })
      )
    );
  }, [data]);

  useEffect(() => {
    setSharedProps({ time });
  }, [time]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="vivienda_layer"
          data={filterDataAll(data, time, "PRECIO_AJUSTADO", true, "year_end")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["PRECIO_AJUSTADO"],
              VIVIENDA_QUANTILES,
              VIVIENDA_COLORS,
              0.8
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
        />
      </CustomMap>
      <Legend
        title={"Precio de Venta 2000-2020"}
        legendItems={legendItems}
        color={color}
      />
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

export function ViviendaCard() {
  const { color, setOutline, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(VIVIENDA_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        La vivienda es más asequible en las periferias
      </ResponseTitle>
      <p>
        La zona central de Monterrey se ha transformado en una zona comercial,
        sin residentes: los hogares migran y los comercios se quedan. El centro
        es la zona mejor conectada de la ciudad porque, durante décadas, la
        mejor infrastructura de transporte y vialidades se construyó para
        conectar el empleo, en el centro, con el resto de las zonas
        residenciales. El centro es la zona mejor conectada y accesible de la
        ciudad y eso le otorga un gran valor comercial, y por tanto, un alto
        valor a su suelo. El alto valor del suelo hace inviable la producción de
        vivienda asequible en la zona central; la vivienda económica se
        construye en las periferias urbanas.
      </p>
      <ContextTitle color={color}>
        Aunque los costos de la vivienda sean menores en las periferias, otros
        costos se elevan, aumentando desigualdad.
      </ContextTitle>
      <Chart
        title={`Número de Creditos acumulados en ${sharedProps.time}`}
        data={chartData}
        setOutline={setOutline}
        domain={[0, 42000]}
        column="creditos"
        columnKey="NOMGEO"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
        filtering={(x) => x.year_end === sharedProps.time}
      />
    </>
  );
}
