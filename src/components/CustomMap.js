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
import {
  GeoJsonLayer,
  ScatterplotLayer,
  TextLayer,
  WebMercatorViewport,
} from "deck.gl";
import { useCardContext } from "../views/Problematica";
import Loading from "./Loading";
import { useCallback, useEffect, useRef, useState } from "react";
import useWindowDimensions, {
  MUNICIPIOS_URL,
  VIAS_URL,
  hexToRgb,
  useFetch,
} from "../utils/constants";
import { mappingNames } from "./Chart";
import { debounce } from "lodash";

mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const DECK_GL_CONTROLLER = {
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};
export const INITIAL_STATE = {
  latitude: 25.68,
  longitude: -100.3,
  zoom: 9.5,
  transitionDuration: 100,
  pitch: 0,
  bearing: 0,
  minZoom: 9,
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
const LONGITUDE_RANGE = [-100.7, -99.9];
const LATITUDE_RANGE = [25.35, 26.01];

export function CustomMap({ viewState, infanciasHover, children, onHover, onDragStart }) {
  const dimensions = useWindowDimensions();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const view = new WebMercatorViewport({
    width: dimensions.width,
    height: dimensions.height,
  });
  const { latitude, longitude, zoom } = view.fitBounds([
    [LONGITUDE_RANGE[0], LATITUDE_RANGE[0]],
    [LONGITUDE_RANGE[1], LATITUDE_RANGE[1]],
  ]);

  const [processedViewState, setProcessedViewState] = useState({
    ...viewState,
    zoom: isMobile ? viewState.zoom * 0.9 : zoom,
  });
  const [hoverCenter, setHoverCenter] = useState(null);
  const infanciasHover2 = useCallback((info, event) => {
    if (!infanciasHover) return;
    infanciasHover(info, event);
  }, []);
  const debouncedInfanciasHover = useCallback(
    debounce(infanciasHover2, 200),
    []
  );

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
        onViewStateChange={({ viewState }) => {
          viewState.longitude = Math.min(
            LONGITUDE_RANGE[1],
            Math.max(LONGITUDE_RANGE[0], viewState.longitude)
          );
          viewState.latitude = Math.min(
            LATITUDE_RANGE[1],
            Math.max(LATITUDE_RANGE[0], viewState.latitude)
          );
          setProcessedViewState(viewState);
        }}
        controller={DECK_GL_CONTROLLER}
        onHover={onHover}
        onDragStart={onDragStart}
      >
        <Map
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/lameouchi/clvboacrd041l01pk9gyf4yve"
          mapboxAccessToken="pk.eyJ1IjoibGFtZW91Y2hpIiwiYSI6ImNsa3ZqdHZtMDBjbTQzcXBpNzRyc2ljNGsifQ.287002jl7xT9SBub-dbBbQ"
        />
        {children}
        <GeoJsonLayer
          id="primary_routes"
          data={VIAS_URL}
          getLineColor={[100, 120, 150, 255]}
          getLineWidth={50}
        />
        <GeoJsonLayer
          id="municipality-layer"
          data={municipalityData.features}
          getFillColor={[128, 174, 0, 0]}
          getLineColor={[100, 100, 100, 250]}
          getLineWidth={40}
        />
        {outline ? (
          <GeoJsonLayer
            {...outline.props}
            getLineWidth={200}
            getLineColor={[...hexToRgb(colorValue), 255]}
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
        {infanciasHover && hoverCenter && (
          <ScatterplotLayer
            id="circle-layer"
            data={[{ position: hoverCenter, size: 1000 }]}
            pickable={true}
            stroked={true}
            filled={true}
            lineWidthMinPixels={1}
            getPosition={hoverCenter}
            getRadius={1100}
            getFillColor={[0, 0, 0, 20]} // Circle color
            getLineWidth={80}
            getLineColor={[80, 80, 80]} // Border color
          />
        )}
      </DeckGL>

      {/* Botones de zoom in y zoom out eliminados y sustituídos por boton de video y al hacer scroll */}

      {/* <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
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
      </div> */}
    </>
  );
}
