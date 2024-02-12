import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState } from "react";

export const CustomLegendMobile = ({ title, color, description, children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start;",
        position: "absolute",
        bottom: "80px",
        left: "20px",
        width: "min-content",
      }}
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
          <Heading color="gray.700" fontSize="12px">
            <InfoIcon
              boxSize={2.5}
              color="gray.400"
              style={{ cursor: "pointer" }}
              mr="1"
            />
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const CustomLegend = ({ title, color, description, children }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");


  if (isMobile) {
    return (
      <CustomLegendMobile
        title={title}
        color={color}
        description={description}
        children={children}
      />
    );
  }
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
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
          <Heading color="gray.700" fontSize="0.9dvw">
            <InfoIcon
              boxSize={2.5}
              color="gray.400"
              style={{ cursor: "pointer" }}
              mr="1"
            />
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table size="xs" variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export const LegendItem = ({ color, label }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <Tr fontSize="0.7dvw">
      <Td>
        <div className="legend-color" style={{ backgroundColor: color }} />
      </Td>
      <Td>
        <div className="legend-numbers">
          <span
            className="legend-label2"
            style={{ fontSize: isMobile ? "10px" : "0.7dvw" }}
          >
            {label}
          </span>
        </div>
      </Td>
    </Tr>
  );
};
