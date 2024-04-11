import React from "react";
import { useMediaQuery, Box, Button, SimpleGrid, Wrap, WrapItem, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Heading,
} from "@chakra-ui/react";
import { sectionsInfo } from "../utils/constants";

const principiosInfo = {
  discusion: {
    label: "DISCUSIÓN",
    colorScheme: sectionsInfo.vivienda.color,
    description: "Para la toma de decisiones",
  },
  transparencia: {
    label: "TRANSPARENCIA",
    colorScheme: sectionsInfo["expansion-urbana"].color,
    description: "Acceso a la información",
  },
  colectividad: {
    label: "COLECTIVIDAD",
    colorScheme: sectionsInfo.empleo.color,
    description: "Participación ciudadana",
  },
  accion: {
    label: "ACCIÓN",
    colorScheme: sectionsInfo.transporte.color,
    description: "Diversidad de opiniones",
  },
  innovacion: {
    label: "INNOVACIÓN",
    colorScheme: sectionsInfo.infancias.color,
    description: "Nuevo Modelo Urbano",
  },
};


const Equipo = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <section id="equipo">
      
    </section>
  );
};

const Objetivo = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <section id="objetivo" style={{ width: "100%", height: "100dvh" }}>
      <Wrap spacing='30px' justify='center'>
        <WrapItem>
          <Center w={isMobile ? "70dvw" : "30dvw"} h='80px' bg='red.200'>
            Box 1
          </Center>
        </WrapItem>
        <WrapItem>
          <Center w={isMobile ? "70dvw" : "30dvw"} h='80px' bg='red.200'>
            Box 1
          </Center>
        </WrapItem>
        <WrapItem>
          <Center w={isMobile ? "70dvw" : "30dvw"} h='80px' bg='red.200'>
            Box 1
          </Center>
        </WrapItem>
        <WrapItem>
          <Center w={isMobile ? "70dvw" : "30dvw"} h='80px' bg='red.200'>
            Box 1
          </Center>
        </WrapItem>
        <WrapItem>
          <Center w={isMobile ? "70dvw" : "30dvw"} h='80px' bg='red.200'>
            Box 1
          </Center>
        </WrapItem>
      </Wrap>
    </section>
  );
};

const Navbar = () => {
  return (
    <div>
      
    </div>
  );
};

const Acerca = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "between",
        alignItems: "center",
        backgroundColor: "white",
        behavior: "smooth",
      }}
    >
      <Navbar />
      <Objetivo />
      <Equipo />
    </div>
  );
};

export default Acerca;
