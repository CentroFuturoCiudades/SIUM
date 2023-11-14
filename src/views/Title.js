import React from "react";
import { Link } from "react-router-dom";

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
const textStyle = {
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

const Title = () => {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Ciudad finita</h1>
      <h1 style={textStyle}>Expansión urbana en la</h1>
      <h1 style={textStyle}>zona metropolitana de</h1>
      <Link to="/bodytext">
        <div style={arrowStyle}>&#9654; {/* Carácter Unicode para la flecha derecha */}</div>
      </Link>
    </div>
  );
}

export default Title;
