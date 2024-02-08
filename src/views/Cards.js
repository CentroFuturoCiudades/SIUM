import React from "react";
import CardBody from "../components/CardBody";
import { sectionsInfo } from "../utils/constants";
import { Heading, SimpleGrid, useMediaQuery } from "@chakra-ui/react";

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
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <SimpleGrid
          columns={isMobile ? 3 : 4}
          style={{ height: "100dvh", width: "100%", alignItems: 'center' }}
        >
          {Object.keys(sectionsInfo).map((key) => (
            <div key={key} style={{ margin: "2dvw" }}>
              <CardBody
                id={key}
                icon={sectionsInfo[key].icon}
                question={sectionsInfo[key].title}
                answer={sectionsInfo[key].answer}
                color={`${sectionsInfo[key].color}.500`}
              />
            </div>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default Cards;
