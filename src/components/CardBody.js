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
          p="1dvw"
          style={{
            width: isMobile ? '25dvw' : '15dvw',
            height: isMobile ? '25dvw' : '15dvw',
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
            transformStyle: "preserve-3d",
            transition: "transform 0.7s",
            boxShadow: "0px 0.8dvw 0.8dvw 0px rgba(100,100,100,0.3)",
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
                <Icon as={icon} boxSize={isMobile ? '5dvw' : '3dvw'} />
                <h3 style={{ fontFamily: "Inter", fontSize: isMobile ? '1.6dvw' : '1dvw' }}>{answer}</h3>
              </div>
            ) : (
              <div>
                <Icon as={icon} boxSize={isMobile ? '5dvw' : '3dvw'} />
                <h1 style={{ fontFamily: "Inter", fontSize: isMobile ? '1.8dvw' : '1.2dvw' }}>
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
