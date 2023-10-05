import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import StaticMap from "react-map-gl";
import maplibregl from "maplibre-gl";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./styles.module.css";

const DECK_GL_CONTROLLER = {
  scrollZoom: false,
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
  inertia: true,
};
const INITIAL_STATE = {
  latitude: 25.652983,
  longitude: -100.286419,
  zoom: 10,
  transitionDuration: 800,
  pitch: 0,
  bearing: 0,
};
const PERIFERIES = [
  "Juárez",
  "García",
  "Apodaca",
  "Gral. Escobedo",
  "Santiago",
  "Ciénega de Flores",
  "Salinas Victoria",
  "Pesquería",
  "Carmen",
  "Cadereyta Jiménez",
  "Hidalgo",
  "Gral. Zuazua",
];
const SUBCENTERS = [
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Santa Catarina",
];
const PERIFERY_LAYER = {
  id: "perfifery-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => PERIFERIES.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [255, 174, 0, 10],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
};
const CENTER_LAYER = {
  id: "center-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => SUBCENTERS.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [7, 3, 252, 10],
  getLineColor: [7, 3, 252, 200],
  getLineWidth: 10,
};

function Card({ id, children }) {
  return (
    <section id={id}>
      <div className={`${styles.card}`}>{children}</div>
    </section>
  );
}

function Card1({ setOutline }) {
  return (
    <Card id="section1">
      <h2 className={styles.title}>¿Hacia dónde crecemos?</h2>
      Las familias migran a la{" "}
      <span
        className={styles.highlightAccent}
        onMouseOver={() => setOutline(PERIFERY_LAYER)}
        onMouseOut={() => setOutline(null)}
      >
        periferia
      </span>{" "}
      donde hay menor acceso a transporte público, servicios y empleo.
    </Card>
  );
}

function Card2({ setOutline }) {
  return (
    <Card id="section2">
      <h2 className={styles.title}>¿En donde trabajamos?</h2>
      Porque en los{" "}
      <span
        className={styles.highlightPrimary}
        onMouseOver={() => setOutline(CENTER_LAYER)}
        onMouseOut={() => setOutline(null)}
      >
        subcentros
      </span>{" "}
      la vivienda es muy cara para gran parte de los ciudadanos.
    </Card>
  );
}

function Card3({ setOutline }) {
  return (
    <Card id="section3">
      <h2 className={styles.title}>¿Como nos movemos?</h2>
      <p>
        Alrededor del <b>40%</b> de los traslados se hacen desde la{" "}
        <span
          className={styles.highlightAccent}
          onMouseOver={() => setOutline(PERIFERY_LAYER)}
          onMouseOut={() => setOutline(null)}
        >
          periferia
        </span>{" "}
        como Apodaca, Escobedo, García y Juárez y el <b>26%</b> se traslada a
        Monterrey.
      </p>
      <p>
        El <b>45%</b> de los viajes son hechos al trabajo.
      </p>
      <p>
        El <b>47%</b> de los viajes son hechos en automóvil, donde más de la
        mitad <b>viajan solos</b>.
      </p>
      <p>
        En promedio se invierten <b>68 minutos</b> en viaje redondo.
      </p>
    </Card>
  );
}

export default function App() {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [outline, setOutline] = useState(null);
  const [currentSection, setCurrentSection] = useState(1);

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

  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };

  return (
    <div style={{ display: "flex" }} className="parent">
      <div style={{ width: "25%" }}>
        <Card1 setOutline={setOutline} />
        <Card2 setOutline={setOutline} />
        <Card3 setOutline={setOutline} />
      </div>
      <div className={styles.cardMap}>
        <DeckGL
          style={{ position: "relative" }}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          layers={outline ? [new GeoJsonLayer(outline)] : []}
          controller={DECK_GL_CONTROLLER}
        >
          <StaticMap
            mapLib={maplibregl}
            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          />
        </DeckGL>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <ButtonGroup isAttached size="sm" colorScheme="blackAlpha">
            <IconButton
              aria-label="Zoom In"
              onClick={zoomIn}
              icon={<AddIcon />}
            />
            <IconButton
              aria-label="Zoom Out"
              onClick={zoomOut}
              icon={<MinusIcon />}
            />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
