import {
  Bar,
  BarChart,
  Cell,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GeoJsonLayer } from "deck.gl";
import { memo, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Heading } from "@chakra-ui/react";
import { DATA_URL, useFetch } from "../utils/constants";
import { useCardContext } from "../views/Problematica";

const mappingNames = {
  "San Pedro Garza García": "San Pedro",
  "San Nicolás de los Garza": "San Nicolás",
  "Ciénega de Flores": "Ciénega",
  "General Escobedo": "Escobedo",
  "General Zuazua": "Zuazua",
  "Salinas Victoria": "Salinas",
  "Cadereyta Jiménez": "Cadereyta",
};

const CustomBarLabel = memo((props) => {
  const { x, y, width, height, index, data, columnKey } = props;
  const dataObject = data[index];
  const text = mappingNames[dataObject[columnKey]] || dataObject[columnKey];

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "0.6rem sans-serif";
  const textWidth = context.measureText(text).width;

  const fitsInside = width > textWidth + 15;
  const insideX = x + width - 5;
  const outsideX = x + width + 5;

  return (
    <text
      key={`label-${index}`}
      x={fitsInside ? insideX : outsideX}
      y={y + height / 2}
      fill="black"
      textAnchor={fitsInside ? "end" : "start"}
      dominantBaseline="middle"
      style={{
        fontSize: "0.6rem",
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
  const { setOutline } = useCardContext();
  const { data: municipalityData } = useFetch(
    `${DATA_URL}/div-municipal.geojson`,
    {features: []}
  );
  let filteredData = useMemo(
    () =>
      _(data || [])
        .filter((x) => excludedMunicipalities.indexOf(x[columnKey]) === -1)
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

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={filteredData} barCategoryGap={0}>
          <XAxis
            tickFormatter={formatter}
            type="number"
            dataKey={column}
            style={{ fontSize: "0.6rem" }}
            domain={domain}
            tickCount={15}
          />
          <YAxis type="category" dataKey={columnKey} hide />
          <Bar
            isAnimationActive={false}
            background
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
                  activeMunicipality === item[columnKey] ? "#FFAE00" : "#ffcb54"
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
        style={{ textAlign: "center", marginTop: "-15px" }}
      >
        {title}
      </Heading>
    </div>
  );
};
