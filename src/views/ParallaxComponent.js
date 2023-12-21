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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  const images = [backgroundImage1, backgroundImage2, backgroundImage3, backgroundImage4, backgroundImage5, backgroundImage6, backgroundImage7];

  return (
    <div style={{ backgroundColor: "white"}}>

      <Parallax pages={7} style={{ backgroundColor: "white"}}>
        {/* Imagenes y Textos */}
        {[backgroundImage1, backgroundImage2, backgroundImage3, backgroundImage4, backgroundImage5, backgroundImage6, backgroundImage7].map((image, index) => (
          <React.Fragment key={index}
            offset={index}
            speed={0.5} 
            style={{
              ...alignCenter,
              justifyContent: "flex-start",
              opacity: 1 - index * 0.1, // Ajusta la opacidad
            }}
          >
            <ParallaxLayer
              sticky={{ start: 0, end: 7 }}
              style={{ ...alignCenter, justifyContent: "flex-start" }}>
              <div style={imageContainerStyle}>
                <img src={backgroundImage1} alt={`Descripción de la imagen ${index + 1}`} style={imageStyle} />
              </div>
            </ParallaxLayer>

            <ParallaxLayer
              offset={index + 0.5}
              speed={0.5}
              style={{ ...alignCenter, justifyContent: "flex-end" }}>
              <p style={textStyle}>Texto relacionado con la imagen {index + 1}</p>
            </ParallaxLayer>
          </React.Fragment>
        ))}
      </Parallax>
    </div>
  );
};

export default Home;

