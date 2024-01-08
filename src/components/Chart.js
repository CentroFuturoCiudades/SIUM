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
import { memo, useMemo, useState } from "react";
import _ from "lodash";
import { Heading } from "@chakra-ui/react";

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
      x={fitsInside ? insideX : outsideX}
      y={y + height / 2}
      fill="black"
      textAnchor={fitsInside ? "end" : "start"}
      dominantBaseline="middle"
      style={{ fontSize: "0.6rem", cursor: "pointer", zIndex: 1 }}
    >
      {text}
    </text>
  );
});
const excludedMunicipalities = ["Abasolo", "Hidalgo", "El Carmen"];

export const Chart = ({
  data,
  setOutline,
  title,
  column,
  columnKey,
  formatter,
  reducer,
  filtering,
}) => {
  let filteredData = useMemo(
    () =>
      _(data)
        .filter(filtering || (() => true))
        .groupBy(columnKey)
        .map((objs, key) => ({
          [columnKey]: key,
          [column]: (reducer || _.sumBy)(objs, column),
        }))
        .value()
        .filter((x) => excludedMunicipalities.indexOf(x[columnKey]) === -1)
        .sort((a, b) => b[column] - a[column]),
    [data, columnKey, column, reducer, filtering]
  );
  let domain = useMemo(() => {
    const tempData = data.map((x) => x[column]);
    return data.length > 0
      ? [Math.min(...tempData) * 0.99, Math.max(...tempData) * 1.01]
      : undefined;
  }, [data, column]);
  const [activeMunicipality, setActiveMunicipality] = useState(null);
  const [mouseLeave, setMouseLeave] = useState(true);
  const handleMouseMove = (state) => {
    if (state && (state.activeLabel === activeMunicipality || mouseLeave)) {
      setOutline({
        type: GeoJsonLayer,
        props: {
          id: "municipality-layer",
          data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/div-municipal.geojson",
          dataTransform: (d) =>
            d.features.filter((x) => x.properties.NOMGEO === state.activeLabel),
          getFillColor: [255, 174, 0, 10],
          getLineColor: [255, 174, 0, 200],
          getLineWidth: 120,
        },
      });
      setActiveMunicipality(state.activeLabel);
      setMouseLeave(false);
    } else {
      setOutline(null);
      setActiveMunicipality(null);
      setMouseLeave(true);
    }
  };
  return (
    <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          layout="vertical"
          data={filteredData}
          onMouseMove={handleMouseMove}
          barCategoryGap={0}
        >
          <XAxis
            tickFormatter={formatter}
            type="number"
            dataKey={column}
            style={{ fontSize: "0.6rem" }}
            domain={domain}
            tickCount={15}
          />
          <YAxis type="category" dataKey={columnKey} hide />
          <Bar background dataKey={column} style={{ cursor: "pointer" }}>
            <LabelList
              content={
                <CustomBarLabel columnKey={columnKey} data={filteredData} />
              }
            />
            {filteredData.map((item, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  activeMunicipality && activeMunicipality === item[columnKey]
                    ? "#FFAE00"
                    : "#ffcb54"
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
