import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./CustomLegend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import Loading from "./Loading";

const ISLAS_CALOR_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/islas_calor.geojson";
const ISLAS_CALOR_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/heat_island_municipality.json";
const COSTOS_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 50, 50)",
  "rgb(255, 150, 150)",
  "rgb(255, 200, 200)",
  "rgb(250, 200, 250)",
  "rgb(150, 150, 255)",
  "rgb(50, 50, 255)",
  "rgb(0, 0, 255)",
];
const ISLAS_CALOR_LEGEND_DATA = ["Muy frío", "Frío", "Ligeramente frío", "Templado", "Ligeramente cálido", "Caliente", "Muy caliente"]


// Limites visuales del mapa
const BOUNDS = {
  ne: [-100.250481, 26.871651], // Noreste
  sw: [-100.66336, 25.492987]  // Suroeste
};

export const IslasCalorControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [legendItems, setLegendItems] = useState([]);
  const { data } = useFetch(ISLAS_CALOR_URL);


  useEffect(() => {
    console.log(data)
    if (!data) return;
    const values = data.features.map((feat) => feat.properties["Value"]);
    setLegendItems(
      separateLegendItemsByCategory(
        values,
        [7, 6, 5, 4, 3, 2, 1],
        COSTOS_COLORS,
      )
    );
  }, [data]);

  if (!data) return <Loading />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}
      >
        <GeoJsonLayer
          id="islas_calor_layer"
          data={cleanedGeoData(data.features, "Value")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["Value"],
              // [7.5, 6.5, 5.5, 4.5, 3.5, 2.5, 1.5, 0.5],
              // COSTOS_COLORS,
              // 1
              [7, 6, 5, 4, 3, 2, 1],
              COSTOS_COLORS,
              0.8
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={30}
        />
      </CustomMap>
      <Legend
        title={"Islas de calor"}
        legendItems={legendItems}
        color={color}
        legendLabels={ISLAS_CALOR_LEGEND_DATA}
      />
    </>
  );
};

export function IslasCalorCard({ color }) {
  const { data: chartData } = useFetch(ISLAS_CALOR_CHART_URL, []);
  return (
    <>
      <ResponseTitle color={color}>
        -----------Respuesta------------
      </ResponseTitle>
      <p>
      En las últimas tres décadas, la mancha urbana de Monterrey ha experimentado un crecimiento exponencial, triplicándose en tamaño. Este desarrollo, si bien evidencia el dinamismo de la ciudad, también conlleva riesgos ambientales, económicos y sociales. Los recursos urbanos y ambientales, que son esenciales para el bienestar de la comunidad, son finitos y deben manejarse con responsabilidad.
      </p>
      <p>
      La <b>'mancha urbana'</b> se refiere a la expansión continua de la ciudad en términos de construcción y desarrollo. En este contexto, es crucial destacar que esta expansión no planificada y descontrolada requiere una reconsideración urgente.
      </p>
      <p>
      <b>La finitud de los recursos</b> urbanos, ambientales y la expansión aparentemente 'infinita' de la ciudad, nos hace plantearnos diversas preguntas fundamentales sobre la sostenibilidad y la gestión responsable de nuestro entorno. Enfrentar estos desafíos requiere un enfoque reflexivo y acciones concertadas para garantizar un futuro sostenible para la comunidad y el entorno en la Zona Metropolitana de Monterrey.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
      El rápido crecimiento urbano, sumado a la escasez de infraestructura verde y a la falta de una planificación sostenible, agrava aún más este fenómeno.
      </ContextTitle>
      <Chart
        title="Islas de calor datos"
        data={chartData}
        domain={[0, 0.25]}
        column="muy_caliente"
        columnKey="NOM_MUN"
        formatter={(d) => `${d.toLocaleString("en-US")}`}
        // formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
