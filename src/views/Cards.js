import React from "react";
import CardBody from "../components/CardBody";
import { sectionsInfo } from "../utils/constants";
import { Heading } from "@chakra-ui/react";

const Cards = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Heading
        color="gray.600"
        fontSize="6xl"
        mx="100px"
        mt="100px"
        style={{ textAlign: "center" }}
      >
        Explora los problemas de la Expansión Urbana en Monterrey
      </Heading>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {Object.keys(sectionsInfo).map((key) => (
          <div key={key} style={{ margin: "4%" }}>
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
