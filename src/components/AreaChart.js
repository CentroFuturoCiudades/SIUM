import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
            dataKey={columnKey}
            domain={domain}
            fontSize="min(1dvw, 1.2dvh)"
          />
          <YAxis
            fontSize="min(1dvw, 1.2dvh)"
            width={32}
            tickCount={5}
            tickFormatter={d3.format(",.0f")}
          />
          <Tooltip
            labelStyle={{ fontSize: "0.9dvw" }}
            itemStyle={{ fontSize: "0.9dvw", padding: "0px" }}
            formatter={d3.format(",.0f")}
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
      <Heading
        color="gray.600"
        style={{
          textAlign: "center",
          marginTop: "-15px",
          fontSize: "min(0.9dvw, 1.4dvh)",
        }}
      >
        {title}
      </Heading>
    </div>
  );
};
