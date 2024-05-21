import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  EMPLEO_CHART_URL,
  EMPLEO_URL,
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  generateQuantileColors,
  sectionsInfo,
  separateLegendItems,
  useFetch,
} from "../utils/constants";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import PopupButton from "./PopupButton";
import { Slider, useToken } from "@chakra-ui/react";

const EMPLEO_QUANTILES = [0, 200, 400, 600, 1000, 3000, 5000, 10500];

export const EmpleoControls = () => {
  const { color } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.400`]);
  const endColor = "#6a2eab";
  const EMPLEO_COLORS = generateGradientColors(startColor, endColor, 8);
  const { data } = useFetch(EMPLEO_URL);
  const [hoverInfo, setHoverInfo] = useState();
  const [legendItems, setLegendItems] = useState([]);
  const column = "num_empleos_esperados";

  useEffect(() => {
    setLegendItems(separateLegendItems(EMPLEO_QUANTILES, EMPLEO_COLORS));
  }, []);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={INITIAL_STATE}>
        <GeoJsonLayer
          id="empleo_layer"
          data={cleanedGeoData(data.features, column)}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties[column],
              EMPLEO_QUANTILES,
              EMPLEO_COLORS,
              0.8
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={0}
          onHover={(info) => setHoverInfo(info)}
          pickable={true}
          autoHighlight={true}
          getPosition={(d) => d.position}
        />
        <PopupButton
          videoId="Z5yubfNSwCU"
          title="Javier Leal"
          subtitle="Instituto Municipal de Planeación Urbana de San Pedro Garza García (IMPLANG)."
          text="Beneficios de un menor tiempo de traslado."
        />
      </CustomMap>
      <Slider />
      <Legend
        title="Número de Empleos en 2023"
        legendItems={legendItems}
        description={
          <>
            <b>
              Directorio Estadístico Nacional de Unidades Económicas (DENUE)
            </b>
            <p>
              El número de empleos de cada unidad económica se aproxima con la
              mayoría de las categorías intermedias de empleo. Agregados por
              hexágono.
            </p>
          </>
        }
        color={color}
      />
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          {hoverInfo.object.properties["CVEGEO"] && (
            <span className="tooltip-label">
              <b>AGEB:</b> {hoverInfo.object.properties["CVEGEO"]}
            </span>
          )}
          {hoverInfo.object.properties["colonia"] && (
            <span className="tooltip-label">
              <b>Colonia:</b> {hoverInfo.object.properties["colonia"]}
            </span>
          )}
          <span className="tooltip-label">
            <b>Número de empleos en 2023:</b>{" "}
            {hoverInfo.object.properties[column].toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function EmpleoCard() {
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(EMPLEO_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        La migración de familias jóvenes a la periferia, reduce la población en
        centros urbanos, aumentando los desplazamientos al trabajo. Por otro
        lado, aunque los empleos continúan a diez kilómetros alrededor de la
        Macroplaza, existen ya nuevas centralidades. En 2010, el 53% de empleos
        estaba en la Macroplaza; en 2020, bajó al 47%.
      </p>
      <p>
        Sin embargo, el crecimiento de los centros de empleo se mantiene
        constante ante la migración hacia la periferia. Mientras que la
        población de Monterrey se duplicó de 1990 a 2020, la expansión urbana
        fue de 2.8 veces, incrementando el tiempo de traslado.
      </p>
      <ContextTitle color={color}>
        Se necesitan replantear los centros y subcentros económicos como
        promotores vocacionales de diversidad de usos, para combatir ese aumento
        en el desplazamiento.
      </ContextTitle>

      <Chart
        title="Número de empleos en 2020"
        data={chartData}
        domain={[0, 530000]}
        column="num_empleos_esperados"
        columnKey="municipio"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
