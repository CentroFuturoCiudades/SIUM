import { InfoIcon } from "@chakra-ui/icons";
import { Box, Heading, Tooltip } from "@chakra-ui/react";

export const LegendCustom = ({ title, info1, color, title2, legendItems }) => {
  if (legendItems.length === 0) {
    return null;
  }
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
      width="200px"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "left",
          marginBottom: "0px",
          marginTop: "5px",
        }}
      >
        <Heading size="xs" color="gray.700">
          {title}
        </Heading>
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
            marginLeft="0.6rem"
          />
        </Tooltip>
      </div>
      <div style={{ alignItems: "center" }}>
        <span className="legend-label">{info1}%</span>
        <Heading size="xs" color="gray.700">
          {title2}
        </Heading>
      </div>
      {legendItems.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          />
          <div className="legend-numbers">
            <span className="legend-label" style={{ whiteSpace: "nowrap" }}>
              {item.item1}:
            </span>
            <span className="legend-label">{item.item2}</span>
          </div>
        </div>
      ))}
    </Box>
  );
};
