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

export const Chart = ({
  data,
  setOutline,
  column,
  columnKey,
  formatter,
  reducer,
}) => {
  let filteredData = useMemo(
    () =>
      _(data)
        .groupBy(columnKey)
        .map((objs, key) => ({
          [columnKey]: key,
          [column]: (reducer || _.sumBy)(objs, column),
        }))
        .value()
        .sort((a, b) => b[column] - a[column])
        .slice(0, 12),
    [data, columnKey, column, reducer]
  );
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
    <ResponsiveContainer width="100%" height={250}>
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
          style={{ fontSize: "0.8rem" }}
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
  );
};
