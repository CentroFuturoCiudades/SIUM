import { useState, useEffect, useMemo, useCallback } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  DATA_URL,
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
import { Chart, CustomBarLabel, mappingNames } from "./Chart";
import { Legend } from "./CustomLegend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer, HeatmapLayer, IconLayer } from "deck.gl";
import Loading from "./Loading";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import _ from "lodash";

// Usar paleta de segregación
// const startColor = "#68736d";
// const endColor = "#1A57FF";
// const ISLAS_CALOR_COLORS = generateGradientColors(startColor, endColor, 8);

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
        <HeatmapLayer
          id="heatmap"
          data={dataIndustrias.features}
          getPosition={(d) => d.geometry.coordinates}
          getWeight={1}
          // use grey color to indicate intensity
          colorRange={[
            [0, 0, 0, 0],
            [0, 0, 0, 255],
          ]}
          radiusPixels={30}
          intensity={3}
        />
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
          getLineWidth={0}
          opacity={0.7}
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
  const { color, setOutline } = useCardContext();
  const { data: chartData } = useFetch(ISLAS_CALOR_CHART_URL, []);
  const chartData2 = chartData.map((d) => ({
    ...d,
    caliente2:
      (d.muy_caliente || 0) + (d.caliente || 0) + (d.ligeramente_calido || 0),
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
      <ContextTitle color={color}>
        El rápido crecimiento urbano, sumado a la escasez de infraestructura
        verde y a la falta de una planificación sostenible, agrava aún más este
        fenómeno.
      </ContextTitle>
      <IslasCalorChart
        title="Islas de calor datos"
        data={chartData2}
        domain={[0, 100]}
        column="caliente2"
        columnKey="NOM_MUN"
        formatter={(d) => `${d.toLocaleString("en-US")}`}
      />
    </>
  );
}

export const IslasCalorChart = ({
  data,
  title,
  column,
  columnKey,
  formatter,
  reducer,
  filtering,
  domain = undefined,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { setOutline } = useCardContext();
  const { data: municipalityData } = useFetch(
    `${DATA_URL}/div-municipal.geojson`,
    { features: [] }
  );
  let filteredData = useMemo(
    () =>
      _(data || [])
        .filter((x) => mappingNames[x[columnKey]])
        .filter((x) => !filtering || filtering(x))
        .value()
        .sort((a, b) => b[column] - a[column]),
    [data, columnKey, column, reducer, filtering]
  );
  console.log(filteredData);
  const [activeMunicipality, setActiveMunicipality] = useState(null);
  const handleMouseMove = useCallback(
    (activeLabel) => {
      setOutline({
        type: GeoJsonLayer,
        props: {
          id: "municipality-layer",
          data: municipalityData.features.filter(
            (x) => x.properties.NOMGEO === activeLabel
          ),
          getFillColor: [255, 174, 0, 80],
          getLineColor: [255, 174, 0, 250],
          getLineWidth: 120,
        },
      });
      setActiveMunicipality(activeLabel);
    },
    [data]
  );
  const containerMobile = {
    height: "200px",
    bottom: "-10px",
    width: "100%",
  };
  const container = {
    height: "min(15dvw, 30dvh)",
    bottom: "-10px",
    position: "absolute",
    width: "100%",
  };
  console.log(filteredData);
  const categories = [
    "muy_caliente",
    "caliente",
    "ligeramente_calido",
    "templado",
    "ligeramente_frio",
    "frio",
    "muy_frio",
  ];
  console.log(activeMunicipality);
  return (
    <div style={isMobile ? containerMobile : container}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={filteredData} barCategoryGap={0}>
          <XAxis
            tickFormatter={formatter}
            type="number"
            dataKey={column}
            style={{ fontSize: isMobile ? "0.6rem" : "min(1dvw, 1.2dvh)" }}
            domain={domain}
            tickCount={8}
          />
          <YAxis type="category" dataKey={columnKey} hide />
          {categories.map((key, index) => (
            <Bar
              isAnimationActive={false}
              stackId="bars"
              fill={ISLAS_CALOR_COLORS[index]}
              dataKey={key}
              style={{ cursor: "pointer", pointerEvents: "none" }}
            >
              {index === 2 && (
                <LabelList
                  content={
                    <CustomBarLabel columnKey={columnKey} data={filteredData} />
                  }
                />
              )}
              {filteredData.map((item, index) => (
                <Cell
                  key={`cell-${item[columnKey]}`}
                  onMouseEnter={() => handleMouseMove(item[columnKey])}
                  onMouseLeave={() => {
                    setOutline(null);
                    setActiveMunicipality(null);
                  }}
                  opacity={activeMunicipality === item[columnKey] ? 1 : 0.7}
                  style={{ cursor: "pointer", transition: "fill 0.05s ease" }}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <Heading
        size="xs"
        color="green.700"
        style={{
          textAlign: "center",
          fontSize: isMobile ? "0.9rem" : "min(1dvw, 1.4dvh)",
          marginTop: "-15px",
        }}
      >
        {title}
      </Heading>
    </div>
  );
};
