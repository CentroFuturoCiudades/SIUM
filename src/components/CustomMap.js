import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import { FlyToInterpolator, GeoJsonLayer } from "deck.gl";
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

export function CustomMap({ viewState, setViewState, layers, handleSliderChange, time }) {

  // Asumiendo que tienes un estado para la hora seleccionada, llamado selectedHour
/*const filteredTransportData = transportData.features.filter(feature => {
  const horaOri = feature.properties.HoraOri; // Asumiendo que la hora está en formato "18:50"
  const horaDest = feature.properties.HoraDest; // Asumiendo que la hora está en formato "19:00"

  const hourStart = parseInt(horaOri.split(":")[0]);
  const hourEnd = parseInt(horaDest.split(":")[0]);
  const selected = selectedHour;

  return selected >= hourStart && selected <= hourEnd;
});*/


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
      {/*<input
        type="range"
        min={minHour}
        max={maxHour}
        value={selectedHour}
        onChange={(e) => setSelectedHour(parseInt(e.target.value))}
        style={{ width: "100%" }}
      />*/}
      <input
        style={{ width: '100%' }}
        type="range"
        min="0"
        max="23" // Ajusta el valor máximo según tus necesidades de tiempo
        step="1" // O ajusta el paso según tus necesidades
        value={time}
        onChange={handleSliderChange} // Envía el evento del cambio del slider al componente App
      />
    </div>/*
    </>
  );
}
