import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Card,
} from "@chakra-ui/react";
import * as d3 from "d3";

export const DescargasLegend = ({ legends, formatter }) => {
  const formatting = formatter || d3.format(",.0f");
  return (
    <Box
      borderRadius="md"
      borderColor="purple.100"
      borderWidth="0.08rem"
      className="legend-container"
      maxH="25%"
      style={{
        width: "min-content",
        overflowY: "scroll",
        left: "1.5dvh",
        bottom: "1.5dvh",
        borderRadius: "0.5dvh",
        zIndex: "100",
      }}
    >
      {legends.map((legend, index) => (
        <Box key={`legend-group-${index}`} mt="1dvh">
          <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)">
            {legend.title}
          </Heading>
          <TableContainer>
            <Table size="xs" variant="unstyled">
              <Tbody>
                {legend.legendItems.map((item, i) => (
                  <Tr
                    key={`legend-item-${index}-${i}`}
                    fontSize="min(0.7dvw, 0.7dvh)"
                  >
                    <Td>
                      <Card
                        className="legend-color"
                        bg={item.color}
                        borderRadius="15%"
                        h="min(1.6dvh, 0.8dvw)"
                        w="min(1.6dvh, 0.8dvw)"
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
      ))}
    </Box>
  );
};
