import React, { createContext, useContext, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import "../index.css";
import { Card } from "../components/Card";
import { sectionsInfo } from "../utils/constants";

const CardContext = createContext();

export const useCardContext = () => useContext(CardContext);

const isSectionInView = (section) => {
  const { top, bottom } = section.getBoundingClientRect();
  const midScreen = window.innerHeight * 0.5;

  return (
    (top > 0 && top <= midScreen) ||
    (bottom > midScreen && bottom <= window.innerHeight)
  );
};

const getCurrentSectionId = () => {
  const sections = document.querySelectorAll("section");
  const currentSection = Array.from(sections).find(isSectionInView);

  return currentSection ? currentSection.id : null;
};

const getSectionFromURL = () => {
  return window.location.hash?.replace("#", "") || null;
};

export const CardsContainer = ({ currentSection, currentInfo }) => {
  return (
    <div className="cardsContainer">
      <Header
        section={currentSection}
        color={currentInfo.color}
        title={currentInfo.title}
      />
      {Object.keys(sectionsInfo).map((key) => {
        const CardContent = sectionsInfo[key].component;
        return (
          <Card id={key} key={key} color={sectionsInfo[key].color}>
            {currentSection === key ? <CardContent /> : null}
          </Card>
        );
      })}
    </div>
  );
};

const Problematica = () => {
  const [currentSection, setCurrentSection] = useState("expansion-urbana");
  const [outline, setOutline] = useState();
  const [sharedProps, setSharedProps] = useState({});
  const currentInfo = sectionsInfo[currentSection];
  const CurrentControls = sectionsInfo[currentSection].controls;

  useEffect(() => {
    const handleScroll = () => {
      const detectedSectionId = getCurrentSectionId();
      const currentHash = getSectionFromURL();

      if (detectedSectionId && detectedSectionId !== currentHash) {
        setCurrentSection(detectedSectionId);
        setOutline(null);
        window.history.replaceState(null, null, `#${detectedSectionId}`);
      }
    };

    window.document.body.addEventListener("scroll", handleScroll);

    return () =>
      window.document.body.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionFromURL = getSectionFromURL();
    if (sectionFromURL) {
      const el = document.getElementById(sectionFromURL);
      if (el) {
        setCurrentSection(sectionFromURL);
        el.scrollIntoView();
      }
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar section={currentSection} setSection={setCurrentSection} />
      <CardContext.Provider
        value={{
          currentSection,
          setOutline,
          outline,
          color: currentInfo.color,
          sharedProps,
          setSharedProps,
        }}
      >
        <CardsContainer
          currentSection={currentSection}
          currentInfo={currentInfo}
        />
        <Box
          className="mapContainer"
          borderColor={`${sectionsInfo[currentSection].color}.500`}
        >
          {CurrentControls && <CurrentControls />}
        </Box>
      </CardContext.Provider>
    </div>
  );
};

export default Problematica;
