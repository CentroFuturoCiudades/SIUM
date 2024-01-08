import React, { createContext, useContext, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { CustomMap, INITIAL_STATE } from "../components/CustomMap";
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

export const CardsContainer = ({
  currentSection,
  currentInfo,
  setLayers,
  setControlsProps,
  setOutline,
}) => {
  return (
    <div className="cardsContainer">
      <Header
        section={currentSection}
        color={currentInfo.color}
        title={currentInfo.title}
      />
      <CardContext.Provider
        value={{ currentSection, setLayers, setControlsProps, setOutline }}
      >
        {Object.keys(sectionsInfo).map((key) => {
          const CardContent = sectionsInfo[key].component;
          return (
            <Card id={key} key={key} color={sectionsInfo[key].color}>
              <CardContent
                isCurrentSection={currentSection === key}
                color={sectionsInfo[key].color}
              />
            </Card>
          );
        })}
      </CardContext.Provider>
    </div>
  );
};

export default function Body() {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [currentSection, setCurrentSection] = useState("expansion-urbana");
  const [layers, setLayers] = useState([]);
  const [outline, setOutline] = useState();
  const [controlsProps, setControlsProps] = useState(null);
  const currentInfo = sectionsInfo[currentSection];
  const CurrentControls = sectionsInfo[currentSection].controls;
  let filteredLayers =  outline ? [...layers, outline] : [...layers];

  useEffect(() => {
    const handleScroll = () => {
      const detectedSectionId = getCurrentSectionId();
      const currentHash = getSectionFromURL();

      if (detectedSectionId && detectedSectionId !== currentHash) {
        setCurrentSection(detectedSectionId);
        window.history.replaceState(null, null, `#${detectedSectionId}`);
      }
    };

    window.document.body.addEventListener("scroll", handleScroll);

    return () =>
      window.document.body.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentSection) {
      setViewState(INITIAL_STATE);
    }
  }, [currentSection]);

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
      <CardsContainer
        currentSection={currentSection}
        currentInfo={currentInfo}
        setLayers={setLayers}
        setControlsProps={setControlsProps}
        setOutline={setOutline}
      />
      <Box
        className="mapContainer"
        borderColor={`${sectionsInfo[currentSection].color}.500`}
      >
        <CustomMap
          viewState={viewState}
          setViewState={setViewState}
          layers={filteredLayers}
          currentSection={currentSection}
          color={sectionsInfo[currentSection].color}
        />
        {CurrentControls && <CurrentControls {...controlsProps} />}
      </Box>
    </div>
  );
}
