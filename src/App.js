import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { Sidebar, sectionsInfo } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CustomMap, INITIAL_STATE } from "./components/CustomMap";
import { ExpansionUrbanaCard } from "./components/ExpansionUrbanaCard";
import { TransporteCard } from "./components/TransporteCard";
import { EmpleoCard } from "./components/EmpleoCard";
import { ViviendaCard } from "./components/ViviendaCard";
import { SegregacionCard } from "./components/SegregacionCard";
import { DelincuenciaCard } from "./components/DelincuenciaCard";
import { CostosCard } from "./components/CostosCard";
import { geojsonsMapping } from "./utils/constants";
import "./index.css";

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

const useSection = (initialSection) => {
  const [currentSection, setCurrentSection] = useState(initialSection);

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
    const sectionFromURL = getSectionFromURL();
    if (sectionFromURL) {
      const el = document.getElementById(sectionFromURL);
      if (el) {
        setCurrentSection(sectionFromURL);
        el.scrollIntoView();
      }
    }
  }, []);

  return [currentSection, setCurrentSection];
};

export default function App() {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [outline, setOutline] = useState(null);
  const [currentSection, setCurrentSection] = useSection("expansion-urbana");
  const currentInfo = sectionsInfo[currentSection];
  const currentLayer = geojsonsMapping[currentSection]
    ? geojsonsMapping[currentSection]
    : null;
  const extraLayers = outline ? [outline] : []; // Change in layer
  const layers = currentLayer
    ? [currentLayer, ...extraLayers]
    : [...extraLayers];

  useEffect(() => {
    if (currentSection) {
      setViewState(INITIAL_STATE);
    }
  }, [currentSection]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar section={currentSection} setSection={setCurrentSection} />
      <div className="cardsContainer">
        <Header
          section={currentSection}
          color={currentInfo.color}
          title={currentInfo.title}
        />
        <ExpansionUrbanaCard setOutline={setOutline} />
        <EmpleoCard setOutline={setOutline} />
        <TransporteCard setOutline={setOutline} />
        <ViviendaCard setOutline={setOutline} />
        <SegregacionCard setOutline={setOutline} />
        <DelincuenciaCard setOutline={setOutline} />
        <CostosCard setOutline={setOutline} />
      </div>
      <Box
        className="mapContainer"
        borderColor={`${sectionsInfo[currentSection].color}.500`}
      >
        <CustomMap
          viewState={viewState}
          setViewState={setViewState}
          layers={layers}
        />
      </Box>
    </div>
  );
}
