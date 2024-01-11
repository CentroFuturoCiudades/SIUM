import DeckGL from "@deck.gl/react";
import {
  ButtonGroup,
  IconButton,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import mapboxgl from "mapbox-gl";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const DECK_GL_CONTROLLER = {
  scrollZoom: false,
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
  inertia: true,
};
export const INITIAL_STATE = {
  latitude: 25.675,
  longitude: -100.286419,
  zoom: 9.6,
  transitionDuration: 800,
  pitch: 0,
  bearing: 0,
};

export function CustomMap({ layers, viewState, setViewState, color }) {
  const filteredLayers = layers ? layers.map((x) => new x.type(x.props)) : [];
  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };

  return (
    <>
      <Skeleton
        height="100vh"
        isLoaded={filteredLayers.length > 0}
        startColor="white"
        endColor={`${color}.100`}
      >
        <DeckGL
          style={{ position: "relative" }}
          viewState={viewState}
          layers={filteredLayers}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          controller={DECK_GL_CONTROLLER}
        >
          <Map
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken="pk.eyJ1IjoidXJpZWxzYTk2IiwiYSI6ImNsbnV2MzBkZDBlajYya211bWk2eTNuc2MifQ.ZnhFC3SyhckuIQBLO59HxA"
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
      </Skeleton>
      {filteredLayers.length === 0 ? (
        <div style={{ position: "absolute", top: "50%", right: "50%" }}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            size="xl"
            color={`${color}.500`}
          />
        </div>
      ) : null}
    </>
  );
}
