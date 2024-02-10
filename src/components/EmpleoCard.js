import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  EMPLEO_CHART_URL,
  EMPLEO_URL,
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
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
import { Slider, useToken } from "@chakra-ui/react";

const EMPLEO_QUANTILES = [0, 50, 200, 400, 800, 1000, 2000, 8400];

export const EmpleoControls = () => {
  const { color } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.600`]);
  const endColor = "#1A57FF";
  const EMPLEO_COLORS = generateGradientColors(startColor, endColor, 7);
  const { data } = useFetch(EMPLEO_URL);
  const [hoverInfo, setHoverInfo] = useState();
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    setLegendItems(separateLegendItems(EMPLEO_QUANTILES, EMPLEO_COLORS));
  }, []);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={INITIAL_STATE}>
        <GeoJsonLayer
          id="empleo_layer"
          data={cleanedGeoData(data.features, "Empleos")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["Empleos"],
              EMPLEO_QUANTILES,
              EMPLEO_COLORS,
              0.7
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
      <Slider />
      <Legend
        title="Número de Empleos en 2020"
        legendItems={legendItems}
        color={color}
      />
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>Número de empleos en 2020:</b>{" "}
            {hoverInfo.object.properties["Empleos"].toLocaleString("en-US")}
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
        La migración de las familias jóvenes hacia la periferia provoca una
        disminución de población en centros y subcentros urbanos, genera un
        aumento en los desplazamientos hacia los lugares de empleo.
      </p>
      <p>
        Aunque{" "}
        <b>
          la mayoría de los empleos continúan concentrándose en el centro, a
          unos diez kilómetros alrededor de la Macroplaza
        </b>
        , han surgido nuevas centralidades. En 2010, el 53% de los empleos se
        concentraba en esta zona, disminuyó al 47% en el 2020.{" "}
        <b>
          Los ritmos de crecimiento de los centros de empleo son menores en
          comparación con la migración hacia la periferia urbana.
        </b>
      </p>
      <p>
        Durante el periodo de 1990 a 2020, la población de la Zona Metropolitana
        de Monterrey se duplicó, mientras que la expansión de la mancha urbana
        creció a un ritmo de 2.8 veces,{" "}
        <b>incrementando el tiempos de traslado en la ciudad.</b>
      </p>
      <ContextTitle color={color}>
        Incrementar la atracción de personas a centros y subcentros urbanos para
        una mejor accesibilidad a empleos.
      </ContextTitle>

      <Chart
        title="Número de empleos en 2020"
        data={chartData}
        domain={[0, 530000]}
        column="per_ocu"
        columnKey="nom_mun"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
