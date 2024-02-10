import React, { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Problematica";
import {
  separateLegendItems,
  cleanedGeoData,
  useFetch,
  EXPANSION_URL,
  EXPANSION_CHART_URL,
  generateGradientColors,
  sectionsInfo,
} from "../utils/constants";
import "../index.css";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean } from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Legend } from "./Legend";
import { CustomMap, INITIAL_STATE } from "../components/CustomMap";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import { useToken } from "@chakra-ui/react";

const EXPANSION_QUANTILES = [-5100, -2000, -1000, 0, 2000, 4000, 6000, 11100];

const marks = [
  { value: 1990, label: "1990-2020" },
  { value: 2000, label: "2000-2020" },
  { value: 2010, label: "2010-2020" },
];

export const ExpansionUrbanaControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.600`]);
  const endColor = "#1A57FF";
  const EXPANSION_COLORS = generateGradientColors(startColor, endColor, 8);
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(EXPANSION_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(1990, 2010, 10, 2000, false);

  useEffect(() => {
    setLegendItems(separateLegendItems(EXPANSION_QUANTILES, EXPANSION_COLORS));
  }, []);

  useEffect(() => {
    setSharedProps({ time });
  }, [time]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={INITIAL_STATE}>
        <GeoJsonLayer
          id="expansion_layer"
          data={cleanedGeoData(data.features, time)}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties[time],
              EXPANSION_QUANTILES,
              EXPANSION_COLORS,
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
        title={`Cambio Poblacional de ${time} a 2020`}
        legendItems={legendItems}
        color={color}
      />
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
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>Cambio poblacional de 1990 a 2000:</b>{" "}
            {hoverInfo.object.properties["1990"].toLocaleString("en-US")}{" "}
            <>personas</>
          </span>
          <span className="tooltip-label">
            <b>Cambio poblacional del 2000 a 2010:</b>{" "}
            {hoverInfo.object.properties["2000"].toLocaleString("en-US")}{" "}
            <>personas</>
          </span>
          <span className="tooltip-label">
            <b>Cambio poblacional del 2010 a 2020:</b>{" "}
            {hoverInfo.object.properties["2010"].toLocaleString("en-US")}{" "}
            <>personas</>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function ExpansionUrbanaCard() {
  const { color, currentSection, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(EXPANSION_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        <b>En 1990</b>, las familias jóvenes, con edades entre 19 y 65 años,
        residían principalmente en las zonas centrales de la zona metropolitana,
        Monterrey, Guadalupe, San Pedro y San Nicolás.
      </p>
      <p>
        <b>En 2020</b>, en contraste, las familias jóvenes han migrado hacia la
        periferia, estableciéndose en lugares como Juárez, García, Apodaca,
        Santa Catarina y General Zuazua. Los adultos mayores permanecen en la
        zona central.
      </p>
      <p>
        En los últimos años, ha habido un cambio significativo en la
        distribución de la población. Existe la necesidad de una adaptación de
        las políticas públicas y servicios urbanos a las nuevas dinámicas. Una
        de las causas principales de la migración de los hogares jóvenes a la
        periferia urbana es la falta de una oferta de vivienda adecuada a su
        nivel de ingreso y estilo de vida en la zona central.
      </p>
      <ContextTitle color={color}>
        Promover la densificación y optar por soluciones habitacionales
        asequibles, fomentará la permanencia de una demografía diversa en las
        centralidades
      </ContextTitle>

      <Chart
        title={`Cambio poblacional de ${sharedProps.time} a 2020`}
        data={chartData}
        column="population_change"
        columnKey="nom_mun"
        domain={[-85000, 540000]}
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
        reducer={_.meanBy}
        filtering={(x) => x.year == sharedProps.time}
      />
    </>
  );
}
