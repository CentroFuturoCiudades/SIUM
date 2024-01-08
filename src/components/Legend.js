import { InfoIcon } from "@chakra-ui/icons";
import { Box, Flex, Tooltip } from "@chakra-ui/react";

export const Legend = ({ title, legendItems }) => {
  if (legendItems.length === 0) {
    return null;
  }
  return (
    <Box
      borderRadius="md"
      borderColor="gray.300"
      borderWidth="0.1rem"
      className="legend-container"
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <b style={{ fontSize: "0.8rem", marginRight: '6px' }}>{title}</b>
        <Tooltip label="Datos obtenidos de blah blah blah" placement="top" hasArrow gutter={12}>
          <InfoIcon boxSize={3} color="gray.400" style={{ cursor: 'pointer' }} />
        </Tooltip>
      </div>
      {legendItems.map((item, index) => (
        <Flex key={index} className="legend-item" columns={4}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
            alignItems="center"
            justifyContent="space-between"
          />
          <div className="legend-numbers">
            <span className="legend-label">{item.item1}</span>
            <span className="legend-dash">—</span>
            <span className="legend-label">{item.item2}</span>
          </div>
        </Flex>
      ))}
    </Box>
  );
};
