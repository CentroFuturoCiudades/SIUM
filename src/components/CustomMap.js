import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import { FlyToInterpolator, GeoJsonLayer } from "deck.gl";
import mapboxgl from "mapbox-gl";
import { Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

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

export function CustomMap({ viewState, setViewState, layers, handleSliderChange, time }) {
  //const [deckLayers, setDeckLayers] = useState([]);
  // Actualizar las capas cuando cambia el tiempo
  /*useEffect(() => {
    const updatedLayers = layers.map((layer) =>
      layer.id === "primary_routes" ? { ...layer, dataTransform: (d) => layer.dataTransform(d, time) } : layer
    );
    setDeckLayers(updatedLayers);
  }, [layers, time]);*/

  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };

  /*useEffect(() => {
    // No necesitas manejar la transformación de datos aquí
  }, [time]);*/

  return (
    <>
      <DeckGL
        style={{ position: "relative" }}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers.map((layer) => new GeoJsonLayer(layer))}
        /*layers={[
          new GeoJsonLayer({
            id: "transport-layer",
            data: filteredTransportData,
            getLineColor: [100, 100, 100, 200],
            getLineWidth: 150,
          }),
        ]}*/
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
      <div style={{ position: "absolute", bottom: 10, left: 0, width: "100%", padding: "0 20px" }}>
      <input
        style={{ width: '100%' }}
        type="range"
        min="0"
        max="143"
        step="1" // O ajusta el paso según tus necesidades
        value={time}
        onChange={handleSliderChange} // Envía el evento del cambio del slider al componente App
      />
    </div>/*
    </>
  );
}
