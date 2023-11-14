import React, { useState } from "react";

const CardBody = ({ text, color }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      style={{
        width: "200px",
        height: "100px",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
        transformStyle: "preserve-3d",
        transition: "transform 0.5s",
      }}
      onClick={handleCardClick}
    >
      <div
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <p>{text}</p>
      </div>
      <div
        style={{
          position: "absolute",
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        <p>Otro texto</p>
      </div>
    </div>
  );
};

export default CardBody;
