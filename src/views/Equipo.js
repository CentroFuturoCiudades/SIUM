import React from "react";
import { 
  useMediaQuery,
  Box, 
  Button, 
  Wrap, 
  WrapItem,   
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,

} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { sectionsInfo } from "../utils/constants";
import { Tooltip } from "@chakra-ui/react";
import { MdMail } from 'react-icons/md';


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

const infoEquipo = {
  coordinacionGeneral: {
    title: "COORDINACIÓN GENERAL",
    organization: "Centro para el Futuro de las Ciudades, Tecnológico de Monterrey",
    members: ["José Antonio Torre", "Roberto Ponce", "Uriel Salazar"],
    contact: "rpl@tec.mx",
  },
  direccionCreativa: {
    title: "DIRECCIÓN CREATIVA",
    members: ["Andrea Martínez", "Alberto Meouchi"],
  },
  analiticaYModelos: {
    title: "ANALÍTICA Y MODELOS",
    members: [
      "Gonzalo Peraza",
      "Rodolfo Figueroa",
      "Nélida Escobedo",
      "Claudia Ledezma",
      "Fabián Lozano",
    ],
  },
  disenoWeb: {
    title: "DISEÑO WEB",
    members: [
      "Jeannette Arjona",
      "Tadeo Barrera",
      "Diego Michel",
      "Erick Schiller",
    ],
  },
  agradecimientos: {
    title: "AGRADECIMIENTOS",
    members: [
      "Luis Ávila",
      "Rebecca Bell",
      "Ana Hierro",
      "Carlos Hurtado",
      "Lucía Elizondo",
      "Sindy González",
      "Javiel Leal",
      "Martha Montemayor",
      "Luisa Pérez",
      "Carlos Placencia",
    ],
  },
};



const Equipo = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <section id="equipo">

      {/* Header Equipo START  */}
      <Box
        bg="#FEF5E7"
        w="100dvw"
        h="20dvh"
        marginY="8dvh"
        color="#04511B"
        style={{
          textAlign: "center",
          padding: "auto",
          display: "grid",
          alignItems: "center",
        }}
        >
        <Heading as="h1" size={isMobile ? "4xl" : "xl"}>
          Equipo
        </Heading>
      </Box>
      {/* Header Equipo END */}

      {/* Integrantes Equipo START  */}
      <Box
        w="100%"
        h="auto"
        color="#04511B"
        paddingX={"2dvw"}
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-around",
        }}
      >
        {Object.values(infoEquipo).map((area) => (
          <Box
          marginBottom={"2dvh"}
          paddingX={"2dvw"}
          w={isMobile ? "auto" : "17dvw"}
          >
            <div style={{ fontSize: isMobile ? "5dvw" : "1rem" }}>
              <b>{area.title}</b>
            </div>
            {area.organization && (
              <div style={{ fontSize: isMobile ? "3dvw" : "0.7rem" }}>
                <b>
                  {area.organization}
                </b>
              </div>
            )}

            {area.members.map((miembro) => (
              <p style={{ fontSize: isMobile ? "4dvw" : "0.9rem" }}>
                {miembro}
              </p>
            ))}
            {area.contact && (
              <>
                <br />
                <p style={{ fontSize: isMobile ? "4dvw" : "0.7rem" }}>
                  <b>Contacto:</b> {area.contact}
                </p>
              </>
            )}
          </Box>
        ))}
      </Box>
      {/* Integrantes Equipo END  */}

      {/* Nota START  */}
      <Box
        width="100%"
        paddingX="3dvw"
        marginTop={isMobile ? "8dvh" : "2dvh"}
        marginBottom={isMobile ? "2dvh" : "2dvh"}
        style={{
          fontSize: "1dvw",
        }}
      >
        <p style={{ fontSize: isMobile ? "3dvw" : "0.7rem" }}>
          Este proyecto ha sido fondeado generosamente por fundación FEMSA desde
          2019.
        </p>
        <p style={{ fontSize: isMobile ? "3dvw" : "0.7rem" }}>
          El SIUM, Sistema de Información Urabano Metropolitano, es un proyecto
          del Centro para el Futuro de las Ciudades del Tecnológico de
          Monterrey.
        </p>
      </Box>
      {/* Nota END  */}

      <Box
        position="fixed"
        bottom="1rem"
        right="1rem"
        zIndex="10"
      >
        <Tooltip
          label="Enviar comentario"
          hasArrow
          padding="0.5rem"
          bg="gray.700"
          fontSize="xs"
          borderRadius="md"
          placement="right"
        >
          <a href="https://forms.office.com/r/HtvBBujdAe">
            <IconButton
              size="sm"
              isRound={true}
              icon={<MdMail />}
              variant="solid"
              colorScheme="blackAlpha"
            />  
          </a>
        </Tooltip>
      </Box>

    </section>
  );
};

