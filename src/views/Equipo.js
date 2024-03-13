import React from "react";
import {useMediaQuery, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Equipo = () => {
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
          padding: "5px",
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
      <Box width="60%" style={{ textAlign: "center", fontSize: "1dvw", paddingTop: "2dvw"}}>
        <p style={{fontSize: "0.9dvw"}}>
          Este proyecto ha sido fondeado generosamente por fundación FEMSA desde 2019.
        </p>
        <p style={{fontSize: "0.9dvw"}}>
          El SIUM, Sistema de Indformación Urabano Metropolitano, es un proyecto del 
          Centro para el Futuro de las Ciudades del Tecnológico de Monterrey.
        </p>
      </Box>

      {/* Equipo  */}
      <Box bg='#FEF5E7' w='100%' h='30%' p={4} color='#04511B' style={{marginTop: "2dvw", textAlign: "center", paddingTop: "6dvw", fontSize: "2dvw"}}>
        <b>Equipo</b>
      </Box>
      <Box w='100%' h='30%' p={4} color='#04511B' style={{paddingTop: "2dvw", display: "flex", justifyContent: "space-around", textAlign: "center"}}>
        
        <Box style={{marginLeft: "2dvw", marginRight: "2dvw"}}>
          <div style={{fontSize: "1.5dvw"}}>
            <b>COORDINACIÓN GENERAL</b>
          </div>
          <div style={{fontSize: "0.8dvw", marginBottom: "2dvw"}}>
            <b>Centro para el Futuro de las Ciudades, Tecnológico de Monterrey</b>
          </div>
          <p style={{ fontSize: '1dvw'}}>
            José Antonio Torre
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Roberto Ponce López
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Uriel Salazar Urquidi
          </p>
        </Box>
        
        <Box style={{marginLeft: "2dvw", marginRight: "2dvw"}}>
          <div style={{marginBottom: "2dvw", fontSize: "1.5dvw"}}>
            <b>DIRECCIÓN CREATIVA</b>
          </div>
          
          <p style={{ fontSize: '1dvw'}}>
          Andrea Martínez Santillán
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Alberto Meouchi
          </p>
        </Box>
        
        <Box style={{marginLeft: "2dvw", marginRight: "2dvw"}}>
          <div style={{marginBottom: "2dvw", fontSize: "1.5dvw"}}>
            <b>ANALÍTICA Y MODELOS</b>
          </div>
          
          <p style={{ fontSize: '1dvw'}}>
            Gonzalo Gaudencio Peraza Mues
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Rodolfo Figueroa Soriano
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Nélida Escobedo Ruíz
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Claudia Ledezma Garza
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Fabián Lozano García
          </p>
        </Box>
        
        <Box style={{marginLeft: "2dvw", marginRight: "2dvw"}}>
          <div style={{marginBottom: "2dvw", fontSize: "1.5dvw"}}>
            <b>DISEÑO WEB</b>
          </div>
          
          <p style={{ fontSize: '1dvw'}}>
            Jeannette Arjona Hernández
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Adrian Tadeo Barrera Almanza
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Diego Alejandro Michel Castro
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Erick Schiller Echavarría
          </p>
        </Box>
        
        <Box style={{marginLeft: "2dvw", marginRight: "2dvw"}}>
          <div style={{marginBottom: "2dvw", fontSize: "1.5dvw"}}>
            <b>AGRADECIMIENTOS</b>
          </div>
          
          <p style={{ fontSize: '1dvw'}}>
            Luis Ávila
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Rebecca Bell
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Ana Fernanda Hierro
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Carlos Hurtado
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Lucía Elizondo
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Sindy González Tijerina
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Javiel Leal
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Martha Montemayor
          </p>
          <p style={{ fontSize: '1dvw'}}>
            Luisa Pérez Barbosa
          </p>
        </Box>

      </Box>
    </div>
  );
};

export default Equipo;

