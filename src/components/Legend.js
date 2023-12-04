import { Box, Flex } from "@chakra-ui/react";

export const Legend = ({ title, legendItems }) => {
  if (legendItems.length === 0) {
    return null;
  }
  return (
    <Box borderRadius="md" borderColor="gray" borderWidth="0.5px" className="legend-container">
      <b style={{ fontSize: "0.8rem" }}>{title}</b>
      {legendItems.map((item, index) => (
        <Flex key={index} className="legend-item" columns={4}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
            alignItems="center" justifyContent="space-between"
          />
          <span className="legend-label">{item.item1}</span>
          <span className="legend-label"> - </span>
          <span className="legend-label">{item.item2}</span>
        </Flex>
      ))}
    </Box>
  );
};
