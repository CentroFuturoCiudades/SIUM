import { DeckGL } from "deck.gl";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import ReactMapGL from "react-map-gl";
import mapboxgl from "mapbox-gl";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const DECK_GL_CONTROLLER = {
  scrollZoom: false,
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
  inertia: true,
};
export const INITIAL_STATE = {
  latitude: 25.652983,
  longitude: -100.286419,
  zoom: 10,
  transitionDuration: 800,
  pitch: 0,
  bearing: 0,
};

export function CustomMap({ viewState, setViewState, layers }) {
  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };
  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        controller={DECK_GL_CONTROLLER}
      >
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken="pk.eyJ1IjoidXJpZWxzYTk2IiwiYSI6ImNsbnV2MzBkZDBlajYya211bWk2eTNuc2MifQ.ZnhFC3SyhckuIQBLO59HxA"
          style={{ width: "100%", height: "100%" }}
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
    </>
  );
}
