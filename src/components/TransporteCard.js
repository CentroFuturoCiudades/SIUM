import { ResponseTitle, ContextTitle } from "./Card";
import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica.js";
import {
  TRANSPORTE_CHART_URL,
  TRANSPORTE_MASIVO_URL,
  TRANSPORTE_URL,
  VIAS_URL,
  VIAS_CICLISTAS_URL,
  sectionsInfo,
  useFetch,
} from "../utils/constants.js";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Chart } from "./Chart.js";
import _ from "lodash";
import { SliderHTML, TimeComponentClean } from "./TimeComponent.js";
import { CustomMap, INITIAL_STATE } from "./CustomMap.js";
import Loading from "./Loading.js";
import { GeoJsonLayer } from "deck.gl";
import ButtonControls from "./ButtonControls.js";
import PopupButton from "./PopupButton";
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tooltip,
  Tr,
  useToken,
  useMediaQuery,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { CustomLegend, LegendItem } from "./CustomLegend.js";

const TimeComp = ({ hour }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const isPm = hour >= 12;
  const newHour = hour > 12 ? hour - 12 : hour;
  return (
    <span>
      {newHour} {isMobile && <br />}
      {isPm ? "p.m." : "a.m."}
    </span>
  );
};

const marks = Array.from({ length: 9 }, (_, i) => ({
  value: (i * 2 + 5) * 60,
  label: <TimeComp hour={i * 2 + 5} />,
}));

const labelsMapping = [
  { id: "General", name: "General" },
  { id: "Autómovil", name: "Auto" },
  { id: "TPUB", name: "Transporte público" },
  { id: "transporteActivo", name: "Transporte Activo" },
];

function convertirHoraATimestamp(horaString) {
  const [hora, minutos] = horaString.split(":");
  const timestamp = parseInt(hora) * 60 + parseInt(minutos); // Convierte la hora a minutos
  return timestamp;
}

const transformDataForTrips = (data) => {
  if (!data) {
    return [];
  }

  //lo que hace esto ahorita es que me da todos los trips desde el inicio
  const tripsData = data.map((feature) => {
    //para cada feature del gepjson (osea para cada viaje)
    const coordinates = feature.geometry.coordinates; //guarda las coordinates
    const startTimestamp = convertirHoraATimestamp(feature.properties.HoraOri); //agarra el timestamp de inicio

    const waypoints = coordinates.map((coord, index) => ({
      coordinates: coord.slice(0, 2),
      timestamp: startTimestamp + index * 60, // Cambiado a 60 para un intervalo de un minuto
    }));

    return { waypoints };
  });

  return tripsData;
};

const filtering = (x, activeButton) =>
  (activeButton === "General" && (x === "TPUB" || x === "Autómovil")) ||
  x === activeButton ||
  ((x === "Bicicleta" || x === "Caminando") &&
    activeButton === "transporteActivo");

