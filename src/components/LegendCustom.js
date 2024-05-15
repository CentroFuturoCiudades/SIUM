import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Heading,
  Card,
  useMediaQuery,
} from "@chakra-ui/react";
import * as d3 from "d3";
import { ImCross } from "react-icons/im";

export const LegendCustom = ({
  color,
  pob05,
  area,
  guarderias,
  preescolares,
  comercios,
  salud,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const all = [
    {
      value: pob05,
      label: "Población de 0 a 5 años",
      color: "#6a2eab",
      formatting: (d) => d3.format(".2f")(d) + "%",
    },
    {
      value: area,
      label: "Parques",
      color: "#96C870",
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
      color: "#f69100",
      formatting: d3.format(".0f"),
    },
  ];
  const services = ["Preescolar", "Guarderías", "Equipamientos de Salud"];
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
      style={{ right: "20px", left: "auto" }}
    >
      <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)">
        Radio de 1 kilometro de distancia
      </Heading>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>
            {all.map((item, index) => (
              <Tr key={`legend-item-${index}`} fontSize="min(0.7dvw, 0.7dvh)">
                <Td>
                  {services.includes(item.label) ? (
                    <ImCross color={item.color} fontSize="min(1.6dvh, 0.8dvw)" />
                  ) : (
                    <Card
                      className="legend-color"
                      h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                      w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                      bg={item.color}
                      borderRadius={
                        item.label === "Comercios al por menor" ? "50%" : "15%"
                      }
                    />
                  )}
                </Td>
                <Td
                  className="custom-legend-label"
                  fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                >
                  {item.label}
                </Td>
                <Td
                  className="custom-legend-label"
                  fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
                >
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
