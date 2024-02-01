import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton, useMediaQuery } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { GeoJsonLayer, IconLayer } from "deck.gl";
import { useCardContext } from "../views/Problematica";
import { useEffect, useState } from "react";

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
  const { outline } = useCardContext();
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
    setProcessedViewState({ ...processedViewState, zoom: isMobile ? viewState.zoom * 0.9 : viewState.zoom });
  }, [isMobile]);

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
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken="pk.eyJ1IjoidXJpZWxzYTk2IiwiYSI6ImNsbnV2MzBkZDBlajYya211bWk2eTNuc2MifQ.ZnhFC3SyhckuIQBLO59HxA"
        />
        {children}
        {outline ? <GeoJsonLayer {...outline.props} /> : null}
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
