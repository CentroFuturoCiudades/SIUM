import { InfoIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";

export const Legend = ({ title, legendItems, color }) => {
  if (legendItems.length === 0) {
    return null; 
  } 
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
      width="210px"
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', marginTop: '5px' }}>
        <Heading size="xs" color="gray.700">{title}</Heading>
        <Tooltip label="Datos obtenidos de blah blah blah" placement="top" hasArrow gutter={12}>
          <InfoIcon boxSize={3} color="gray.400" style={{ cursor: 'pointer' }} marginLeft="0.6rem" />
        </Tooltip>
      </div>
      {legendItems.map((item, index) => (
        <Flex key={index} className="legend-item" columns={4}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
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
