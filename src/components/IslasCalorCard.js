import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import Loading from "./Loading";

const ISLAS_CALOR_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/islas_calor.geojson";
const SEGREGACION_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income_municipality.json";
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

  // Sleccionar solo valores dentro de un rango
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Obtener los valores de los límites del viewport
  const enforceBounds = (viewState) => {
    const clampedLongitude = clamp(viewState.longitude, BOUNDS.sw[0], BOUNDS.ne[0]);
    const clampedLatitude = clamp(viewState.latitude, BOUNDS.sw[1], BOUNDS.ne[1]);
    return { ...viewState, longitude: clampedLongitude, latitude: clampedLatitude };
  };

  // Asignar el viewport
  const onViewportChange = (newViewState) => {
    const boundedViewState = enforceBounds(newViewState);
    setViewState(boundedViewState);
  };

  useEffect(() => {
    console.log(data);
    if (!data) return;
    const values = data.features.map((feat) => feat.properties["Value"]);
    setLegendItems(
      separateLegendItems(
        values,
        [7, 6, 5, 4, 3, 2, 1],
        COSTOS_COLORS,
      )
    );
  }, [data]);

  if (!data) return <Loading />;

  return (
    <>
      {/* <CustomMap viewState={viewState} setViewState={setViewState} */}
      <CustomMap viewState={viewState} setViewState={onViewportChange}
      >
        <GeoJsonLayer
          id="islas_calor_layer"
          data={cleanedGeoData(data.features, "Value")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["Value"],
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
      />
    </>
  );
};

export function IslasCalorCard({ color }) {
  const { data: chartData } = useFetch(SEGREGACION_CHART_URL, []);
  return (
    <>
      <ResponseTitle color={color}>
        Hay que llevar servicios públicos más lejos
      </ResponseTitle>
      <p>
        Incidencias delictivas como el robos en calles o a viviendas, así como
        violencia familiar se concentran en regiones segregadas.
      </p>
      <p>
        Estar alejado de actividades económicas como el comercio al por mayor
        aumentan la incidencia delictiva, mientras que estar cercano a centros
        con comercio al por menor la disminuyen.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La malas condiciones de vida en zonas marginadas contribuyen a la falta
        de oportunidades y a la delincuencia.
      </ContextTitle>
      <Chart
        title="Islas de calor datos"
        data={chartData}
        domain={[5000, 35000]}
        column="income_pc"
        columnKey="nom_mun"
        formatter={(d) => `$${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
