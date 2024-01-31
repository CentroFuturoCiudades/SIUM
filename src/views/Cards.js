import React from "react";
import CardBody from "../components/CardBody";
import { sectionsInfo } from "../utils/constants";
import { Heading, useMediaQuery } from "@chakra-ui/react";

const Cards = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <div
      style={{
        height: isMobile ? "100%" : "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading
        color="gray.600"
        fontSize={isMobile ? "2xl" : "6xl"}
        mx={isMobile ? "5px" : "100px"}
        my="25px"
        style={{ textAlign: "center" }}
      >
        Explora los problemas de la Expansión Urbana en Monterrey
      </Heading>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {Object.keys(sectionsInfo).map((key) => (
          <div key={key} style={{ margin: "2%" }}>
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
    </div>
  );
};

export default Cards;
