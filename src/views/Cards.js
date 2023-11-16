import React from "react";
import CardBody from "../components/CardBody";
import { Link } from "react-router-dom";
import { sectionsInfo } from "../utils/constants";

const arrowStyle = {
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
  fontSize: "3rem",
  color: "#808080",
  cursor: "pointer",
};

const Cards = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {Object.keys(sectionsInfo).map((key) => (
          <div key={key} style={{ margin: "9vh" }}>
            <CardBody
              id={key}
              icon={sectionsInfo[key].icon}
              question={sectionsInfo[key].title}
              answer={sectionsInfo[key].answer}
              color={`${sectionsInfo[key].color}.500`}
            />
          </div>
        ))}
      </div>
      {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cardData.map((card, index) => (
        <div key={index} style={{ margin: '9vh' }}>
          <CardBody text={card.text} color={card.color} />
        </div>
      ))}
    </div> */}
      <Link to="/problematica">
        <div style={arrowStyle}>&#9654;</div>
      </Link>
    </div>
  );
};

export default Cards;
