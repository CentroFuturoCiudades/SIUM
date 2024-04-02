import React, { useRef } from "react";
import {
  SUBCENTERS_LAYER,
  CENTER_LAYER,
  PERIPHERY_LAYER,
  SECCION_SEGREGACION__QUINTIL_LAYER,
  SECCION_CRECIMIENTO_LAYER_1990,
} from "../../utils/constants";
import { Box, Heading, Text, useMediaQuery } from "@chakra-ui/react";
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

export const SegregacionSpan = ({ setOutline }) => (
  <span
    className="highlightEmployments"
    onMouseOver={() => setOutline(SECCION_SEGREGACION__QUINTIL_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    segregación
  </span>
);

export const ExpansionSpan = ({ setOutline }) => (
  <span
    className="highlightAccent"
    onMouseOver={() => setOutline(SECCION_CRECIMIENTO_LAYER_1990)}
    onMouseOut={() => setOutline(null)}
  >
    1990
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

export const ResponseTitle = ({ children, color }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <AnimatedText duration={0.5} x={-5} opacity={0.5}>
      <Heading
        className="response"
        color={`${color}.600`}
        mb="2dvh"
        mt="1dvh"
        style={{ fontSize: isMobile ? "0.9rem" : "min(2dvh, 1.2dvw)"}}
      >
        {children}
      </Heading>
    </AnimatedText>
  );
};

export const ContextTitle = ({ children, color }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <AnimatedText duration={0.5} y={-5} opacity={0.5}>
      <Text
        as={"p"}
        className="context"
        color={`${color}.600`}
        style={{ fontSize: isMobile ? "0.8rem" : "min(1.8dvh, 1.1dvw)", marginTop: '2dvh' }}
      >
        {children}
      </Text>
    </AnimatedText>
  );
};

export const Card = ({ id, children, color }) => {
  return (
    <section className="cardSection" id={id}>
      <Box className="card" borderColor={`${color}.500`}>
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
          {children}
        </div>
      </Box>
    </section>
  );
};
