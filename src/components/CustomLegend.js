import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tooltip,
  Tr,
  useMediaQuery,
  Card,
  Text,
} from "@chakra-ui/react";
import { ImCross } from "react-icons/im";

export const CustomLegendMobile = ({ title, children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        position: "absolute",
        bottom: "80px",
        left: "20px",
        width: "min-content",
      }}
    >
      <Heading
        color="gray.700"
        fontSize="10px"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "5px",
          marginTop: "5px",
        }}
      >
        {title}
      </Heading>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const CustomLegendMobileArroyo = ({ title, children, color }) => {
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      className="legend-container"
      style={{ width: "min-content" }}
    >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        bottom: "80px",
        left: "20px",
        width: "min-content",
      }}
    >
      <Heading
        color="gray.700"
        fontSize="10px"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "5px",
          marginTop: "5px",
        }}
      >
        {title}
      </Heading>
      <TableContainer>
        <Table size="xs" variant="unstyled" style={{fontSize:"5rem"}}>
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
    </div>
    </Box>
  );
};

export const CustomLegend = ({
  title,
  color,
  description,
  children,
  note = "",
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  if (isMobile) {
    return <CustomLegendMobile title={title} children={children} />;
  }
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
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
        <Tooltip label={description} placement="top" hasArrow gutter={12}>
          <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)">
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
      <Text fontSize="0.6dvw" color="gray.600">
        <i>{note}</i>
      </Text>
    </Box>
  );
};

export const CustomLegendArroyo = ({
  title,
  color,
  description,
  children,
  note = "",
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  if (isMobile) {
    return <CustomLegendMobileArroyo title={title} children={children} color={color}/>;
  }
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
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
        <Tooltip label={description} placement="top" hasArrow gutter={12}>
          <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)">
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
      <Text fontSize="0.6dvw" color="gray.600">
        <i>{note}</i>
      </Text>
    </Box>
  );
};

export const LegendItem = ({ color, label }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const services = ["Preescolar", "Guardería", "Equipamiento de Salud"];
  return (
    <Tr fontSize="min(0.7dvw, 0.7dvh)">
      <Td>
        {services.includes(label) ? (
          <ImCross color={color} fontSize="min(1.6dvh, 0.8dvw)" />
        ) : (
          <Card
            className="legend-color"
            h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
            w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
            bg={color}
            borderRadius={label === "Comercio al por menor" ? "50%" : "15%"}
          />
        )}
      </Td>
      <Td
        className="custom-legend-label"
        fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
      >
        {label}
      </Td>
    </Tr>
  );
};

export const LegendLineItem = ({ color, label }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const services = ["Preescolar", "Guardería", "Equipamiento de Salud"];
  return (
    <Tr fontSize="min(0.7dvw, 0.7dvh)">
      <Td>
        {services.includes(label) ? (
          <ImCross color={color} fontSize="min(1.6dvh, 0.8dvw)" />
        ) : (
          <Card
            className="legend-color"
            h={isMobile ? "2.5px" : "min(0.4dvh, 0.2dvw)"}
            w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
            bg={color}
            borderRadius={label === "Comercio al por menor" ? "50%" : "15%"}
          />
        )}
      </Td>
      <Td
        className="custom-legend-label"
        fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
      >
        {label}
      </Td>
    </Tr>
  );
};

export const LegendXItem = ({ color, label }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <Tr fontSize="min(0.7dvw, 0.7dvh)">
      <Td>
        <ImCross color={color} fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"} />
      </Td>
      <Td
        className="custom-legend-label"
        fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
      >
        {label}
      </Td>
    </Tr>
  );
};

export const LegendTwoToneItem = ({ label }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <Tr fontSize="min(0.7dvw, 0.7dvh)">
      <Td>
        <Card
          className="legend-color"
          h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          bg="#DBC9FF"
          borderRadius="15%"
          p="3px"
        >
          <Card
            h="100%"
            w="100%"
            bg="#8351DA"
            borderRadius="inherit"
          />
        </Card>
      </Td>
      <Td
        className="custom-legend-label"
        fontSize={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
      >
        {label}
      </Td>
    </Tr>
  );
};