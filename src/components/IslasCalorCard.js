import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./CustomLegend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import Loading from "./Loading";

// Paleta de segregación
const startColor = "#68736d";
const endColor = "#1A57FF";
const ISLAS_CALOR_COLORS = generateGradientColors(startColor, endColor, 8);

const ISLAS_CALOR_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/islas_calor.geojson";
const ISLAS_CALOR_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/heat_island_municipality.json";

const ISLAS_CALOR_LEGEND_DATA = ["Muy frío", "Frío", "Ligeramente frío", "Templado", "Ligeramente cálido", "Caliente", "Muy caliente"]

export const IslasCalorControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [legendItems, setLegendItems] = useState([]);
  const { data } = useFetch(ISLAS_CALOR_URL);

  useEffect(() => {
    if (!data) return;
    
    const values = data.features.map((feat) => feat.properties["Value"]);
    setLegendItems(
      separateLegendItemsByCategory(
        values,
        [7, 6, 5, 4, 3, 2, 1],
        ISLAS_CALOR_COLORS,
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
              [7, 6, 5, 4, 3, 2, 1],
              ISLAS_CALOR_COLORS,
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

export function IslasCalorCard() {

  const { color } = useCardContext();
  const { data: chartData } = useFetch(ISLAS_CALOR_CHART_URL, []);

  

  return (
    <>
      <ResponseTitle color={color}>
        -----------Respuesta------------
      </ResponseTitle>
      <p>
      La Zona Metropolitana de Monterrey se enfrenta a un creciente fenómeno conocido como el efecto de isla de calor. Este se manifiesta cuando las áreas urbanas experimentan temperaturas significativamente más altas que sus entornos rurales, siendo una consecuencia directa de la presencia de edificios, asfalto, concreto y otras superficies urbanas que retienen el calor
      </p>
      <p>

      En el centro de la Zona Metropolitana de Monterrey, la alta densidad de edificaciones junto con la falta de espacios verdes como parques, jardines, camellones y áreas arboladas, juega un papel crucial en el incremento de las temperaturas, en contraste con las zonas menos urbanizadas. Las infraestructuras urbanas, principalmente compuestas por materiales como asfalto y concreto que son impermeables y retienen el calor, contribuyen significativamente a este fenómeno. Durante el día, estos materiales acumulan calor, que luego liberan gradualmente durante la noche. Este proceso intensifica el efecto isla de calor, repercutiendo adversamente en la salud, en la calidad de vida y en el costo de vida de los residentes, especialmente durante los meses de verano.
      </p>
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
