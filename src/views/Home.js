import React, { useEffect, useRef, useState } from "react";
import { Text } from "@chakra-ui/react";
import Cards from "./Cards";

const Home = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const year = currentImageIndex * 5 + 1990;
  const numberOfImages = 7;

  useEffect(() => {
    const handleScroll = () => {
      const normalized =
        (window.document.body.scrollTop - containerRef.current.offsetTop) /
        (containerRef.current.scrollHeight - containerRef.current.offsetTop);
      const currentImageIndex = Math.min(
        Math.max(Math.floor(normalized * numberOfImages), 0),
        numberOfImages - 1
      );
      setCurrentImageIndex(currentImageIndex);
    };

    window.document.body.addEventListener("scroll", handleScroll);

    return () =>
      window.document.body.removeEventListener("scroll", handleScroll);
  }, []);

  const adjustStickyPosition = () => {
    if (imageRef.current) {
      const elementHeight = imageRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const topPosition = (windowHeight - elementHeight) / 2;
      imageRef.current.style.top = `${topPosition}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustStickyPosition);
    adjustStickyPosition();

    return () => {
      window.removeEventListener("resize", adjustStickyPosition);
    };
  }, []);

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    borderRadius: "0px 0px 0px 50px",
    background: "#f7f2e4", // Ajusta el color de fondo
    flexDirection: "column", // Para colocar los textos uno debajo del otro
    marginLeft: "7rem", // Margen izquierdo para separar del borde
  };

  const titleStyle = {
    fontSize: "20vh", // Ajusta el tamaño del texto según tus preferencias
    color: "#515151", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "1rem", // Elimina el margen predeterminado
  };
  const subTitleStyle = {
    fontSize: "8vh", // Ajusta el tamaño del texto según tus preferencias
    lineHeight: "1.2",
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "2rem", // Elimina el margen predeterminado
  };
  const imageStyle = {
    borderRadius: "50px 0px 0px 50px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingTop: "calc(60vw * 3 / 4)",
    width: "70vw",
    position: "sticky",
    overflow: "hidden",
    right: "0",
    float: "right",
    zIndex: -1,
    boxShadow: "5px 10px 10px 0px rgba(0,0,0,0.3)",
  };
  const yearStyle = {
    margin: "auto",
    position: "relative",
    top: "-30px",
    textAlign: "center",
  };
  const textStyle = {
    width: "calc(30% - 60px)",
    margin: "40px",
    textAlign: "justify",
  };

  return (
    <>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Ciudad finita</h1>
        <Text style={subTitleStyle} color="gray" m="0">
          Expansión urbana en la
        </Text>
        <Text style={subTitleStyle} color="gray" m="0">
          Zona Metropolitana de
        </Text>
        <Text style={subTitleStyle} color="orange.500" m="0">
          <b>Monterrey</b>
        </Text>
      </div>
      <div>
        <div
          ref={imageRef}
          style={{
            backgroundImage: `url('https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/images/expansion_${year}.jpeg')`,
            ...imageStyle,
          }}
        >
          <Text
            style={yearStyle}
            fontFamily={"Poppins"}
            fontSize="5xl"
            color="white"
          >
            <b>{year}</b>
          </Text>
        </div>
        <div ref={containerRef}>
          <Text color="gray.600" fontSize="2xl" style={textStyle}>
            En las últimas tres décadas, la mancha urbana de Monterrey ha
            experimentado un crecimiento exponencial, triplicándose en tamaño.
            Este desarrollo, si bien evidencia el dinamismo de la ciudad,
            también conlleva riesgos ambientales, económicos y sociales. Los
            recursos urbanos y ambientales, que son esenciales para el bienestar
            de la comunidad, son finitos y deben manejarse con responsabilidad.
          </Text>
          <Text color="gray.600" fontSize="2xl" style={textStyle}>
            <b>La 'mancha urbana'</b> se refiere a la expansión continua de la
            ciudad en términos de construcción y desarrollo. En este contexto,
            es crucial destacar que esta expansión no planificada y
            descontrolada requiere una reconsideración urgente.
          </Text>
          <Text color="gray.600" fontSize="2xl" style={textStyle}>
            <b>La finitud de los recursos</b> urbanos, ambientales y la
            expansión aparentemente 'infinita' de la ciudad, nos hace
            plantearnos diversas preguntas fundamentales sobre la sostenibilidad
            y la gestión responsable de nuestro entorno. Enfrentar estos
            desafíos requiere un enfoque reflexivo y acciones concertadas para
            garantizar un futuro sostenible para la comunidad y el entorno en la
            Zona Metropolitana de Monterrey.
          </Text>
        </div>
      </div>
      <Cards />
    </>
  );
};

export default Home;
