import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import _ from "lodash";
import { Heading, useMediaQuery, useToken } from "@chakra-ui/react";
import * as d3 from "d3";

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
            fontSize="min(1dvw, 1.2dvh)"
            tickCount={6}
          >
            <Label
              value={title}
              position="insideBottom"
              style={{
                fontWeight: "bold",
                fontSize: isMobile ? "0.9rem" : "min(0.8dvw, 1.4dvh)",
                transform: "translateY(min(0.4dvw, 0.7dvh))",
              }}
            />
          </XAxis>
          <YAxis
            type="number"
            fontSize="min(1dvw, 1.2dvh)"
            width={32}
            tickCount={5}
            tickFormatter={formatter}
          />
          <Tooltip
            labelStyle={{ fontSize: "0.9dvw" }}
            itemStyle={{ fontSize: "0.9dvw", padding: "0px" }}
            formatter={(value) => formatter(value)}
          />
          {lines.map((lineName, index) => (
            <>
              <Area
                style={{ cursor: "pointer", pointerEvents: "none" }}
                type="monotone"
                dataKey={lineName}
                stroke={lineColors[index]}
                fillOpacity={1}
                fill={lineColors[index]}
              />
            </>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
