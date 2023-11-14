import React from 'react'
import { Link } from 'react-router-dom';

const titleStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
  };
  
  const textStyle = {
    fontSize: "5vh", 
    color: "#808080", 
    textAlign: "center", 
    margin: "20rem", 
  };

  const arrowStyle = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    fontSize: "3rem",
    color: "#808080",
    cursor: "pointer",
  };

const BodyText = () => {
    return (
        <div style={titleStyle}>
          <p style={textStyle}>
            La mancha urbana de Monterrey se expande a
            ritmos alarmantes, 50% en los últimos 30 años.
            La expansión genera problemas
            ambientales, económicos y sociales. La ciudad
            y sus recursos son finitos, la expansión
            descontrolada y poco planeada debe de
            replantearse.
          </p>
          <Link to="/cards">
        <div style={arrowStyle}>&#9654;</div>
      </Link>
        </div>
      );
}

export default BodyText