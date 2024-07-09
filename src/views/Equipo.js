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
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { sectionsInfo } from "../utils/constants";
import { Tooltip } from "@chakra-ui/react";
import { MdMail } from "react-icons/md";
import { MdPlayArrow } from "react-icons/md";
import { VideoCenter } from "../components/PopupButton";

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
    organization:
      "Centro para el Futuro de las Ciudades, Tecnológico de Monterrey",
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
      "Carlos Orozco",
      "Marina Ramírez",
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
        mb="8dvh"
        color="#04511B"
        style={{
          textAlign: "center",
          padding: "auto",
          display: "grid",
          alignItems: "center",
        }}
      >
        <Heading as="h1" fontSize={isMobile ? "4xl" : "3dvw"}>
          Equipo
        </Heading>
      </Box>

      {/* Integrantes Equipo  */}
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
            key={area.title}
            marginBottom={"2dvh"}
            paddingX={"2dvw"}
            w={isMobile ? "auto" : "17dvw"}
          >
            <div style={{ fontSize: isMobile ? "5dvw" : "1.3dvw" }}>
              <b>{area.title}</b>
            </div>
            {area.organization && (
              <div style={{ fontSize: isMobile ? "3dvw" : "0.8dvw" }}>
                <b>{area.organization}</b>
              </div>
            )}

            {area.members.map((miembro) => (
              <p key={miembro} style={{ fontSize: isMobile ? "4dvw" : "1dvw" }}>
                {miembro}
              </p>
            ))}
            {area.contact && (
              <>
                <Text fontSize={isMobile ? "3dvw" : "0.9dvw" } mt="1dvh">
                  <b>Contacto:</b> {area.contact}
                </Text>
              </>
            )}
          </Box>
        ))}
      </Box>

      {/* Nota */}
      <Box
        width="100%"
        paddingX="3dvw"
        marginTop={isMobile ? "8dvh" : "2dvh"}
        marginBottom={isMobile ? "2dvh" : "2dvh"}
        fontSize="1dvw"
      >
        <p style={{ fontSize: isMobile ? "3dvw" : "0.9dvw" }}>
          Este proyecto ha sido fondeado generosamente por fundación FEMSA desde
          2019.
        </p>
        <p style={{ fontSize: isMobile ? "3dvw" : "0.9dvw" }}>
          El SIUM, Sistema de Información Urabano Metropolitano, es un proyecto
          del Centro para el Futuro de las Ciudades del Tecnológico de
          Monterrey.
        </p>
      </Box>
      {/* Nota END  */}
      <Box position="fixed" bottom="1rem" right="1rem" zIndex="10">
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
    <section
      id="objetivo"
      style={{ width: "100%", height: isMobile ? "auto" : "90dvh" }}
    >
      {/* Imagen: ¿Qué es ciudad?  y texto */}
      <Flex
        h="100%"
        w={isMobile ? "100%" : "50%"}
        px={isMobile ? "5dvw" : "0"}
        style={{
          position: isMobile ? "static" : "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          className="headerImage"
          src="aspectos.png"
          alt="SIUM"
          style={{
            height: isMobile ? "auto" : "min(70dvh, 40dvw)",
            padding: "4dvh",
            objectFit: "contain",
            marginTop: "3dvh",
          }}
        />
        <Text
          fontSize={isMobile ? "4dvw" : "min(2dvw, 3dvh)"}
          textAlign="center"
          color="#665232"
          mb="5dvh"
        >
          Y mucho más...
        </Text>
        <VideoCenter
          color="purple"
          videoId="b3EgwpHB42s"
          title="Carlos Hurtado"
          subtitle="Fundación FEMSA, Seguridad Hídrica y Economía Circular."
          text="Importancia del SIUM."
        />
      </Flex>

      {/* Lado derecho objetivo  */}
      <Box h={isMobile ? "auto" : "36dvh"} w="100%">
        <Flex
          bg="#FEF5E7"
          w="100%"
          h={isMobile ? "auto" : "100%"}
          p="4dvh"
          color="#04511B"
          mt="3dvw"
          justifyContent="space-around"
        >
          <Box
            width={isMobile ? "100%" : "30%"}
            color="#665232"
            ml={!isMobile && "50dvw"}
            textAlign="start"
          >
            <Text fontSize={isMobile ? "6dvw" : "min(2dvw, 4dvh)"}>
              <b>Objetivo General</b>
            </Text>
            <Text
              fontSize={isMobile ? "3dvw" : "min(1.4dvw, 2.4dvh)"}
              mt="1dvw"
            >
              El SIUM tiene como finalidad mostrar el impacto de la expansión
              urbana en la Zona Metropolitana de Monterrey.
            </Text>
            <Text
              fontSize={isMobile ? "3dvw" : "min(1.4dvw, 2.4dvh)"}
              mt="1dvw"
            >
              Generar una discusión colectiva que lleve a un nuevo modelo
              urbano.
            </Text>
          </Box>
        </Flex>

        <Flex w="100%" h="auto">
          {/* Tarjetas principios */}
          <Box
            ml={isMobile ? "0" : "50dvw"}
            w={isMobile ? "100%" : "50%"}
            h={isMobile ? "auto" : "100%"}
            paddingY={isMobile ? "5dvh" : "2dvh"}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              color="#665232"
              fontSize={isMobile ? "6dvw" : "1.6dvw"}
              textAlign="center"
              my="1dvh"
            >
              <b>Principios</b>
            </Text>

            <Wrap spacingX="2dvw" spacingY="5dvh" justify="center" p={"2dvh"}>
              {Object.values(principiosInfo).map((principio) => (
                <WrapItem key={principio.label}>
                  <Popover trigger="hover" placement="top">
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        colorScheme={principio.colorScheme}
                        fontSize={isMobile ? "4dvw" : "1.5dvw"}
                        w={isMobile ? "70dvw" : "13dvw"}
                        h={isMobile ? "12dvh" : "12dvh"}
                        borderRadius="min(4dvh, 4dvw)"
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
                      <PopoverBody
                        style={{
                          textAlign: "center",
                          fontSize: isMobile ? "4dvw" : "1.5dvw",
                        }}
                      >
                        {principio.description}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
          {/* Tarjetas START */}
        </Flex>
      </Box>
      {/* Lado derecho objetivo START  */}
    </section>
  );
};

const Navbar = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <Flex
      align="center"
      bg="black"
      w="100dvw"
      justify="space-between"
      display="flex"
      h="10dvh"
      p={2}
      position="sticky"
      top={0}
      zIndex={2}
    >
      {/* Logos */}
      <Flex
        w={isMobile ? "calc(100dvw - 40px)" : "70%"}
        style={{ display: "flex", alignItems: "center" }}
      >
        {["SIUM.png", "femsa.png", "tec.png", "fundacion_femsa.png"].map(
          (imagen, index) => (
            <img
              key={index}
              className="headerImage"
              src={`/${imagen}`}
              alt="SIUM"
              style={{
                padding: "5px",
                height: "10dvh",
                width: "25%",
                maxWidth: isMobile ? "100%" : "200px",
                objectFit: "contain",
              }}
            />
          )
        )}
      </Flex>

      {/* Botones */}
      <Flex w={isMobile ? "40px" : "25%"} justify="end" align="center">
        {isMobile ? (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              size="sm"
              colorScheme="whiteAlpha"
            />
            <MenuList>
              <MenuItem as="a" href="/" minH="50px">
                Inicio
              </MenuItem>
              <MenuItem as="a" href="/acerca#objetivo" minH="50px">
                Objetivo
              </MenuItem>
              <MenuItem as="a" href="/acerca#equipo" minH="50px">
                Equipo
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button
              as="a"
              href="/"
              variant="text"
              color="white"
              fontSize="min(2.4dvh, 1.2dvw)"
            >
              Inicio
            </Button>
            <Button
              as="a"
              href="/acerca#objetivo"
              variant="text"
              color="white"
              fontSize="min(2.4dvh, 1.2dvw)"
            >
              Objetivo
            </Button>
            <Button
              as="a"
              href="/acerca#equipo"
              variant="text"
              color="white"
              fontSize="min(2.4dvh, 1.2dvw)"
            >
              Equipo
            </Button>
          </>
        )}
      </Flex>
    </Flex>
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
