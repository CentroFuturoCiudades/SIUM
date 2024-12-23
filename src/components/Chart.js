import {
  Bar,
  BarChart,
  Cell,
  DefaultTooltipContent,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GeoJsonLayer } from "deck.gl";
import { memo, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Box, Heading, useMediaQuery, useToken } from "@chakra-ui/react";
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
  Monterrey: "Monterrey",
  Juárez: "Juarez",
  Apodaca: "Apodaca",
  García: "Garcia",
  "Santa Catarina": "Santa Catarina",
  Guadalupe: "Guadalupe",
  Pesquería: "Pesqueria",
  Santiago: "Santiago",
  "El Carmen": "El Carmen",
  Hidalgo: "Hidalgo",
};
const mappings = {
  population_change: "Cambio de población",
  creditos: "Créditos acumulados",
  per_ocu: "Número de empleos",
  TiempoTraslado: "Tiempo de traslado",
  ratio_pob05: "Población de 0 a 5 años",
  income_pc: "Ingreso per cápita",
  num_crimen: "Número de delitos",
  violencia_familiar: "Casos de violencia familiar",
  robo_transeunte: "Casos de robo a transeúnte",
  robo_negocio: "Casos de robo a negocio",
  robo_casa: "Casos de robo a casa",
  muy_caliente: "Clima muy caliente",
  caliente: "Clima caliente",
  ligeramente_calido: "Clima ligeramente cálido",
  templado: "Clima templado",
  frio: "Clima frío",
  muy_frio: "Clima muy frío",
  acelerada: "Crecimiento acelerado",
  inercial: "Crecimiento inercial",
  controlada: "Crecimiento controlado",
};

export const CustomBarLabel = memo((props) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { x, y, width, height, index, data, columnKey } = props;
  const dataObject = data[index];
  const text = mappingNames[dataObject[columnKey]] || dataObject[columnKey];

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "min(0.6dvw, 1.2dvh)";
  const textWidth = context.measureText(text).width;

  const fitsInside = width > textWidth * 2;
  const insideX = x + width - 5;
  const outsideX = x + width + 5;

  return (
    <text
      key={`label-${index}`}
      x={width <= 0 ? x + 5 : fitsInside ? insideX : outsideX}
      y={y + height / 2}
      fill={fitsInside && !props.inverse ? "white" : "#363636"}
      textAnchor={fitsInside ? "end" : "start"}
      dominantBaseline="middle"
      style={{
        fontSize: isMobile ? "0.6rem" : "min(0.6dvw, 1.2dvh)",
        cursor: "pointer",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {text}
    </text>
  );
});

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
          getLineColor: [255, 174, 0, 0],
          getLineWidth: 120,
        },
      });
      setActiveMunicipality(activeLabel);
    },
    [data]
  );
  const containerMobile = {
    height: "200px",
    width: "100%",
  };
  const container = {
    height: "min(50dvw, 25dvh)",
    bottom: "0px",
    position: "absolute",
    width: "100%",
  };

  return (
    <div style={isMobile ? containerMobile : container}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={filteredData}
          barCategoryGap={0}
          stroke="none"
        >
          <Tooltip
            content={<CustomTooltip />}
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
              borderColor: colorValue,
              borderRadius: "6px",
              padding: "5px 10px",
            }}
          />
          <XAxis
            tickFormatter={formatter}
            type="number"
            dataKey={column}
            style={{ fontSize: isMobile ? "0.6rem" : "min(1dvw, 1.2dvh)" }}
            domain={domain}
            tickCount={8}
          >
            <Label
              value={title}
              position="insideBottom"
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "8px" : "min(0.8dvw, 1.4dvh)",
                transform: "translateY(min(0.4dvw, 0.7dvh))",
              }}
            />
          </XAxis>
          <YAxis type="category" dataKey={columnKey} hide />
          <Bar
            isAnimationActive={false}
            background={{ fill: "white", strokeWidth: 1, stroke: "white" }}
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
    </div>
  );
};
