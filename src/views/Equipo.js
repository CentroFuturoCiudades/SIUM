import React from "react";
import { useMediaQuery, Box, Button } from "@chakra-ui/react";
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

const Equipo = () => {
  return (
    <section id="equipo">
      <Box
        bg="#FEF5E7"
        w="100%"
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
        <Heading as="h1" size="xl">
          Equipo
        </Heading>
      </Box>
      <Box
        w="100%"
        h="40dvh"
        color="#04511B"
        style={{
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}
      >
        <Box style={{ marginLeft: "2dvw", marginRight: "2dvw" }}>
          <div style={{ fontSize: "1.5dvw" }}>
            <b>COORDINACIÓN GENERAL</b>
          </div>
          <div style={{ fontSize: "0.8dvw", marginBottom: "2dvw" }}>
            <b>
              Centro para el Futuro de las Ciudades, Tecnológico de Monterrey
            </b>
          </div>
          <p style={{ fontSize: "1dvw" }}>José Antonio Torre</p>
          <p style={{ fontSize: "1dvw" }}>Roberto Ponce</p>
          <p style={{ fontSize: "1dvw" }}>Uriel Salazar</p>
          <br />
          <p style={{ fontSize: "1dvw" }}>
            <b>Contacto:</b> rpl@tec.mx
          </p>
        </Box>

        <Box style={{ marginLeft: "2dvw", marginRight: "2dvw" }}>
          <div style={{ marginBottom: "2dvw", fontSize: "1.5dvw" }}>
            <b>DIRECCIÓN CREATIVA</b>
          </div>

          <p style={{ fontSize: "1dvw" }}>Andrea Martínez</p>
          <p style={{ fontSize: "1dvw" }}>Alberto Meouchi</p>
        </Box>

        <Box style={{ marginLeft: "2dvw", marginRight: "2dvw" }}>
          <div style={{ marginBottom: "2dvw", fontSize: "1.5dvw" }}>
            <b>ANALÍTICA Y MODELOS</b>
          </div>

          <p style={{ fontSize: "1dvw" }}>Gonzalo Gaudencio Peraza</p>
          <p style={{ fontSize: "1dvw" }}>Rodolfo Figueroa</p>
          <p style={{ fontSize: "1dvw" }}>Nélida Escobedo</p>
          <p style={{ fontSize: "1dvw" }}>Claudia Ledezma</p>
          <p style={{ fontSize: "1dvw" }}>Fabián Lozano</p>
        </Box>

        <Box style={{ marginLeft: "2dvw", marginRight: "2dvw" }}>
          <div style={{ marginBottom: "2dvw", fontSize: "1.5dvw" }}>
            <b>DISEÑO WEB</b>
          </div>

          <p style={{ fontSize: "1dvw" }}>Jeannette Arjona</p>
          <p style={{ fontSize: "1dvw" }}>Adrian Tadeo Barrera</p>
          <p style={{ fontSize: "1dvw" }}>Diego Alejandro Michel</p>
          <p style={{ fontSize: "1dvw" }}>Erick Schiller</p>
        </Box>

        <Box style={{ marginLeft: "2dvw", marginRight: "2dvw" }}>
          <div style={{ marginBottom: "2dvw", fontSize: "1.5dvw" }}>
            <b>AGRADECIMIENTOS</b>
          </div>

          <p style={{ fontSize: "1dvw" }}>Luis Ávila</p>
          <p style={{ fontSize: "1dvw" }}>Rebecca Bell</p>
          <p style={{ fontSize: "1dvw" }}>Ana Fernanda</p>
          <p style={{ fontSize: "1dvw" }}>Carlos Hurtado</p>
          <p style={{ fontSize: "1dvw" }}>Lucía Elizondo</p>
          <p style={{ fontSize: "1dvw" }}>Sindy González</p>
          <p style={{ fontSize: "1dvw" }}>Javiel Leal</p>
          <p style={{ fontSize: "1dvw" }}>Martha Montemayor</p>
          <p style={{ fontSize: "1dvw" }}>Luisa Pérez</p>
          <p style={{ fontSize: "1dvw" }}>Carlos Placencia</p>
        </Box>
      </Box>
      <Box
        width="100%"
        h="10dvh"
        style={{
          textAlign: "center",
          fontSize: "1dvw",
          paddingTop: "2dvw",
        }}
      >
        <p style={{ fontSize: "0.9dvw" }}>
          Este proyecto ha sido fondeado generosamente por fundación FEMSA desde
          2019.
        </p>
        <p style={{ fontSize: "0.9dvw" }}>
          El SIUM, Sistema de Información Urabano Metropolitano, es un proyecto
          del Centro para el Futuro de las Ciudades del Tecnológico de
          Monterrey.
        </p>
      </Box>
    </section>
  );
};

const Objetivo = () => {
  return (
    <section id="objetivo" style={{ width: "100%" }}>
      <Box h="100%" w="100%">
        {/* Imagen y objetivo */}
        <Box
          bg="#FEF5E7"
          w="100%"
          h="35dvh"
          p={4}
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
            w="26%"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Imagen y texto  */}
            <Box
              height={"90%"}
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "25dvw",
              }}
            >
              <img
                className="headerImage"
                src="aspectos.png"
                alt="SIUM"
                style={{
                  height: "70%",
                  objectFit: "contain",
                }}
              />
              <p
                style={{
                  marginTop: "3dvw",
                  fontSize: "1.5dvw",
                  textAlign: "center",
                  color: "#665232",
                }}
              >
                Y mucho más...
              </p>
            </Box>
          </Box>
          <Box
            width="26%"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              textAlign: "center",
              color: "#665232",
            }}
          >
            <p style={{ fontSize: "1.5dvw" }}>
              <b>Objetivo General</b>
            </p>
            <p style={{ fontSize: "1dvw", marginTop: "1dvw" }}>
              El SIUM tiene como finalidad mostrar el impacto de la expansión
              urbana en la Zona Metropolitana de Monterrey.
            </p>
            <p style={{ fontSize: "1dvw", marginTop: "1dvw" }}>
              Generar una discusión colectiva que lleve a un nuevo modelo
              urbano.
            </p>
          </Box>
        </Box>

        <Box
          w="100%"
          h="50dvh"
          style={{ display: "flex", backgroundColor: "white" }}
        >
          <Box w="50%" h="100%"></Box>

          {/* Tarjetas */}
          <Box
            w="50%"
            h="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: "1.5dvw",
                color: "#665232",
              }}
            >
              <b>Principios</b>
            </p>

            <Box style={{ display: "flex", justifyContent: "space-around" }}>
              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Button
                    w={"13dvw"}
                    h={"8dvw"}
                    colorScheme={sectionsInfo.vivienda.color}
                    variant="outline"
                    style={{ borderRadius: "4dvw", fontSize: "1.2dvw" }}
                  >
                    DISCUSIÓN
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  w={"auto"}
                  color="white"
                  bg="#2C3147"
                  borderColor="#2C3147"
                >
                  <PopoverArrow bg="#2C3147" />
                  <PopoverBody style={{ textAlign: "center" }}>
                    Para la toma de decisiones
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Button
                    w={"13dvw"}
                    h={"8dvw"}
                    colorScheme={sectionsInfo["expansion-urbana"].color}
                    variant="outline"
                    style={{ borderRadius: "4dvw", fontSize: "1.2dvw" }}
                  >
                    TRANSPARENCIA
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  w={"auto"}
                  color="white"
                  bg="#2C3147"
                  borderColor="#2C3147"
                >
                  <PopoverArrow bg="#2C3147" />
                  <PopoverBody style={{ textAlign: "center" }}>
                    Acceso a la información
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Button
                    w={"13dvw"}
                    h={"8dvw"}
                    colorScheme={sectionsInfo.empleo.color}
                    variant="outline"
                    style={{ borderRadius: "4dvw", fontSize: "1.2dvw" }}
                  >
                    COLECTIVIDAD
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  w={"auto"}
                  color="white"
                  bg="#2C3147"
                  borderColor="#2C3147"
                >
                  <PopoverArrow bg="#2C3147" />
                  <PopoverBody style={{ textAlign: "center" }}>
                    Participación ciudadana
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>

            <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Button
                    w={"13dvw"}
                    h={"8dvw"}
                    colorScheme={sectionsInfo.transporte.color}
                    variant="outline"
                    style={{ borderRadius: "4dvw", fontSize: "1.2dvw" }}
                  >
                    ACCIÓN
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  w={"auto"}
                  color="white"
                  bg="#2C3147"
                  borderColor="#2C3147"
                >
                  <PopoverArrow bg="#2C3147" />
                  <PopoverBody style={{ textAlign: "center" }}>
                    Diversidad de opiniones
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <Popover trigger="hover" placement="top">
                <PopoverTrigger>
                  <Button
                    w={"13dvw"}
                    h={"8dvw"}
                    colorScheme={sectionsInfo.infancias.color}
                    variant="outline"
                    style={{ borderRadius: "4dvw", fontSize: "1.2dvw" }}
                  >
                    INNOVACIÓN
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  w={"auto"}
                  color="white"
                  bg="#2C3147"
                  borderColor="#2C3147"
                >
                  <PopoverArrow bg="#2C3147" />
                  <PopoverBody style={{ textAlign: "center" }}>
                    Nuevo Modelo Urbano
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
};

const Navbar = () => {
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
        {/* Logos */}
        <Box w="50%" style={{ display: "flex", alignItems: "center" }}>
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

        {/* Botones */}
        <Box
          w="40%"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link to="/">
            <Button variant={"text"} style={{ fontSize: "1.5dvw" }}>
              Inicio
            </Button>
          </Link>
          <a href="#objetivo">
            <Button variant={"text"} style={{ fontSize: "1.5dvw" }}>
              Objetivo
            </Button>
          </a>
          <a href="#equipo">
            <Button variant={"text"} style={{ fontSize: "1.5dvw" }}>
              Equipo
            </Button>
          </a>
        </Box>
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
