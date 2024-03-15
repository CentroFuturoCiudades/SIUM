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
      color: "#91baa5",
      formatting: (d) => d3.format(".2f")(d) + " ha",
    },
    {
      value: guarderias,
      label: "Guarderías",
      color: "#8b0b0b",
      formatting: d3.format(".0f"),
    },
    {
      value: preescolares,
      label: "Preescolar",
      color: "#1f562f",
      formatting: d3.format(".0f"),
    },
    {
      value: salud,
      label: "Equipamientos de Salud",
      color: "#e95481",
      formatting: d3.format(".0f"),
    },
    {
      value: comercios,
      label: "Comercios al por menor",
      color: "#ff7130",
      formatting: d3.format(".0f"),
    },
  ];
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
      style={{ right: "20px", left: "auto" }}
    >
      <p>Radio de 1 kilometro de distancia</p>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>
            {all.map((item, index) => (
              <Tr key={`legend-item-${index}`} fontSize="0.7dvw">
                <Td>
                  {item.label === "Preescolar" || item.label === "Guarderías" || item.label === "Equipamientos de Salud" ? (
                    <div
                      className="legend-symbol"
                      style={{
                        color: item.color,
                        fontSize: "2.3em",
                        lineHeight: "0.8em",
                        marginRight: "5px",
                        fontWeight: "bold"
                      }}
                    >
                      X
                    </div>
                  ) : (
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor: item.color,
                        borderRadius: item.label === "Comercios al por menor" ? "50%" : "0%",
                      }}
                    />
                  )}
                </Td>
                <Td className="legend-label2">
                  <span className="legend-label2">{item.label}</span>
                </Td>
                <Td>
                  <b>{item.formatting(item.value)}</b>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
