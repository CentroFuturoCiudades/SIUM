import { useEffect, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";

import { ExpansionUrbanaCard } from "./components/ExpansionUrbanaCard";
import { TransporteCard } from "./components/TransporteCard";
import { EmpleoCard } from "./components/EmpleoCard";
import { CustomMap, INITIAL_STATE } from "./components/CustomMap";

import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./styles.module.css";
import { ViviendaCard } from "./components/ViviendaCard";
import { SegregacionCard } from "./components/SegregacionCard";
import { DelincuenciaCard } from "./components/DelincuenciaCard";
import { CostosCard } from "./components/CostosCard";
import { dictionaryMaps } from "./utils/constants";

  // Imports for layers defined at constants.js
import { EMPLOYMENT_LAYER } from "./utils/constants";   
import { EMPLOYMENT_LAYER_1 } from "./utils/constants";
import { PRIMARY_ROUTES } from "./utils/constants";

const isSectionInView = (section) => {
  const { top, bottom } = section.getBoundingClientRect();
  const midScreen = window.innerHeight * 0.5;

  return (
    (top > 0 && top <= midScreen) ||
    (bottom > midScreen && bottom <= window.innerHeight)
  );
};

 // ----------------------------------------------------------------------
const section = 'empleo'
new GeoJsonLayer(dictionaryMaps[section])
 // -------------------------------------------------------------------------

const getCurrentSectionId = () => {
  const sections = document.querySelectorAll("section");
  const currentSection = Array.from(sections).find(isSectionInView);

  return currentSection ? currentSection.id : null;
};

const getSectionFromURL = () => {
  return window.location.hash?.replace("#", "") || null;
};

export default function App() {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [outline, setOutline] = useState(null);
  const [currentSection, setCurrentSection] = useState(1);
  const currentLayer = dictionaryMaps[currentSection] ? new GeoJsonLayer(dictionaryMaps[currentSection]) : null;
  const extralayers = outline ? [new GeoJsonLayer(outline)] : []; // Change in layer
  const layers = currentLayer ? [currentLayer, ...extralayers] : [...extralayers];
  


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
      <div className={styles.cardsContainer}>
        <ExpansionUrbanaCard setOutline={setOutline} />
        <EmpleoCard setOutline={setOutline} />
        <TransporteCard setOutline={setOutline} />
        <ViviendaCard setOutline={setOutline} />
        <SegregacionCard setOutline={setOutline} />
        <DelincuenciaCard setOutline={setOutline} />
        <CostosCard setOutline={setOutline} />
      </div>
      <div className={styles.mapContainer}>
        <CustomMap
          viewState={viewState}
          setViewState={setViewState}
          layers={layers}
        />
      </div>
    </div>
  );
}
