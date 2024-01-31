import React, { createContext, useContext, useEffect, useState } from "react";
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";

import { BarMobile, Sidebar } from "../components/Sidebar";
import { Header, HeaderMobile } from "../components/Header";
import "../index.css";
import { Card } from "../components/Card";
import { sectionsInfo } from "../utils/constants";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";

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

export const CardsContainer = () => {
  const { currentSection } = useCardContext();
  const currentInfo = sectionsInfo[currentSection];
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

export const CardsContainerMobile = () => {
  const { currentSection, color } = useCardContext();
  const [open, setOpen] = useState(true);
  const CurrentCardContent = sectionsInfo[currentSection].component;
  const title = sectionsInfo[currentSection].title;

  useEffect(() => {
    setOpen(true);
  }, [currentSection]);

  return (
    <SwipeableBottomSheet
      open={open}
      onChange={setOpen}
      overflowHeight={50}
      shadowTip={false}
      overlay={false}
      topShadow={false}
      style={{ zIndex: 2 }}
      bodyStyle={{ borderRadius: "1.2rem 1.2rem 0 0" }}
      overlayStyle={{ borderRadius: "1.2rem 1.2rem 0 0", zIndex: 2 }}
    >
      <HeaderMobile color={color} title={title} open={open} setOpen={setOpen} />
      <Box
        bg="white"
        borderColor={`${color}.500`}
        margin="4"
        style={{ height: "30dvh", marginTop: "60px" }}
      >
        <CurrentCardContent />
      </Box>
    </SwipeableBottomSheet>
  );
};

const Problematica = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [currentSection, setCurrentSection] = useState("expansion-urbana");
  const [outline, setOutline] = useState();
  const [sharedProps, setSharedProps] = useState({});
  const currentInfo = sectionsInfo[currentSection];
  const CurrentControls = sectionsInfo[currentSection].controls;
  const Bar = isMobile ? BarMobile : Sidebar;
  const CurrentCardContainer = isMobile ? CardsContainerMobile : CardsContainer;

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
    <div style={{ display: isMobile ? "inline-block" : "flex" }}>
      <Bar section={currentSection} setSection={setCurrentSection} />
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
        <CurrentCardContainer />
        <Box
          className={isMobile ? "mapContainerMobile" : "mapContainer"}
          borderColor={`${sectionsInfo[currentSection].color}.500`}
        >
          <CurrentControls />
        </Box>
      </CardContext.Provider>
    </div>
  );
};

export default Problematica;
