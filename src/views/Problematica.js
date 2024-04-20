import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";

import { BarMobile, Sidebar } from "../components/Sidebar";
import { Header, HeaderMobile } from "../components/Header";
import "../index.css";
import { Card } from "../components/Card";
import { sectionsInfo } from "../utils/constants";
import Sheet from "react-modal-sheet";

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
  const [currentSnap, setCurrentSnap] = useState(1);
  const CurrentCardContent = sectionsInfo[currentSection].component;
  const title = sectionsInfo[currentSection].title;
  const ref = useRef();
  const snapTo = (i: number) => ref.current?.snapTo(i);

  useEffect(() => {
    setOpen(true);
    setCurrentSnap(2);
  }, [currentSection]);

  return (
    <Sheet
      ref={ref}
      isOpen={true}
      onClose={() => {
        setOpen(true);
        snapTo(2);
        setCurrentSnap(2);
      }}
      snapPoints={[1, 0.5, 50]}
      initialSnap={currentSnap}
      detent="full-height"
      tweenConfig={{ ease: "easeOut", duration: 0.2 }}
      onSnap={(i) => setCurrentSnap(i)}
      style={{ zIndex: 2 }}
    >
      <Sheet.Container>
        <Sheet.Header>
          <HeaderMobile
            color={color}
            title={title}
            open={open}
            setOpen={() => {
              snapTo(currentSnap === 2 ? 1 : 2);
              setCurrentSnap(currentSnap === 2 ? 1 : 2);
            }}
          />
        </Sheet.Header>
        <Sheet.Content disableDrag style={{ paddingBottom: ref.current?.y }}>
          <Sheet.Scroller draggableAt="top">
            <Box
              bg="white"
              borderColor={`${color}.500`}
              margin="4"
              style={{ height: "30dvh" }}
            >
              <CurrentCardContent />
            </Box>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};

const Problematica = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [currentSection, setCurrentSection] = useState(undefined);
  const [outline, setOutline] = useState();
  const [sharedProps, setSharedProps] = useState({});
  const currentInfo = currentSection ? sectionsInfo[currentSection] : {};
  const CurrentControls = currentSection
    ? sectionsInfo[currentSection].controls
    : null;
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
    setCurrentSection(sectionFromURL || "expansion-urbana");
  }, []);
  useEffect(() => {
    if (!currentSection) return;
    if (!isMobile) {
      const el = document.getElementById(currentSection);
      if (el) {
        el.scrollIntoView();
      }
    }
  }, [currentSection]);
  function updateSection(section) {
    if (!isMobile) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView();
      }
    }
    window.history.replaceState(null, null, `#${section}`);
    setCurrentSection(section);
  }
  return (
    <div style={{ display: isMobile ? "inline-block" : "flex" }}>
      <Bar section={currentSection} setSection={updateSection} />
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
        {currentSection && (
          <>
            <CurrentCardContainer />
            <Box
              className={isMobile ? "mapContainerMobile" : "mapContainer"}
              borderColor={`${sectionsInfo[currentSection].color}.500`}
            >
              <CurrentControls />
            </Box>
          </>
        )}
      </CardContext.Provider>
    </div>
  );
};

export default Problematica;
