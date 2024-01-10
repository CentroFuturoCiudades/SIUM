import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";

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

export function CustomMap({ layers, viewState, setViewState }) {
  const filteredLayers = layers ? layers.map((x) => new x.type(x.props)) : [];
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
    </>
  );
}
