import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  DefaultTooltipContent,
} from "recharts";
import _ from "lodash";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import * as d3 from "d3";

const mappings = {
  acelerada: "Crecimiento acelerado",
  inercial: "Crecimiento inercial",
  controlada: "Crecimiento controlado",
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

export const AreaChartChart = ({
  data,
  title,
  lines,
  columnKey,
  formatter,
  reducer,
  filtering,
  domain = undefined,
  lineColors,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const containerMobile = {
    height: "200px",
    bottom: "0px",
    width: "100%",
  };
  const container = {
    height: "min(15dvw, 30dvh)",
    bottom: "0px",
    position: "absolute",
    width: "100%",
  };
  return (
    <div style={isMobile ? containerMobile : container}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis
            type="number"
            dataKey={columnKey}
            domain={domain}
            tickCount={6}
            fontSize={isMobile ? "0.6rem" : "min(1dvh, 0.6dvw)"}
          >
            <Label
              value={title}
              position="insideBottom"
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "8px" : "min(1.4dvh, 0.8dvw)",
                transform: "translateY(min(0.4dvw, 0.7dvh))",
              }}
            />
          </XAxis>
          <YAxis
            type="number"
            fontSize={isMobile ? "0.6rem" : "min(1dvh, 0.8dvw)"}
            width={32}
            tickCount={5}
            tickFormatter={formatter}
          />
          <Tooltip
            labelStyle={{
              fontSize: isMobile ? "10px" : "0.9dvw",
              fontWeight: "bold",
              color: "#363636",
            }}
            itemStyle={{
              fontSize: isMobile ? "10px" : "0.9dvw",
              padding: "0px",
            }}
            formatter={(value) => formatter(value)}
            content={<CustomTooltip />}
          />
          {lines.map((lineName, index) => (
            <Area
              key={lineName}
              style={{ cursor: "pointer", pointerEvents: "none" }}
              type="monotone"
              dataKey={lineName}
              stroke={lineColors[index]}
              fillOpacity={1}
              fill={lineColors[index]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
