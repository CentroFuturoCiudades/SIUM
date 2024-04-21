import { Card, Icon, useMediaQuery, Heading, Text } from "@chakra-ui/react";
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
          borderRadius="2dvw"
          w={isMobile ? "25dvw" : "15dvw"}
          h={isMobile ? "25dvw" : "15dvw"}
          p="1dvw"
          m="auto"
          justifyContent="center"
          style={{
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
              <>
                <Heading
                  fontFamily="Inter"
                  letterSpacing="-0.5px"
                  fontSize={isMobile ? "2.5dvw" : "1.2dvw"}
                >
                  <b>{question}</b>
                </Heading>
                <Text
                  fontFamily="Inter"
                  fontSize={isMobile ? "1.6dvw" : "1dvw"}
                  textAlign="start"
                  mt="1dvw"
                >
                  {answer}
                </Text>
              </>
            ) : (
              <>
                <Icon as={icon} boxSize={isMobile ? "5dvw" : "3dvw"} />
                <Heading
                  fontFamily="Inter"
                  letterSpacing="-0.5px"
                  fontSize={isMobile ? "2.5dvw" : "1.2dvw"}
                >
                  <b>{question}</b>
                </Heading>
              </>
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default CardBody;
