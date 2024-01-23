import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
  useFetch,
} from "../utils/constants";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";

function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) { 
      factor = 0.5; 
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(rgb) {
  return "#" + rgb.map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}

function lightenColor(color, factor) {
  var lightened = color.map(function (c) {
      return Math.min(255, Math.round(c + 255 * factor));
  });
  return lightened;
}

function generateGradientColors(startColor, endColor, steps) {
  var gradientColors = [];
  var startLight = lightenColor(hexToRgb(startColor), 0.5); // Adjust factor as needed
  var endLight = lightenColor(hexToRgb(endColor), 0.5);   // Adjust factor as needed
  var halfSteps = Math.floor(steps / 2);

  for (var i = 0; i < halfSteps; i++) {
      gradientColors.push(rgbToHex(interpolateColor(hexToRgb(startColor), startLight, i / (halfSteps - 1))));
  }

  for (var i = 0; i < halfSteps; i++) {
      gradientColors.push(rgbToHex(interpolateColor(endLight, hexToRgb(endColor), i / (halfSteps - 1))));
  }

  return gradientColors;
}

const startColor = "#998f5d";
const endColor = "#1A57FF";

const EMPLEO_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json";
const EMPLEO_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/empleo_municipality.json";
const EMPLEO_COLORS = generateGradientColors(startColor, endColor, 7);

export const EmpleoControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(EMPLEO_URL);
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    if (!data) return;
    const valuesEmpleos = data.features.map(
      (feat) => feat.properties["Empleos"]
    );
    setLegendItems(
      separateLegendItems(
        valuesEmpleos,
        [0, 50, 200, 400, 800, 1000, 2000, 8400],
        EMPLEO_COLORS,
      )
    );
  }, [data]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="empleo_layer"
          data={cleanedGeoData(data.features, "Empleos")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["Empleos"],
              [0, 50, 200, 400, 800, 1000, 2000, 8400],
              EMPLEO_COLORS,
              0.7
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
        />
      </CustomMap>
      <Legend
        title="Número de Empleos en 2020"
        legendItems={legendItems}
        color={color}
      />
    </>
  );
};

export function EmpleoCard() {
  const { color, setOutline } = useCardContext();
  const { data: chartData } = useFetch(EMPLEO_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        Principalmente en el centro, aunque hay nuevas centralidades.
      </ResponseTitle>
      <p>
        La migración de las familias jóvenes hacia la periferia provoca una
        disminución de la población en centros y subcentros urbanos, generando
        un aumento en los desplazamientos hacia los lugares de empleo.
      </p>
      <p>
        Aunque{" "}
        <b>
          la mayoría de los empleos continúan concentrándose en el centro, a
          unos diez kilómetros alrededor de la Macroplaza
        </b>
        , también han surgido nuevas centralidades. En 2010, el 53% de los
        empleos se concentraba en esta zona, cifra que disminuyó al 47% para el
        año 2020. Destaca que los{" "}
        <b>
          ritmos de crecimiento de los centros de empleo son menores en
          comparación con la migración residencial hacia la periferia urbana.
        </b>
      </p>
      <p>
        Durante el periodo de 1990 a 2020, la población de la Zona Metropolitana
        de Monterrey se duplicó, mientras que la expansión de la mancha urbana
        creció a un ritmo de 2.8 veces,{" "}
        <b>
          incrementando el tiempo de traslado a diferentes servicios y
          equipamientos.
        </b>
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
