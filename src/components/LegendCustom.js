import { Box, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import * as d3 from "d3";

export const LegendCustom = ({
  color,
  pob05,
  area,
  guarderias,
  preescolares,
  comercios,
  salud,
}) => {
  const all = [
    {
      value: pob05,
      label: "Población de 0 a 5 años",
      color: "blue",
      formatting: (d) => d3.format(".2f")(d) + "%",
    },
    {
      value: area,
      label: "Parques",
      color: "rgb(0, 255, 0)",
      formatting: (d) => d3.format(".2f")(d) + " ha",
    },
    {
      value: guarderias,
      label: "Guarderías",
      color: "red",
      formatting: d3.format(".0f"),
    },
    {
      value: preescolares,
      label: "Preescolar",
      color: "orange",
      formatting: d3.format(".0f"),
    },
    {
      value: salud,
      label: "Equipamientos de Salud",
      color: "#7F00FF",
      formatting: d3.format(".0f"),
    },
    {
      value: comercios,
      label: "Comercios al por menor",
      color: "brown",
      formatting: d3.format(".0f"),
    },
  ];
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
    >
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>
            {all.map((item, index) => (
              <Tr fontSize="0.7dvw">
                <Td>
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  />
                </Td>
                <Td className="legend-label2">
                  <span className="legend-label2">{item.label}</span>
                </Td>
                <Td fontSize="0.7dvw" isNumeric style={{ padding: "0 10px" }}>
                  {item.formatting(item.value)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