const Objetivo = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <section id="objetivo" style={{ width: "100%" }}>
      {/* Imagen: ¿Qué es ciudad?  y texto START  */}
      <Box
      h={"100%"}
      w={isMobile ? "100%" : "50%"}
        style={{
          position: isMobile ? "static" : "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "0dvw",
          paddingLeft: isMobile ? "5dvw" : "0",
          paddingRight: isMobile ? "5dvw" : "0",
        }}
      >
        <img
          className="headerImage"
          src="aspectos.png"
          alt="SIUM"
          style={{
            height: isMobile ? "auto" : "70dvh",
            objectFit: "contain",
            marginTop: "3dvh",
          }}
        />
        <p
          style={{
            marginTop: "3dvw",
            fontSize: isMobile ? "5dvw" : "1.5dvw",
            textAlign: "center",
            color: "#665232",
          }}
        >
          Y mucho más...
        </p>
      </Box>
      {/* Imagen: ¿Qué es ciudad?  y texto END  */}

      {/* Lado derecho objetivo START  */}
      <Box 
        h={isMobile ? "150dvh" : "100%"} 
        w="100%"
        >

        <Box
          bg="#FEF5E7"
          w="100%"
          h={isMobile ? "auto" : "100%"}
          p={"4dvh"}
          color="#04511B"
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "3dvw",
            textAlign: "center",
            fontSize: "2dvw",
          }}
        >
          <Box
            width= {isMobile ? "0" : "26%"}
          >
            {/* Box vacío  */}
          </Box>
          {/* Texto objetivo START  */}
          <Box
            width={isMobile ? "100%" : "26%"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              textAlign: "start",
              color: "#665232",
            }}
          >
            <p style={{ fontSize: isMobile ? "5dvw" : "1.5rem" }}>
              <b>Objetivo General</b>
            </p>
            {isMobile && <br/>}
            <p style={{ fontSize: isMobile ? "4dvw" : "1rem", marginTop: "1dvw" }}>
              El SIUM tiene como finalidad mostrar el impacto de la expansión
              urbana en la Zona Metropolitana de Monterrey.
            </p>
            {isMobile && <br/>}
            <p style={{ fontSize: isMobile ? "4dvw" : "1rem", marginTop: "1dvw" }}>
              Generar una discusión colectiva que lleve a un nuevo modelo
              urbano.
            </p>
          </Box>
          {/* Texto objetivo END */}

        </Box>

        <Box
          w="100%"
          h="50dvh"
          style={{ display: "flex", backgroundColor: "white" }}
        >
          <Box w={isMobile ? "0" : "50%"} h="100%"></Box>

          {/* Tarjetas principios START */}
          <Box
            w={isMobile ? "100%" : "50%"}
            h={isMobile ? "135dvh" : "100%"}
            paddingY={isMobile ? "5dvh" : "2dvh"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              paddingBottom: "5dvh",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: isMobile ? "8dvw" : "1.5dvw",
                color: "#665232",
                marginBottom: "2dvh",
              }}
            >
              <b>Principios</b>
            </p>

            <Wrap spacingX='2dvw' spacingY='5dvh' justify='center' p={'2dvh'}>
            {Object.values(principiosInfo).map((principio) => (
              <WrapItem>
                <Popover trigger="hover" placement="top">
                    <PopoverTrigger>
                      <Button
                        w={isMobile ? "70dvw" : "13dvw"}
                        h={isMobile ? "15dvh" : "15dvh"}
                        colorScheme={principio.colorScheme}
                        variant="outline"
                        style={{ borderRadius: "4dvw", fontSize: isMobile ? "4dvw" : "1.5dvw" }}
                      >
                        {principio.label}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      w={"auto"}
                      color="white"
                      bg="#2C3147"
                      borderColor="#2C3147"
                    >
                      <PopoverArrow bg="#2C3147" />
                      <PopoverBody style={{ textAlign: "center", fontSize: isMobile ? "4dvw" : "1.5dvw" }}>
                        {principio.description}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
              </WrapItem>
            ))}
            </Wrap>
          </Box>
          {/* Tarjetas START */}

        </Box>
      </Box>
      {/* Lado derecho objetivo START  */}

    </section>
  );
};

const Navbar = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <Box h="10dvh" style={{ position: "sticky", top: 0, zIndex: 1 }}>
      {/* Header */}
      <Box
        bg="black"
        w="100%"
        h="100%"
        color="white"
        style={{
          marginTop: "0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logos START */}
        <Box w={isMobile ? "75%" : "50%"} style={{ display: "flex", alignItems: "center" }}>
          <img
            className="headerImage"
            src="logos_SIUM.png"
            alt="SIUM"
            style={{
              padding: "5px",
              height: "auto",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
        {/* Logos END */}

        {/* Botones START */}
        <Box
          w={isMobile ? "25%" : "50%"}
          style={{
            display: "flex",
            justifyContent: isMobile ? "end" : "space-around",
            alignItems: "center",
            padding: isMobile ? "2dvh" : 0,
          }}
        >
      {isMobile ? (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
            color={"white"}
            bg={"black"}
            _hover={{ bg: 'gray.700' }}
          />
          <MenuList>
            <MenuItem style={{color: "black"}}>
              <Link to="/">
                <Button variant="text">
                  Inicio
                </Button>
              </Link>
            </MenuItem>
            <MenuItem style={{color: "black"}}>
              <a href="#objetivo">
                <Button variant="text">
                  Objetivo
                </Button>
              </a>
            </MenuItem>
            <MenuItem style={{color: "black"}}>
              <a href="#equipo">
                <Button variant="text">
                  Equipo
                </Button>
              </a>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          <Link to="/">
            <Button variant="text" fontSize="1.5vw">
              Inicio
            </Button>
          </Link>
          <a href="#objetivo">
            <Button variant="text" fontSize="1.5vw">
              Objetivo
            </Button>
          </a>
          <a href="#equipo">
            <Button variant="text" fontSize="1.5vw">
              Equipo
            </Button>
          </a>
        </>
      )}
        </Box>
        {/* Botones END */}

      </Box>
    </Box>
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
