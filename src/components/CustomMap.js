import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { GeoJsonLayer } from "deck.gl";
import { useCardContext } from "../views/Problematica";
import { useState } from "react";

mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

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

//nueva para infancias
export const SPECIAL_INFANCIAS_STATE = {
  //latitude: 25.675,
  latitude: 25.65534,
  //longitude: -100.286419,
  longitude: -100.30427,
  zoom: 13.2,
  transitionDuration: 800,
  pitch: 0,
  bearing: 0,
};

export function CustomMap({ viewState, setViewState, infanciasHover, children }) {
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const { outline } = useCardContext();
  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };

  const handleHover = (info) => {
    //console.log(info)
    console.log("coordenadas", info.coordinate)
    if(info.coordinate)
    {
      const [long, lat] = [info.coordinate[0], info.coordinate[1]]
      console.log("coor", [long, lat])
    }
  }

  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={DECK_GL_CONTROLLER}
        /*onHover={(info, event) => {
          console.log(event)
        }}*/
        
        //onHover={handleHover}
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
