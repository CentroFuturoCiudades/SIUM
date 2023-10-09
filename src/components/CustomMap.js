import { DeckGL } from "deck.gl";
import StaticMap from "react-map-gl";
import maplibregl from "maplibre-gl";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

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
    </>
  );
}
