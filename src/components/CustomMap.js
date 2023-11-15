import DeckGL from "@deck.gl/react";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Map } from "react-map-gl";
import { FlyToInterpolator, GeoJsonLayer } from "deck.gl";
import mapboxgl from "mapbox-gl";
import { Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

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

export function CustomMap({ viewState, setViewState, layers, handleSliderChange, time, isPlaying, togglePlay }) {
  const deckRef = useRef(null);

  useEffect(() => {
    if (deckRef.current) {
      deckRef.current.setProps({ layers, viewState });
    }
  }, [layers, viewState]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        handleSliderChange({
          target: { value: (time + 1) % 100 }, // Cambia según tus necesidades
        });
      }, 100); // Cambia según tus necesidades

      return () => clearInterval(interval);
    }
  }, [isPlaying, handleSliderChange, time]);

  const zoomIn = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom + 1, transitionDuration: 100 }));
  };

  const zoomOut = () => {
    setViewState((v) => ({ ...v, zoom: v.zoom - 1, transitionDuration: 100 }));
  };

  const marks = [
    { value: 5.95, label: '0' },
    { value: 11.9, label: '1' },
    { value: 17.85, label: '2' },
    { value: 23.8, label: '3' },
    { value: 29.75, label: '4' },
    { value: 35.7, label: '5' },
    { value: 41.65, label: '6' },
    { value: 47.6, label: '7' },
    { value: 53.55, label: '8' },
    { value: 59.5, label: '9' },
    { value: 65.45, label: '10' },
    { value: 71.4, label: '11' },
    { value: 77.35, label: '12' },
    { value: 83.3, label: '13' },
    { value: 89.25, label: '14' },
    { value: 95.2, label: '15' },
    { value: 101.15, label: '16' },
    { value: 107.1, label: '17' },
    { value: 113.05, label: '18' },
    { value: 119, label: '19' },
    { value: 124.95, label: '20' },
    { value: 130.9, label: '21' },
    { value: 136.85, label: '22' },
    { value: 142.8, label: '23' },
  ];


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
        <div>
        <button onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      </div>
      <div style={{ position: "absolute", bottom: 20, left: 0, width: "100%", padding: "0 20px" }}>
      <Slider aria-label='slider-ex-1' 
        id='slider'
        defaultValue={0}
        min={0}
        max={143}
        value={time}
        onChange={(value) => handleSliderChange(value)}
        >
          {marks.map(({ value, label }) => (
        <SliderMark key={value} value={value} mt='1' ml='-2.5' fontSize='sm'>
          {label}
        </SliderMark>
      ))}
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
    </div>/*
    </>
  );
}
