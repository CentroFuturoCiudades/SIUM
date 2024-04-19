import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import * as d3 from "d3";

export const DescargasLegend = ({
  legends,
  formatter,
  }) => {
    const formatting = formatter || d3.format(",.0f");
    return (
        <Box
          borderRadius="md"
          borderWidth="0.08rem"
          className="legend-container"
          style={{ width: "min-content", maxHeight: "200px", overflowY: "auto" }}
        >
          <div
            style={{
              width: "100%",
              marginBottom: "5px",
              marginTop: "5px",
            }}
          >
          </div>
          {legends.map((legend, index) => (
            <div key={`legend-group-${index}`}>
              <Heading color="gray.700" fontSize="min(1.6dvh, 0.8dvw)">
                {legend.title}
              </Heading>
              <TableContainer>
                <Table size="xs" variant="unstyled">
                  <Tbody>
                    {legend.legendItems.map((item, i) => (
                      <Tr key={`legend-item-${index}-${i}`} fontSize="0.7dvw">
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
            </div>
          ))}
        </Box>
      );
  };