export const TransporteControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.600`]);
  const endColor = "#6a2eab";
  const { data } = useFetch(TRANSPORTE_URL);
  const [activeButton, setActiveButton] = useState("General");
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(300, 1320, 0.005, 0.1, true, 0, true);
  const currentTransporte = labelsMapping.find(
    (x) => x.id == activeButton
  )?.name;

  useEffect(() => {
    setSharedProps({ activeButton });
  }, [activeButton]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={INITIAL_STATE}>
        <GeoJsonLayer
          id="masive-transport-layer"
          data={TRANSPORTE_MASIVO_URL}
          stroked={true}
          filled={true}
          lineWidthScale={10}
          lineWidthMinPixels={2}
          getLineWidth={10}
          getLineColor={(feature) => {
            const nombrePropiedad = feature.properties.NOMBRE;
            const colorMapping = {
              // Change color based on type of transport
              ECOVIA: [255, 56, 100], // Rojo
              "Linea 1 - Metro": [255, 56, 100],
              "Linea 2 - Metro": [255, 56, 100],
              "Linea 3 - Metro": [255, 56, 100],
              Transmetro: [255, 56, 100],
            };
            return colorMapping[nombrePropiedad] || [64, 224, 208, 128];
          }}
        />
        <GeoJsonLayer
          id="ciclist-routes"
          data={VIAS_CICLISTAS_URL}
          stroked={true}
          filled={true}
          lineWidthScale={10}
          lineWidthMinPixels={2}
          getLineWidth={10}
          getLineColor={[16, 37, 66]}
        />
        <TripsLayer
          id="transporte_layer"
          data={transformDataForTrips(
            data.features.filter((d) =>
              filtering(d.properties.Transporte, activeButton)
            )
          )}
          getPath={(d) => d.waypoints.map((point) => point.coordinates)}
          getTimestamps={(d) => d.waypoints.map((point) => point.timestamp)}
          getColor={(d, i) => {
            const item = data.features[i.index].properties;
            const isTrabajo =
              item.Motivo == "Regreso A Casa" || item.Motivo == "Trabajo";
            return isTrabajo ? [106, 46, 171] : [126, 96, 62];
          }}
          opacity={0.5}
          widthMinPixels={2}
          trailLength={10}
          currentTime={time}
        />
        <PopupButton
          videoId="2eRmyQBQ5aA"
          title="Luisa Pérez Barbosa"
          subtitle="Movimiento Activación Ciudadana (MOVAC)."
          text="Cultura vial más allá de la infraestructura."
          onClick={() => isPlaying && togglePlay()}
        />
      </CustomMap>
      <CustomLegend
        color={color}
        title={`Traslados en ${currentTransporte} por motivo de viaje`}
        description={
          <>
            <b>
              Encuesta origen destino del Programa Integral de Movilidad Urbana
              Sustentable (PIMUS) 2019
            </b>
          </>
        }
        note={"*Transporte activo considera: movilidad ciclista y peatonal"}
      >
        <LegendItem color={endColor} label="Trabajo y Regreso a Casa" />
        <LegendItem color={startColor} label="Otros motivos" />
        <LegendItem color="#FF3864" label="Metro" />
        <LegendItem color="#102542" label="Ciclovias" />
      </CustomLegend>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={labelsMapping}
        onClick={() => isPlaying && togglePlay()}
      />
      <SliderHTML
        time={time}
        min={300}
        max={1320}
        step={3}
        defaultValue={1020}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        handleSliderChange={handleSliderChange}
        marks={marks}
      />
    </>
  );
};

export function TransporteCard() {
  const { color, currentSection, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(TRANSPORTE_CHART_URL, []);
  const filteredChartData = chartData.filter(
    (x) => x["Motivo"] === "Regreso A Casa"
  );
  const currentTransporte = labelsMapping.find(
    (x) => x.id == sharedProps.activeButton
  )?.name;

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        <b>El 45% de los desplazamientos</b> en Monterrey son viajes al trabajo,
        casi la mitad de ellos en automóvil y con la particularidad, de que la
        mitad se hace con una sola persona. Los residentes invierten en promedio
        50 minutos por viaje redondo en auto, equivalente a doce días al año.
        Por su parte, el transporte público requiere mejoras: las personas pasan
        en promedio 70 minutos al día en él, con un tercio de ellas
        experimentando viajes de 3 horas diarias.
      </p>
      <p>
        Además, <b>el 40% de los traslados vienen de la periferia</b>, como
        Apodaca, Escobedo, García y Juárez; mientras que el 26% se dirige a
        Monterrey. Es esencial expandir el acceso al transporte público y
        mejorar la infraestructura, puesto que tan solo el 21% lo utiliza (otro
        19% se traslada caminando). Solo así se podrá contrarrestar el impacto
        negativo en la salud pública y en el medio ambiente que genera el
        elevado número de viajes en automóvil.
      </p>

      <ContextTitle color={color}>
        Los Sistemas Integrados de Transporte brindan una ciudad conectada,
        ordenada, de calidad, rápida y segura. Además son clave para la
        seguridad de las personas que necesitan realizar viajes intermodales.
      </ContextTitle>
      <Chart
        title={`Tiempo de traslado regreso a casa en ${currentTransporte?.toLocaleLowerCase()}`}
        data={filteredChartData}
        column="TiempoTraslado"
        columnKey="MunDest"
        domain={[10, 100]}
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")} min`}
        reducer={_.meanBy}
        filtering={(x) => filtering(x.Transporte, sharedProps.activeButton)}
      />
    </>
  );
}
