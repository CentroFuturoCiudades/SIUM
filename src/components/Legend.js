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
        <p style={{ width: "30dvw" }}>{title}</p>
        <Tooltip
          label="Datos obtenidos de blah blah blah"
          placement="top"
          hasArrow
          gutter={12}
        >
          <InfoIcon
            boxSize={3}
            color="gray.400"
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export const Legend = ({ title, legendItems, color, description, formatter }) => {
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
      borderWidth="0.08rem"
      className="legend-container"
      style={{ width: "min-content" }}
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
        <Tooltip
          label={description}
          placement="top"
          hasArrow
          gutter={12}
        >
          <Heading color="gray.700" fontSize="0.9dvw">
            <InfoIcon
              boxSize="0.7dvw"
              color="gray.400"
              style={{ cursor: "pointer" }}
              mr="0.3dvw"
            />
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>
            {legendItems.map((item, index) => (
              <Tr key={`legend-item-${index}`} fontSize="0.7dvw">
                <Td>
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  />
                </Td>
                <Td>
                  <span className="legend-label">{formatting(item.item1)}</span>
                </Td>
                <Td>
                  <span className="legend-dash">—</span>
                </Td>
                <Td>
                  <span className="legend-label">{formatting(item.item2)}</span>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
