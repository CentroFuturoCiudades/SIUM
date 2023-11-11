import React from "react";
import {
  SUBCENTERS_LAYER,
  CENTER_LAYER,
  PERIPHERY_LAYER,
  EMPLOYMENT_LAYER,
  MASIVE_TRANSPORT_LAYER,
  PRUEBA_SECCION_SEGREGACION__QUINTIL_LAYER,
  PRUEBA_SECCION_CRECIMIENTO_LAYER_1990,
} from "../../utils/constants";
import { Box, Heading, Text } from "@chakra-ui/react";
import { AnimatedText } from "../AnimatedText";
import "./index.css";

export const PeripherySpan = ({ setOutline }) => (
  <span
    className="highlightAccent"
    onMouseOver={() => setOutline(PERIPHERY_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    periferia
  </span>
);

export const CenterSpan = ({ setOutline }) => (
  <span
    className="highlightCenters"
    onMouseOver={() => setOutline(CENTER_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    centro
  </span>
);

export const EmploymentSpan = ({ setOutline }) => (
  <span
    className="highlightEmployments"
    onMouseOver={() => setOutline(EMPLOYMENT_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    empleos
  </span>
);

export const SegregacionSpan = ({ setOutline }) => (
  <span
    className= "highlightEmployments"
    onMouseOver={() => setOutline(PRUEBA_SECCION_SEGREGACION__QUINTIL_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    segregación
  </span>
);

export const ExpansionSpan = ({ setOutline }) => (
  <span
    className= "highlightAccent"
    onMouseOver={() => setOutline(PRUEBA_SECCION_CRECIMIENTO_LAYER_1990)}
    onMouseOut={() => setOutline(null)}
  >
    1990
  </span>
);

export const MasiveTransportSpan = ({ setOutline }) => (
  <span
    className="highlightTransport"
    onMouseOver={() => setOutline(MASIVE_TRANSPORT_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    transporte público
  </span>
);

export const SubcentersSpan = ({ setOutline }) => (
  <span
    className="highlightSubcenters"
    onMouseOver={() => setOutline(SUBCENTERS_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    subcentros
  </span>
);

export const ResponseTitle = ({ children, color }) => (
  <AnimatedText duration={0.8} x={-15}>
    <Heading
      className="response"
      color={`${color}.600`}
      fontSize={{ md: "0.9rem", lg: "1.1rem", sm: "0.8rem" }}
    >
      {children}
    </Heading>
  </AnimatedText>
);

export const ContextTitle = ({ children, color }) => (
  <AnimatedText duration={0.8} y={-15}>
    <Text
      className="context"
      color={`${color}.600`}
      fontSize={{ md: "0.9rem", lg: "1.1rem", sm: "0.8rem" }}
    >
      {children}
    </Text>
  </AnimatedText>
);

export const Card = ({ id, children, color }) => (
  <section className="cardSection" id={id}>
    <Box className="card" borderColor={`${color}.500`}>
      {children}
    </Box>
  </section>
);
