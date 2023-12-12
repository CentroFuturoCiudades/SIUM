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
import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useCardContext } from "../views/Body.js";
import {
  MASIVE_TRANSPORT_LAYER,
  PRIMARY_ROUTES_LAYER,
} from "../utils/constants.js";
import { TripsLayer } from "@deck.gl/geo-layers";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { Chart } from "./Chart.js";
import _ from "lodash";
import { TimeComponent } from "./TimeComponent.js";

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
  { value: 0, label: "0:00" },
  { value: 60, label: "1:00" },
  { value: 120, label: "2:00" },
  { value: 180, label: "3:00" },
  { value: 240, label: "4:00" },
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
  { value: 1380, label: "23:00" },
  { value: 1440, label: "24:00" },
];

export const TransporteControls = ({
  time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: 0,
          width: "100%",
          padding: "0 20px",
        }}
      >
        <Box
          bgColor="orange.100"
          borderRadius="16px"
          borderWidth={1}
          borderColor="orange.200"
          style={{ display: "flex", width: "100%" }}
        >
          <IconButton
            colorScheme="orange"
            isRound={true}
            onClick={togglePlay}
            size="xs"
            icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
          />
          <Slider
            aria-label="slider-ex-1"
            id="slider"
            defaultValue={0}
            min={0}
            step={30}
            max={1440}
            value={time}
            onChange={(value) => handleSliderChange(value)}
            mr="4"
            ml="3"
          >
            {marks.map(({ value, label }) => (
              <SliderMark
                key={value}
                value={value}
                textAlign="center"
                mt="5"
                ml="-3"
                fontSize="xs"
              >
                {label}
              </SliderMark>
            ))}
            <SliderTrack bg="orange.200">
              <SliderFilledTrack bg="orange.500" />
            </SliderTrack>
            <SliderThumb boxSize={3} bgColor="orange.600" />
          </Slider>
        </Box>
      </div>
    </>
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
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponent(0, 1440, 2);


  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/transporte_municipality.json")
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
      fetch("SIUM/data/TRANSPORTEJEANNETTE.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    //para la animacion
    if (isCurrentSection && originalData) {
      /*const togglePlay = () => {
        setIsPlaying(!isPlaying);
        setAnimationTime(time); //inicia la animación desde la posición actual del slider
      };*/
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

  /*useEffect(() => {
    let animationFrame;

    const animate = () => {
      setTime((prevTime) => (prevTime + 2) % 1440);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    } else {
      cancelAnimationFrame(animationFrame);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const handleSliderChange = (newTime) => {
    console.log("New Time:", newTime); //checar que valor tiene el slider
    setTime(newTime); //actualiza el estado de 'time' con el nuevo valor
    setAnimationTime(newTime);
  };*/

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
        data={chartData}
        setOutline={setOutline}
        column="TiempoTraslado"
        columnKey="MunDest"
        formatter={(d) => `${d.toLocaleString("en-US")} min`}
        reducer={_.meanBy}
      />
    </>
  );
}
