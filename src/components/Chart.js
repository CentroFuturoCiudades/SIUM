import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GeoJsonLayer } from "deck.gl";
import { memo, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import { DATA_URL, useFetch } from "../utils/constants";
import { useCardContext } from "../views/Problematica";

export const mappingNames = {
  "San Pedro Garza García": "San Pedro",
  "San Nicolás de los Garza": "San Nicolas",
  "Ciénega de Flores": "Cienega",
  "General Escobedo": "Escobedo",
  "General Zuazua": "Zuazua",
  "Salinas Victoria": "Salinas",
  "Cadereyta Jiménez": "Cadereyta",
  "Monterrey": "Monterrey",
  "Juárez": "Juarez",
  "Apodaca": "Apodaca",
  "García": "Garcia",
  "Santa Catarina": "Santa Catarina",
  "Guadalupe": "Guadalupe",
  "Pesquería": "Pesqueria",
  "Santiago": "Santiago",
  "El Carmen": "El Carmen",
  "Hidalgo": "Hidalgo",
};

const CustomBarLabel = memo((props) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { x, y, width, height, index, data, columnKey } = props;
  const dataObject = data[index];
  const text = mappingNames[dataObject[columnKey]] || dataObject[columnKey];

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "0.6rem sans-serif";
  const textWidth = context.measureText(text).width;

  const fitsInside = width > textWidth + 30;
  const insideX = x + width - 5;
  const outsideX = x + width + 5;

  return (
    <text
      key={`label-${index}`}
      x={width <= 0 ? x + 5 : fitsInside ? insideX : outsideX}
      y={y + height / 2}
      fill={fitsInside ? "white" : "grey"}
      textAnchor={fitsInside ? "end" : "start"}
      dominantBaseline="middle"
      style={{
        fontSize: isMobile ? "0.6rem" : "min(1dvw, 1.2dvh)",
        cursor: "pointer",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {text}
    </text>
  );
});
const excludedMunicipalities = ["Abasolo", "Hidalgo", "El Carmen"];

export const Chart = ({
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
  const { setOutline, color } = useCardContext();
  const [colorValue] = useToken("colors", [`${color}.400`]);
  const [colorValueActive] = useToken("colors", [`${color}.600`]);
  const { data: municipalityData } = useFetch(
    `${DATA_URL}/div-municipal.geojson`,
    { features: [] }
  );
  let filteredData = useMemo(
    () =>
      _(data || [])
        .filter((x) => mappingNames[x[columnKey]])
        .filter((x) => !filtering || filtering(x))
        .groupBy(columnKey)
        .map((objs, key) => ({
          [columnKey]: key,
          [column]: (reducer || _.sumBy)(objs, column),
        }))
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
          id: "municipality-highlight-layer",
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
          <Bar
            isAnimationActive={false}
            background={{ fill: "white" }}
            dataKey={column}
            style={{ cursor: "pointer", pointerEvents: "none" }}
          >
            <LabelList
              content={
                <CustomBarLabel columnKey={columnKey} data={filteredData} />
              }
            />
            {filteredData.map((item, index) => (
              <Cell
                key={`cell-${item[columnKey]}`}
                onMouseEnter={() => handleMouseMove(item[columnKey])}
                onMouseLeave={() => {
                  setOutline(null);
                  setActiveMunicipality(null);
                }}
                fill={
                  activeMunicipality === item[columnKey]
                    ? colorValueActive
                    : colorValue
                }
                style={{ cursor: "pointer", transition: "fill 0.05s ease" }}
              />
            ))}
          </Bar>
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
