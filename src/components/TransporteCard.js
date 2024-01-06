import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { CenterSpan, PeripherySpan, ResponseTitle, ContextTitle } from "./Card";
import { useState, useEffect } from "react";
import { useCardContext } from "../views/Body.js";
import {
  MASIVE_TRANSPORT_LAYER,
  PRIMARY_ROUTES_LAYER,
} from "../utils/constants.js";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Chart } from "./Chart.js";
import _ from "lodash";
import { SliderHTML, TimeComponentClean } from "./TimeComponent.js";

export const CustomBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={150}>
    <BarChart layout="vertical" data={data}>
      <XAxis
        tickFormatter={(d) => `${d} min`}
        type="number"
        dataKey="time"
        style={{ fontSize: "0.8rem" }}
      />
      <YAxis type="category" dataKey="municipality" hide />
      <Bar background dataKey="time" fill="orange" barSize={30}>
        <LabelList
          dataKey="municipality"
          position="insideRight"
          style={{ fill: "white" }}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

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

export const TransporteControls = ({
  time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  return (
    <SliderHTML
      time={time}
      min={300}
      max={1320}
      step={3}
      //title={"Precio de Venta"}
      togglePlay={togglePlay}
      isPlaying={isPlaying}
      handleSliderChange={handleSliderChange}
      marks={marks}
      //legendItems={legendItems}
    />
  );
};

function convertirHoraATimestamp(horaString) {
  const [hora, minutos] = horaString.split(":");
  const timestamp = parseInt(hora) * 60 + parseInt(minutos); // Convierte la hora a minutos
  return timestamp;
}

const transformDataForTrips = (data) => {
  if (!data || !data.features) {
    return [];
  }

  //lo que hace esto ahorita es que me da todos los trips desde el inicio
  const tripsData = data.features.map((feature) => {
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

export function TransporteCard({ color, isCurrentSection }) {
  const { setLayers, setControlsProps, setOutline } = useCardContext();
  const [originalData, setOriginalData] = useState([]); 
  const [chartData, setChartData] = useState([]);
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponentClean(0, 1440, 2, true);


  useEffect(() => {
    if (isCurrentSection) {
      fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          const newData = data.filter((x) => x["Transporte"] === "TPUB" && x["Motivo"] === "Regreso A Casa");
          setChartData(newData);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/TRANSPORTEJEANNETTE.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  useEffect(() => {

    if (isCurrentSection && originalData) {

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });

      const tripsLayer = {
        type: TripsLayer,
        props: {
          id: "trips",
          data: transformDataForTrips(originalData),
          getPath: (d) => d.waypoints.map((point) => point.coordinates),
          getTimestamps: (d) => d.waypoints.map((point) => point.timestamp),
          getColor: [255, 0, 0, 255],
          opacity: 0.5,
          widthMinPixels: 3,
          rounded: true,
          trailLength: 10,
          currentTime: time,
        },
      };

      setLayers([MASIVE_TRANSPORT_LAYER, PRIMARY_ROUTES_LAYER, tripsLayer]);
    }
  }, [
    isCurrentSection,
    originalData,
    setLayers,
    setControlsProps,
    isPlaying,
    time,
    animationTime,
  ]);

  return (
    <>
      <ResponseTitle color={color}>Mayormente en automovil.</ResponseTitle>
      <p>
        El <b>45%</b> de los viajes son hechos al trabajo y el <b>47%</b> de los
        viajes son hechos en automóvil, donde más de la mitad viajan solos.
      </p>
      <p>
        El <b>21%</b> se mueve en transporte público y 19% a pie. 1 de cada 3
        personas pasan 3 horas al día en ir y venir de su viaje principal en
        transporte público. En promedio se espera 21 minutos a que llegue el
        transporte público.
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
        La expansión urbana aumenta la dependencia del automovil, contribuyendo
        a que el tráfico aumente.
      </ContextTitle>
      <Chart
        title="Tiempo de traslado regreso a casa"
        data={chartData}
        setOutline={setOutline}
        column="TiempoTraslado"
        columnKey="MunDest"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")} min`}
        reducer={_.meanBy}
      />
    </>
  );
}
