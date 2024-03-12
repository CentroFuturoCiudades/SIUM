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
  sectionsInfo,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { CustomBarLabel, mappingNames } from "./Chart";
import { CustomLegend, LegendItem } from "./CustomLegend";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer, HeatmapLayer, IconLayer } from "deck.gl";
import Loading from "./Loading";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import _ from "lodash";
import * as d3 from "d3";

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
          getLineWidth={10}
        />
        <GeoJsonLayer
          id="primary_routes"
          data={VIAS_URL}
          getLineColor={[0, 0, 0, 255]}
          getLineWidth={50}
        />
      </CustomMap>
      [legendItems &&{" "}
      <CustomLegend
        title={"Islas de calor"}
        color={color}
        description={
          <>
            <b>Urban reporting based on satellite analysis (URSA)</b>
            <p>
              Las islas de calor se calculan a partir de la banda que determinan
              los satelites LANDSAT, se toma el promedio de la temperatura pixel
              por un año y se comparan la zona rural con cobertura vegetal
              circundaria. A partir de la temperatura de la desviacion estandar
              de la temperatura rural. Las zonas más calientes son aquellas que
              están más de 3 desviaciones estándar arriba de la temperatura
              rural.
            </p>
          </>
        }
      >
        <LegendItem color="black" label="Vialidades Principales" />
        <LegendItem color="gray" label="Zonas Industriales" />
        <LegendItem color="lightgreen" label="Parques" />
        <div style={{ height: "10px" }} />
        {legendItems.map((item, index) => (
          <LegendItem
            color={item.color}
            label={ISLAS_CALOR_LEGEND_DATA[item.item - 1]}
          />
        ))}
      </CustomLegend>
      ]
    </>
  );
};

export function IslasCalorCard() {
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(ISLAS_CALOR_CHART_URL, []);
  const chartData2 = chartData.map((d) => ({
    ...d,
    caliente2:
      (d.muy_caliente || 0) + (d.caliente || 0) + (d.ligeramente_calido || 0),
  }));

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        La Zona Metropolitana de Monterrey enfrenta un fenómeno creciente
        llamado efecto isla de calor. Se presenta cuando las áreas urbanas
        tienen temperaturas más altas que las rurales debido a la presencia de
        edificios, asfalto y concreto.
      </p>
      <p>
        En el centro de Monterrey, la alta densidad de edificios y la falta de
        áreas verdes aumentan las temperaturas, hasta en XXXXX°, en comparación
        a las áreas con mayor arbolado. Las infraestructuras urbanas,
        principalmente de asfalto y concreto, retienen calor y lo liberan
        gradualmente, intensificando el efecto isla de calor. Esto afecta
        negativamente la salud y la calidad de vida, especialmente en verano.
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
        formatter={(d) => d3.format(".2f")(d) + "%"}
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
  const categories = [
    "muy_caliente",
    "caliente",
    "ligeramente_calido",
    "templado",
    "ligeramente_frio",
    "frio",
    "muy_frio",
  ];
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
          <Tooltip
            formatter={formatter}
            labelStyle={{ fontSize: isMobile ? "10px" : "0.9dvw" }}
            itemStyle={{
              fontSize: isMobile ? "10px" : "0.9dvw",
              padding: "0px",
            }}
            contentStyle={{
              borderRadius: "10px",
              padding: "5px 10px",
            }}
          />
          {categories.map((key, index) => (
            <Bar
              key={key}
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
        color="gray.600"
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