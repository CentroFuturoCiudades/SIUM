import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useEffect } from "react";
import _ from "lodash";
import { Heading } from "@chakra-ui/react";

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

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={columnKey}
            domain={domain}
            // tickCount={40}
          />
          <YAxis/>
          <Tooltip />
          {lines.map((lineName, index) => (
            <>
            <defs>
              <linearGradient id={lineName} >
                <stop offset="5%" stopColor={lineColors[index]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={lineColors[index]} stopOpacity={0} />
              </linearGradient>

            </defs>
              <Area style={{ cursor: "pointer", pointerEvents: "none" }} type="monotone" dataKey={lineName} stroke={lineColors[index]} fillOpacity={1} fill={`url(#${lineName})`} />
              </>

            ))}
        </AreaChart>
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
