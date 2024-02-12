import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  separateLegendItems,
  filterDataAll,
  useFetch,
  VIVIENDA_URL,
  VIVIENDA_CHART_URL,
  generateGradientColors,
  sectionsInfo,
} from "../utils/constants";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Legend } from "./Legend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import * as d3 from "d3";
import { useToken } from "@chakra-ui/react";

const VIVIENDA_QUANTILES = [
  160000, 400000, 500000, 600000, 800000, 1000000, 1200000, 1800000,
];

const marks = [
  { value: 2000, label: "2000" },
  { value: 2005, label: "2005" },
  { value: 2010, label: "2010" },
  { value: 2015, label: "2015" },
  { value: 2020, label: "2020" },
];

export const ViviendaControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.600`]);
  const endColor = "#1A57FF";
  const VIVIENDA_COLORS = generateGradientColors(startColor, endColor, 8);
  const { data } = useFetch(VIVIENDA_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(2000, 2020, 5, 2000, false, 2020);

  useEffect(() => {
    setLegendItems(separateLegendItems(VIVIENDA_QUANTILES, VIVIENDA_COLORS));
  }, []);

  useEffect(() => {
    setSharedProps({ time });
  }, [time]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={INITIAL_STATE}>
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
          onHover={(info) => setHoverInfo(info)}
          pickable={true}
          autoHighlight={true}
          getPosition={(d) => d.position}
        />
      </CustomMap>
      <Legend
        title={"Precio de Venta 2000-2020"}
        legendItems={legendItems}
        color={color}
        description={
          <>
            <b>Créditos de INFONAVIT activos en 2020</b>
            <p>Las viviendas adquiridas a través de un crédito de INFONAVIT.</p>
            <p>Datos actualizados por inflación presentados en precios de 2020.</p>
          </>
        }
        formatter={d3.format("$,.0f")}
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
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>Año en venta:</b> {hoverInfo.object.properties["year_end"]}
          </span>
          <span className="tooltip-label">
            <b>Precio de venta:</b>{" "}
            {hoverInfo.object.properties["IM_PRECIO_VENTA"].toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }
            )}
          </span>
          <span className="tooltip-label">
            <b>Precio ajustado a la inflación:</b>{" "}
            {hoverInfo.object.properties["PRECIO_AJUSTADO"].toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }
            )}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function ViviendaCard() {
  const { color, currentSection, setOutline, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(VIVIENDA_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        La zona central de Monterrey se ha convertido en un área comercial sin
        residentes. Los hogares se mudan mientras los comercios permanecen.
        Durante décadas, se ha invertido en infraestructura de transporte para
        conectar el empleo en el centro con las zonas residenciales. Esto le
        otorga un alto valor comercial al centro y hace inviable la producción
        de vivienda asequible. La vivienda económica, a la que las familias
        jóvenes tienen acceso, se construye en las periferias urbanas.
      </p>
      <ContextTitle color={color}>
        Aunque los costos de la vivienda sean menores en las periferias, otros
        costos como traslado o servicios se elevan.
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
