import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  INDUSTRIA_URL,
  ISLAS_CALOR_CHART_URL,
  ISLAS_CALOR_URL,
  PARQUES_URL,
  VIAS_URL,
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { CustomLegend } from "./CustomLegend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer, HeatmapLayer, IconLayer } from "deck.gl";
import Loading from "./Loading";

const ISLAS_CALOR_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 50, 50)",
  "rgb(255, 150, 150)",
  "rgb(255, 200, 200)",
  "rgb(250, 200, 250)",
  "rgb(150, 150, 255)",
  "rgb(50, 50, 255)",
  "rgb(0, 0, 255)",
];
const ISLAS_CALOR_LEGEND_DATA = [
  "Muy frío",
  "Frío",
  "Ligeramente frío",
  "Templado",
  "Ligeramente cálido",
  "Caliente",
  "Muy caliente",
];

export const IslasCalorControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [legendItems, setLegendItems] = useState([]);
  const { data } = useFetch(ISLAS_CALOR_URL);
  const { data: dataParques } = useFetch(PARQUES_URL);
  const { data: dataIndustrias } = useFetch(INDUSTRIA_URL);

  useEffect(() => {
    console.log(data);
    if (!data) return;
    
    const values = data.features.map((feat) => feat.properties["Value"]);
    setLegendItems(
      separateLegendItemsByCategory(
        values,
        [7, 6, 5, 4, 3, 2, 1],
        ISLAS_CALOR_COLORS
      )
    );
  }, [data]);

  if (!data) return <Loading />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        {/* <HeatmapLayer
          id="heatmap"
          data={dataIndustrias.features}
          getPosition={(d) => d.geometry.coordinates}
          getWeight={1}
          radiusPixels={30}
        /> */}
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
          opacity={0.5}
        />
        <GeoJsonLayer
          id="parques_layer"
          data={cleanedGeoData(dataParques.features, "area")}
          getFillColor={[0, 255, 0, 255]}
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
          opacity={0.4}
        />
        <GeoJsonLayer
          id="primary_routes"
          data={VIAS_URL}
          getLineColor={[200, 80, 80, 255]}
          getLineWidth={50}
        />
        <IconLayer
          id="industrias_layer"
          data={dataIndustrias.features}
          iconAtlas="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png"
          iconMapping="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json"
          getIcon={d => 'marker'}
          getPosition={d => d.geometry.coordinates}
          sizeUnits={'meters'}
          sizeScale={400}
          sizeMinPixels={6}
        />
      </CustomMap>
      <CustomLegend
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
  const chartData2 = chartData.map((d) => ({
    ...d,
    caliente_chart: (d.muy_caliente || 0) + (d.caliente || 0),
  }));

  

  return (
    <>
      <ResponseTitle color={color}>
        -----------Respuesta------------
      </ResponseTitle>
      <p>
        La Zona Metropolitana de Monterrey se enfrenta a un creciente fenómeno
        conocido como el efecto de isla de calor. Este se manifiesta cuando las
        áreas urbanas experimentan temperaturas significativamente más altas que
        sus entornos rurales, siendo una consecuencia directa de la presencia de
        edificios, asfalto, concreto y otras superficies urbanas que retienen el
        calor
      </p>
      <p>
        En el centro de la Zona Metropolitana de Monterrey, la alta densidad de
        edificaciones junto con la falta de espacios verdes como parques,
        jardines, camellones y áreas arboladas, juega un papel crucial en el
        incremento de las temperaturas, en contraste con las zonas menos
        urbanizadas. Las infraestructuras urbanas, principalmente compuestas por
        materiales como asfalto y concreto que son impermeables y retienen el
        calor, contribuyen significativamente a este fenómeno. Durante el día,
        estos materiales acumulan calor, que luego liberan gradualmente durante
        la noche. Este proceso intensifica el efecto isla de calor,
        repercutiendo adversamente en la salud, en la calidad de vida y en el
        costo de vida de los residentes, especialmente durante los meses de
        verano.
      </p>
      <br />
      <ContextTitle color={color}>
        El rápido crecimiento urbano, sumado a la escasez de infraestructura
        verde y a la falta de una planificación sostenible, agrava aún más este
        fenómeno.
      </ContextTitle>
      <Chart
        title="Islas de calor datos"
        data={chartData2}
        domain={[0, 0.25]}
        column="caliente_chart"
        columnKey="NOM_MUN"
        formatter={(d) => `${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
