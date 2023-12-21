import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import backgroundImage1 from "../images/primera.jpeg";
import backgroundImage2 from "../images/segunda.jpeg";
import backgroundImage3 from "../images/tercera.jpeg";
import backgroundImage4 from "../images/cuarta.jpeg";
import backgroundImage5 from "../images/quinta.jpeg";
import backgroundImage6 from "../images/sexta.jpeg";
import backgroundImage7 from "../images/septima.jpeg";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newIndex = Math.floor(window.scrollY / window.innerHeight);
      setCurrentImageIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const alignCenter = { display: "flex", alignItems: "center" };

  const imageContainerStyle = {
    height: "50vh",
    width: "40vw",
    borderRadius: "20px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "10vw", // Posiciona el contenedor a la izquierda
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
  };

  const textStyle = {
    fontSize: "2rem",
    color: "#333",
    margin: "20px 0",
    width: "30vw",
    textAlign: "right",
  };

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    backgroundColor: "#fff", // Ajusta el color de fondo
    flexDirection: "column", // Para colocar los textos uno debajo del otro
    marginLeft: "7rem", // Margen izquierdo para separar del borde
  };

  const titleStyle = {
    fontSize: "20vh", // Ajusta el tamaño del texto según tus preferencias
    color: "#515151", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "1rem", // Elimina el margen predeterminado
  };
  const textStyle1 = {
    fontSize: "8vh", // Ajusta el tamaño del texto según tus preferencias
    color: "#808080", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "2rem", // Elimina el margen predeterminado
  };

  const arrowStyle = {
    fontSize: "4vh",
    color: "#808080",
    textAlign: "left",
    marginLeft: "3rem",
    cursor: "pointer", // Agregamos un cursor apuntador para indicar que es clickable
  };
  return (
    <Parallax pages={8}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Ciudad finita</h1>
        <h1 style={textStyle1}>Expansión urbana en la</h1>
        <h1 style={textStyle1}>zona metropolitana de</h1>
        <Link to="/introduccion">
          <div style={arrowStyle}>
            &#9654; {/* Carácter Unicode para la flecha derecha */}
          </div>
        </Link>
      </div>

      <div style={{ backgroundColor: "white" }}>
        {/* Imagenes y Textos */}
        {[
          backgroundImage1,
          backgroundImage2,
          backgroundImage3,
          backgroundImage4,
          backgroundImage5,
          backgroundImage6,
          backgroundImage7,
        ].map((image, index) => (
          <React.Fragment
            key={index}
            offset={index}
            speed={0.5}
            style={{
              ...alignCenter,
              justifyContent: "flex-start",
              opacity: 1 - index * 0.1, // Ajusta la opacidad
            }}
          >
            <ParallaxLayer
              sticky={{ start: 1, end: 7 }}
              style={{ ...alignCenter, justifyContent: "flex-start" }}
            >
              <div style={imageContainerStyle}>
                <img
                  src={backgroundImage1}
                  alt={`Descripción de la imagen ${index + 1}`}
                  style={imageStyle}
                />
              </div>
            </ParallaxLayer>

            <ParallaxLayer
              offset={index + 0.5}
              speed={0.5}
              style={{ ...alignCenter, justifyContent: "flex-end" }}
            >
              <p style={textStyle}>
                Texto relacionado con la imagen {index + 1}
              </p>
            </ParallaxLayer>
          </React.Fragment>
        ))}
      </div>
    </Parallax>
  );
};

export default Home;
