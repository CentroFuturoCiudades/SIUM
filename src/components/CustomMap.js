import DeckGL from "@deck.gl/react";
import {
  ButtonGroup,
  IconButton,
  useMediaQuery,
  useToken,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { GeoJsonLayer, TextLayer } from "deck.gl";
import { useCardContext } from "../views/Problematica";
import { useEffect, useState } from "react";
import {
  DATA_URL,
  MUNICIPIOS_URL,
  hexToRgb,
  useFetch,
} from "../utils/constants";
import { mappingNames } from "./Chart";

mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const DECK_GL_CONTROLLER = {
  scrollZoom: false,
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};
export const INITIAL_STATE = {
  latitude: 25.675,
  longitude: -100.286419,
  zoom: 9.5,
  transitionDuration: 100,
  pitch: 0,
  bearing: 0,
  minZoom: 8.5,
  maxZoom: 14,
};

//nueva para infancias
export const SPECIAL_INFANCIAS_STATE = {
  latitude: 25.65534,
  longitude: -100.30427,
  zoom: 13.2,
  transitionDuration: 800,
  pitch: 0,
  bearing: 0,
};

export function CustomMap({ viewState, infanciasHover, children }) {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [processedViewState, setProcessedViewState] = useState({
    ...viewState,
    zoom: isMobile ? viewState.zoom * 0.9 : viewState.zoom,
  });
  const { outline, color } = useCardContext();
  const { data: municipalityData } = useFetch(MUNICIPIOS_URL, { features: [] });
  const [colorValue] = useToken("colors", [`${color}.800`]);
  const zoomIn = () => {
    setProcessedViewState((v) => ({
      ...v,
      zoom: v.zoom + 1,
      transitionDuration: 100,
    }));
  };

  const zoomOut = () => {
    setProcessedViewState((v) => ({
      ...v,
      zoom: v.zoom - 1,
      transitionDuration: 100,
    }));
  };

  useEffect(() => {
    setProcessedViewState({
      ...processedViewState,
      zoom: isMobile ? viewState.zoom * 0.9 : viewState.zoom,
    });
  }, [isMobile]);

  if (!municipalityData) return <Loading />;

  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        viewState={processedViewState}
        onViewStateChange={({ viewState }) => setProcessedViewState(viewState)}
        controller={DECK_GL_CONTROLLER}
        onHover={infanciasHover}
      >
        <Map
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/lameouchi/cls55h898029301pfb1t07mtc"
          mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        />
        {children}
        <GeoJsonLayer
          id="municipality-layer"
          data={municipalityData.features}
          getFillColor={[128, 174, 0, 0]}
          getLineColor={[128, 128, 128, 80]}
          getLineWidth={100}
        />
        {outline ? (
          <GeoJsonLayer
            {...outline.props}
            getLineWidth={200}
            getLineColor={[...hexToRgb(colorValue), 150]}
            getFillColor={[160, 160, 160, 100]}
          />
        ) : null}
        <TextLayer
          id="municipios-text-layer"
          data={municipalityData.features}
          getPosition={(d) => [d.properties.longitude, d.properties.latitude]}
          getText={(d) => mappingNames[d.properties.NOMGEO]}
          // sizeUnits="meters"
          getSize={(d) => processedViewState.zoom}
          getColor={[0, 0, 0, 150]}
          fontFamily="Inter, Courier, monospace"
        />
      </DeckGL>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
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
    </>
  );
}
