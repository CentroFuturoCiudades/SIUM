import { Card, Icon, useMediaQuery } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CardBody = ({ id, question, answer, icon, color }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <Link to={`/problematica#${id}`}>
        <Card
          backgroundColor={color}
          color="white"
          borderRadius={20}
          p="4"
          style={{
            width: "200px",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s",
          }}
        >
          <div
            style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
              backfaceVisibility: "hidden",
              textAlign: "center",
            }}
          >
            {isFlipped ? (
              <div>
                <Icon as={icon} boxSize={10} />
                <h3>{answer}</h3>
              </div>
            ) : (
              <div>
                <Icon as={icon} boxSize={10} />
                <h1 style={{ fontFamily: "Inter", fontSize: isMobile ? "10px" : "18px" }}>
                  <b>{question}</b>
                </h1>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default CardBody;
