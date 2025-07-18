import { useState, useEffect, useMemo, useCallback } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  DATA_URL,
  INDUSTRIA_URL,
  ISLAS_CALOR_CHART_URL,
  ISLAS_CALOR_URL,
  PARQUES_URL2,
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
  DefaultTooltipContent,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import _ from "lodash";
import * as d3 from "d3";
import PopupButton from "./PopupButton";
import { fromUrl } from "geotiff";
import { rgb } from "d3-color";
import { BitmapLayer } from "@deck.gl/layers";

export const ISLAS_CALOR_COLORS = [
  "#b03a2e",
  "#e74c3c",
  "#eb984e",
  "#9ebcda",
  "#6b98d6",
  "#5b5df5",
  "#ab6fed",
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

function useHeatIslandBitmap(tifUrl) {
  const [image, setImage] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [colorMap, setColorMap] = useState(null);

  useEffect(() => {
    (async () => {
      const tiff = await fromUrl(tifUrl);
      const img = await tiff.getImage();
      const [wX, wY, eX, eY] = img.getBoundingBox();

      const categoryValues = [3, 2, 1, 0, -1, -2, -3];
      const categories = categoryValues.map((value, i) => ({
        value,
        label: ISLAS_CALOR_LEGEND_DATA[i],
        color: rgb(ISLAS_CALOR_COLORS[i])
      }));
      const colorByValue = Object.fromEntries(
        categories.map(c => [c.value, c.color])
      );

      const width = img.getWidth();
      const height = img.getHeight();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);
      const rasters = await img.readRasters();

      const rasterData = rasters[0];

      rasterData.forEach((v, i) => {
        const color = colorByValue[v];
        if (color) {
          imageData.data.set([color.r, color.g, color.b, 255], i * 4);
        } else {
          imageData.data.set([0, 0, 0, 0], i * 4); // Transparent for undefined categories
        }
      });

      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL("image/png");
      const imgEl = new Image();
      imgEl.src = url;
      imgEl.onload = () => {
        setImage(imgEl);
        setBounds([wX, wY, eX, eY]);
        setColorMap({
          title: 'Isla de calor',
          categories: categories.map(({ label, color, value }) => ({
            label, color, value
          }))
        });
      };
    })().catch(console.error);
  }, [tifUrl]);

  return { image, bounds, colorMap };
}

export const IslasCalorControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [legendItems, setLegendItems] = useState([]);
  const { data: dataParques } = useFetch(PARQUES_URL2);
  const { data: dataIndustrias } = useFetch(INDUSTRIA_URL);
  const { image: heatImage, bounds: heatBounds, colorMap } = useHeatIslandBitmap(ISLAS_CALOR_URL);

  useEffect(() => {
    if (!colorMap) return;
    console.log(colorMap);
    setLegendItems(
      separateLegendItemsByCategory(
        colorMap.categories.map(({ value }) => value),
        [7, 6, 5, 4, 3, 2, 1],
        ISLAS_CALOR_COLORS
      )
    );
  }, [colorMap]);

  if (!heatImage || !dataIndustrias || !dataParques) return <Loading />;

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
            [0, 0, 0, 50],
            [0, 0, 0, 255],
          ]}
          radiusPixels={viewState.zoom * 5}
          intensity={2}
        />
        <BitmapLayer
          id="islas_calor_layer"
          image={heatImage}
          bounds={heatBounds}
          boundsOptions={{ padding: 0.01 }}
          opacity={0.4}
          pickable={true}
          desaturate={0}
          visible={true}
        />
        <GeoJsonLayer
          id="parques_layer"
          data={cleanedGeoData(dataParques.features, "area")}
          getFillColor={[150, 200, 112]}
          getLineColor={[80, 120, 20]}
          opacity={0.3}
          getLineWidth={10}
        />
        <PopupButton
          videoId="19auBpQR8Ik"
          title="Fabián Lozano"
          subtitle="Tecnológico de Monterrey, Escuela de Ingeniería y Ciencias. (Emérito)"
          text="Bienestar climático inclusivo."
        />
      </CustomMap>
      [legendItems &&{" "}
      <CustomLegend
        title={"Islas de calor (2024)"}
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
        <LegendItem color="#647896" label="Vialidades Principales" />
        <LegendItem color="gray" label="Zonas Industriales" />
        <LegendItem color="rgb(150, 200, 112)" label="Parques" />
        <div style={{ height: "10px" }} />
        {legendItems.map((item, index) => (
          <LegendItem
            key={item.item}
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
        La Zona Metropolitana de Monterrey enfrenta un creciente fenómeno
        llamado 'efecto isla de calor' que se presenta cuando las áreas urbanas
        tienen temperaturas más altas que las rurales, debido a la presencia de
        edificios, asfalto y concreto.
      </p>
      <p>
        La infraestructura, principalmente la de estos dos materiales, retiene
        calor y lo libera gradualmente, intensificando este efecto. En el centro
        de Monterrey, la alta densidad de edificios y la falta de áreas verdes
        aumentan las temperaturas, hasta en 9°, en comparación con las zonas que
        cuentan con mayor arbolado. Esto afecta negativamente la salud y la
        calidad de vida, especialmente en verano.
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

const mappings = {
  muy_caliente: "Suelo muy caliente",
  caliente: "Suelo caliente",
  ligeramente_calido: "Suelo ligeramente cálido",
  templado: "Suelo templado",
  frio: "Suelo frío",
  ligeramente_frio: "Suelo ligeramente frío",
  muy_frio: "Suelo muy frío",
};

const CustomTooltip = (props) => {
  if (!props.active || !props.payload || props.payload.length === 0) {
    return null;
  }
  for (let i = 0; i < props.payload.length; i++) {
    props.payload[i].name =
      mappings[props.payload[i].name] || props.payload[i].name;
  }
  return <DefaultTooltipContent {...props} />;
};

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
            labelStyle={{
              fontSize: isMobile ? "10px" : "0.9dvw",
              fontWeight: "bold",
              color: "#363636",
            }}
            itemStyle={{
              fontSize: isMobile ? "10px" : "0.9dvw",
              padding: "0px",
            }}
            contentStyle={{
              borderRadius: "10px",
              padding: "5px 10px",
            }}
            content={<CustomTooltip />}
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
                    <CustomBarLabel
                      columnKey={columnKey}
                      data={filteredData}
                      inverse
                    />
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
          fontSize: isMobile ? "8px" : "min(1dvw, 1.4dvh)",
          marginTop: "-15px",
        }}
      >
        {title}
      </Heading>
    </div>
  );
};
