import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useMediaQuery,
  Text,
  Card,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";

export const LegendMobile = ({ title, legendItems, formatting }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (legendItems.length == 0) return;
    const upperBounds = legendItems.map((item) => parseFloat(item.item2));

    const range = legendItems.map((item) => item.color);
    const linear = d3.scaleLinear().domain(upperBounds).range(range);

    const svg = d3.select(svgRef.current);

    svg.selectAll(".legendLinear").remove();
    const height =
      (svg.node().getBoundingClientRect().height * 0.8) / legendItems.length;

    const legendLinear = legendColor()
      .shapeWidth(5)
      .shapeHeight(height)
      .shapePadding(2)
      .labelOffset(5)
      .labelFormat(formatting)
      .orient("vertical")
      .scale(linear)
      .cells(upperBounds);

    const legendGroup = svg
      .append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(10,10)")
      .call(legendLinear);
    legendGroup.selectAll(".label").attr("transform", (d, i) => {
      let yPosition = i + height;
      return `translate(10, ${yPosition})`;
    });
  }, [legendItems, title]);

  return (
    <div
      style={{
        height: "40dvh",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        left: "0px",
        top: "0px",
        bottom: "0px",
        pointerEvents: "none",
      }}
    >
      <svg
        style={{
          height: "100%",
        }}
        ref={svgRef}
        width={110}
      ></svg>
      <div style={{ display: "flex", marginLeft: "10px" }}>
        <Heading color="gray.700" fontSize="10px" style={{ width: "30dvw" }}>
          {title}
        </Heading>
      </div>
    </div>
  );
};

export const Legend = ({
  title,
  legendItems,
  color,
  description,
  formatter,
}) => {
  const formatting = formatter || d3.format(",.0f");
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  if (isMobile)
    return (
      <LegendMobile
        title={title}
        legendItems={legendItems}
        color={color}
        formatting={formatting}
      />
    );
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      className="legend-container"
      bottom="10dvh"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "5px",
          marginTop: "5px",
        }}
      >
        <Tooltip label={description} placement="top" hasArrow gutter={12}>
          <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)">
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>
            {legendItems.map((item, index) => (
              <Tr key={`legend-item-${index}`} fontSize="min(0.7dvw, 0.7dvh)">
                <Td>
                  <Card
                    className="legend-color"
                    bg={item.color}
                    borderRadius="15%"
                    h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                    w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                  />
                </Td>
                <Td className="legend-label">{formatting(item.item1)}</Td>
                <Td className="legend-dash">—</Td>
                <Td className="legend-label">{formatting(item.item2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
