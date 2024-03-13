import React from "react";
import { useMediaQuery, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
  } from '@chakra-ui/react';

import { sectionsInfo } from "../utils/constants";


const Objetivo = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <div
    style={{
        height: isMobile ? "100%" : "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "between",
        alignItems: "center",
        backgroundColor: "white",
    }}
    >
        
      {/* Header */}
      <Box bg='black' w='100%' h='10%' color='white' style={{marginTop: "0", display: "flex", justifyContent: "space-between"}}>
        
        {/* Logos */}
        <Box w="50%" style={{display: "flex", alignItems: "center"}}>
          <img
        className="headerImage"
        src="logos_SIUM.png"
        alt="SIUM"
        style={{
          padding: "1dvw",
          height: "auto",
          width: "auto",
          objectFit: "contain",
        }}
      />

        </Box>
        
        {/* Botones */}
        <Box w="40%" style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
          <Link to="/objetivo">
            <Button variant={"text"} style={{fontSize: "1.5dvw"}}>
              Objetivo
            </Button>
          </Link>
          <Link to="/equipo">
            <Button variant={"text"} style={{fontSize: "1.5dvw"}}>
              Equipo
            </Button>
          </Link>
        </Box>
      </Box>

        {/* Imagen y objetivo */}
      <Box bg='#FEF5E7' w='100%' h='30%' p={4} color='#04511B' style={{display: "flex", justifyContent: "space-around", marginTop: "3dvw", textAlign: "center", fontSize: "2dvw"}}>
        <Box w="26%" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            {/* Imagen y texto  */}
            <Box height={"90%"} style={{position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "25dvw"}}>
                <img
                    className="headerImage"
                    src="aspectos.png"
                    alt="SIUM"
                    style={{
                    height: "70%",
                    objectFit: "contain",
                    }}
                    />
                <p style={{marginTop: "3dvw", fontSize: "1.5dvw", textAlign: "center", color: "#665232"}}>
                    Y mucho más...
                </p>
            </Box>
        </Box>
        <Box width="26%" style={{display: "flex", flexDirection: "column", justifyContent: "space-around", textAlign: "center", color: "#665232"}}>
            <p style={{fontSize: "1.5dvw"}}><b>Objetivo General</b></p>
            <p style={{fontSize: "1dvw", marginTop: "1dvw"}}>
                El SIUM tiene como finalidad mostrar el impacto de la expansión
                urbana en la Zona Metropolitana de Monterrey.
            </p>
            <p style={{fontSize: "1dvw", marginTop: "1dvw"}}>
                Generar una discusión colectiva que lleve a un nuevo modelo 
                urbano.
            </p>
        </Box>
      </Box>

      <Box w='100%' h='100%' style={{display: "flex", backgroundColor: "white"}}>
        <Box w="100%" h="100%">

        </Box>

        {/* Tarjetas */}
        <Box w="100%" h="100%" style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
            <p style={{textAlign: "center", fontSize: "1.5dvw", color: "#665232"}}>
                <b>Principios</b>
            </p>

            <Box style={{display: "flex", justifyContent: "space-around"}}>
              
                  <Popover trigger="hover" placement="top">
                      <PopoverTrigger>
                          <Button w={"13dvw"} h={"10dvw"} colorScheme={sectionsInfo.vivienda.color} variant='outline' style={{borderRadius: 60}}>
                              DISCUSIÓN
                          </Button>
                      </PopoverTrigger>

                      <PopoverContent w={"auto"} color="white" bg="#2C3147" borderColor="#2C3147">
                          <PopoverArrow bg='#2C3147'/>
                          <PopoverBody style={{textAlign: "center"}}>Para la toma de decisiones</PopoverBody>
                      </PopoverContent>
                  </Popover>

                  <Popover trigger="hover"  placement="top">
                      <PopoverTrigger>
                          <Button w={"13dvw"} h={"10dvw"} colorScheme={sectionsInfo["expansion-urbana"].color} variant='outline' style={{borderRadius: 60}}>
                              TRANSPARENCIA
                          </Button>
                      </PopoverTrigger>

                      <PopoverContent w={"auto"} color="white" bg="#2C3147" borderColor="#2C3147">
                          <PopoverArrow bg='#2C3147'/>
                          <PopoverBody  style={{textAlign: "center"}} >Acceso a la información</PopoverBody>
                      </PopoverContent>
                  </Popover>

                  <Popover trigger="hover"  placement="top">
                      <PopoverTrigger>
                          <Button w={"13dvw"} h={"10dvw"} colorScheme={sectionsInfo.empleo.color} variant='outline' style={{borderRadius: 60}}>
                              COLECTIVIDAD
                          </Button>
                      </PopoverTrigger>

                      <PopoverContent w={"auto"} color="white" bg="#2C3147" borderColor="#2C3147">
                          <PopoverArrow bg='#2C3147'/>
                          <PopoverBody  style={{textAlign: "center"}} >Participación ciudadana</PopoverBody>
                      </PopoverContent>
                  </Popover>

            </Box>

            <Box style={{display: "flex", justifyContent: "space-evenly"}}>

                  <Popover trigger="hover"  placement="top">
                      <PopoverTrigger>
                          <Button w={"13dvw"} h={"10dvw"} colorScheme={sectionsInfo.transporte.color} variant='outline' style={{borderRadius: 60}}>
                              ACCIÓN
                          </Button>
                      </PopoverTrigger>

                      <PopoverContent w={"auto"} color="white" bg="#2C3147" borderColor="#2C3147">
                          <PopoverArrow bg='#2C3147'/>
                          <PopoverBody  style={{textAlign: "center"}}>Diversidad de opiniones</PopoverBody>
                      </PopoverContent>
                  </Popover>

                  <Popover trigger="hover"  placement="top">
                      <PopoverTrigger>
                          <Button w={"13dvw"} h={"10dvw"} colorScheme={sectionsInfo.infancias.color} variant='outline' style={{borderRadius: 60}}>
                              INNOVACIÓN
                          </Button>
                      </PopoverTrigger>

                      <PopoverContent w={"auto"} color="white" bg="#2C3147" borderColor="#2C3147">
                          <PopoverArrow bg='#2C3147'/>
                          <PopoverBody  style={{textAlign: "center"}}>Nuevo Modelo Urbano</PopoverBody>
                      </PopoverContent>
                  </Popover>

            </Box>

        </Box>


      </Box>
    </div>
  );
};

export default Objetivo;

