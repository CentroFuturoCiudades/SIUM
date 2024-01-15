import { CenterSpan, PeripherySpan, ResponseTitle, ContextTitle } from "./Card";
import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica.js";
import { useFetch } from "../utils/constants.js";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Chart } from "./Chart.js";
import _ from "lodash";
import { SliderHTML, TimeComponentClean } from "./TimeComponent.js";
import { CustomMap, INITIAL_STATE } from "./CustomMap.js";
import Loading from "./Loading.js";
import { GeoJsonLayer } from "deck.gl";
import ButtonControls from "./ButtonControls.js";

const marks = [
  { value: 300, label: "5:00" },
  { value: 360, label: "6:00" },
  { value: 420, label: "7:00" },
  { value: 480, label: "8:00" },
  { value: 540, label: "9:00" },
  { value: 600, label: "10:00" },
  { value: 660, label: "11:00" },
  { value: 720, label: "12:00" },
  { value: 780, label: "13:00" },
  { value: 840, label: "14:00" },
  { value: 900, label: "15:00" },
  { value: 960, label: "16:00" },
  { value: 1020, label: "17:00" },
  { value: 1080, label: "18:00" },
  { value: 1140, label: "19:00" },
  { value: 1200, label: "20:00" },
  { value: 1260, label: "21:00" },
  { value: 1320, label: "22:00" },
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
      coordinates: coord.slice(0, 3),
      timestamp: startTimestamp + index * 60, // Cambiado a 60 para un intervalo de un minuto
    }));

    return { waypoints };
  });

  return tripsData;
};

const filtering = (x, activeButton) =>
  activeButton === "General" ||
  x === activeButton ||
  ((x === "Bicicleta" || x === "Caminando") &&
    activeButton === "transporteActivo");

const TRANSPORTE_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte_municipality.json";
const TRANSPORTE_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/TRANSPORTEJEANNETTE.geojson";
const TRANSPORTE_MASIVO_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte-masivo.geojson";
const VIAS_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vias-primarias.geojson";

export const TransporteControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(TRANSPORTE_URL);
  const [activeButton, setActiveButton] = useState("General");
  const { time, isPlaying, handleSliderChange, togglePlay } =
    TimeComponentClean(300, 1320, 0.005, 0.1, true, 1020);

  useEffect(() => {
    setSharedProps({ activeButton });
  }, [activeButton]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
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
              ECOVIA: [0, 200, 0, 255], // Rojo
              "Linea 1 - Metro": [0, 200, 0, 255],
              "Linea 2 - Metro": [0, 200, 0, 255],
              "Linea 3 - Metro": [0, 200, 0, 255],
              Transmetro: [0, 200, 0, 255],
            };
            return colorMapping[nombrePropiedad] || [64, 224, 208, 128];
          }}
        />
        <GeoJsonLayer
          id="primary_routes"
          data={VIAS_URL}
          getLineColor={[180, 180, 180, 255]}
          getLineWidth={50}
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
          getColor={[255, 0, 0, 255]}
          opacity={0.5}
          widthMinPixels={3}
          rounded={true}
          trailLength={10}
          currentTime={time}
        />
      </CustomMap>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={[
          { id: "General", name: "General" },
          { id: "Autómovil", name: "Auto" },
          { id: "TPUB", name: "Transporte público" },
          { id: "transporteActivo", name: "Transporte Activo" },
        ]}
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
  const { color, setOutline, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(TRANSPORTE_CHART_URL, []);
  const filteredChartData = chartData.filter(
    (x) => x["Motivo"] === "Regreso A Casa"
  );

  return (
    <>
      <ResponseTitle color={color}>
        Demasiados de nosotros en auto
      </ResponseTitle>
      <p>
        <b>El 45% de los desplazamientos</b> en Monterrey corresponde a viajes
        al trabajo, siendo casi la mitad de ellos realizados en automóvil, con
        la particularidad de que la mitad se efectúan con solo una persona en el
        vehículo. Los habitantes de la Zona Metropolitana{" "}
        <b>
          invierten en promedio 50 minutos por viaje redondo en automóvil,
          equivalente a doce días al año.
        </b>{" "}
        Aunque el transporte público juega un papel fundamental, requiere
        mejoras, ya que las personas pasan en promedio 70 minutos al día
        utilizando este medio, y un tercio de ellas enfrenta jornadas de hasta 3
        horas diarias de viaje.
      </p>
      <p>
        <b>Cerca del 40% de los traslados provienen de la periferia</b>, como
        Apodaca, Escobedo, García y Juárez, mientras que el 26% se dirige a
        Monterrey. Sorprendentemente, solo el 21% de la población utiliza
        transporte público y 19% a pie. En este contexto, es esencial expandir
        el acceso al transporte público y mejorar la infraestructura para
        ciclistas y peatones, con un <b>Sistema Integrado de Transporte</b>,
        para contrarrestar el impacto negativo ambiental y en la salud pública
        generado por el elevado número de viajes en automóvil particular.
      </p>
      <p>
        Alrededor del <b>40%</b> de los traslados se hacen desde la{" "}
        <PeripherySpan setOutline={setOutline} /> como Apodaca, Escobedo, García
        y Juárez, y el <b>26%</b> se traslada al{" "}
        <CenterSpan setOutline={setOutline} />. En promedio se invierten{" "}
        <b>68 minutos</b> por viaje redondo, el equivalente a doce días por año.
      </p>

      <br />
      <ContextTitle color={color}>
        Los SITP's ofrecen como beneficios una ciudad conectada y ordenada,
        servicios de mayor calidad, un sistema único de información y atención,
        menor tiempo de viaje, mayor seguridad personal y vial, tarifas de
        acuerdo al tipo de viaje y condición social, mayor accesibilidad al
        transporte público y conectividad con todas las zonas de la ciudad y
        grupos poblacionales." Comisión Ambiental de la Megalópolis
      </ContextTitle>
      <Chart
        title={`Tiempo de traslado regreso a casa en ${sharedProps.activeButton}`}
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
