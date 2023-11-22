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
import * as d3 from "d3";
import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useCardContext } from "../views/Body.js";
import { GeoJsonLayer } from "@deck.gl/layers";
import {
  MASIVE_TRANSPORT_LAYER,
  PRIMARY_ROUTES_LAYER,
} from "../utils/constants.js";
import { ArcLayer } from "@deck.gl/layers"; // Agrega esta importación


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

const data = [
  {
    municipality: "Monterrey",
    time: 20,
  },
  {
    municipality: "San Pedro",
    time: 15,
  },
  {
    municipality: "Juárez",
    time: 40,
  },
  {
    municipality: "García",
    time: 50,
  },
];

const marks = [
  { value: 5.95, label: "0" },
  { value: 11.9, label: "1" },
  { value: 17.85, label: "2" },
  { value: 23.8, label: "3" },
  { value: 29.75, label: "4" },
  { value: 35.7, label: "5" },
  { value: 41.65, label: "6" },
  { value: 47.6, label: "7" },
  { value: 53.55, label: "8" },
  { value: 59.5, label: "9" },
  { value: 65.45, label: "10" },
  { value: 71.4, label: "11" },
  { value: 77.35, label: "12" },
  { value: 83.3, label: "13" },
  { value: 89.25, label: "14" },
  { value: 95.2, label: "15" },
  { value: 101.15, label: "16" },
  { value: 107.1, label: "17" },
  { value: 113.05, label: "18" },
  { value: 119, label: "19" },
  { value: 124.95, label: "20" },
  { value: 130.9, label: "21" },
  { value: 136.85, label: "22" },
  { value: 142.8, label: "23" },
];

export const TransporteControls = ({
  time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 20,
      left: 0,
      width: "100%",
      padding: "0 20px",
    }}
  >
    <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    <Slider
      aria-label="slider-ex-1"
      id="slider"
      defaultValue={0}
      min={0}
      max={143}
      value={time}
      onChange={(value) => handleSliderChange(value)}
    >
      {marks.map(({ value, label }) => (
        <SliderMark key={value} value={value} mt="1" ml="-2.5" fontSize="sm">
          {label}
        </SliderMark>
      ))}
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  </div>
);

const transformData = (data, time) => {
  //solo un catch porq en una de mis pruebas me dio error (pero creo que si se quita no pasa nada)
  if (!data || !data.features) {
    return { ...data, features: [] };
  }
  const lineStringGenerator = d3.line();

  const transformedData = data.features.map((feature) => {
    const horaOri = feature.properties.HoraOri.split(":");
    const horaDest = feature.properties.HoraDest.split(":");
    const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
    const horaDestNum =
      parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);

    const timeInMinutes = time * 10;

    //Filtrado del tiempo
    if (
      (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
      (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
    ) {
      const startCoords = feature.geometry.coordinates[0];
      const endCoords =
        feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

      const numPoints = 100;
      const factor = 0.03;
      const arcPoints = Array.from({ length: numPoints }, (_, i) => {
        const t = i / (numPoints - 1);
        const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
        const y = startCoords[1] + factor * Math.sin(Math.PI * t);

        return [x, y, 0]; //puse el 0 de por mientras
      });

      const coordinates = arcPoints.map(([lon, lat, altitude]) => [
        lon,
        lat,
        altitude,
      ]);
      const lineString = lineStringGenerator(coordinates);

      return {
        ...feature,
        geometry: {
          type: "LineString",
          coordinates,
        },
        lineString,
      };
    } else {
      return null;
    }
  });

  const filteredData = transformedData.filter((feature) => feature !== null);

  return { ...data, features: filteredData, transformedData };
};
//---------algo nuevo que quiero intentar con los arcos-------------------
const transformDataForArcsLayer = (data, time) => {
  if (!data || !data.features) {
    return [];
  }

  const arcsData = data.features
    .filter((feature) => {
      const horaOri = feature.properties.HoraOri.split(":");
      const horaDest = feature.properties.HoraDest.split(":");
      const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
      const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);
      const timeInMinutes = time * 10;

      return (
        (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
        (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
      );
    })
    .map((feature) => {
      const startCoords = feature.geometry.coordinates[0];
      const endCoords = feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

      const numPoints = 100;
      const factor = 0.03;
      const arcPoints = Array.from({ length: numPoints }, (_, i) => {
        const t = i / (numPoints - 1);
        const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
        const y = startCoords[1] + factor * Math.sin(Math.PI * t);

        return [x, y, 0]; // Supongamos que la altitud es siempre 0 por ahora
      });

      const coordinates = arcPoints.map(([lon, lat, altitude]) => [
        lon,
        lat,
        altitude,
      ]);

      return {
        sourcePosition: coordinates[0],
        targetPosition: coordinates[coordinates.length - 1],
      };
    });

  return arcsData;
};



//****************AQUI EMPIEZA TRANSPORTE CARD********************************/
export function TransporteCard({ color, isCurrentSection }) {
  const { setLayers, setControlsProps, setOutline } = useCardContext();
  const [time, setTime] = useState(0); //el tiempo que filtra los datos
  const [isPlaying, setIsPlaying] = useState(false); //var de estado para manejar el play de la animacion
  const [animationTime, setAnimationTime] = useState(0); //tiempo cambiante de la animacion
  const [originalData, setOriginalData] = useState([]); //datos filtrados

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
      const togglePlay = () => {
        setIsPlaying(!isPlaying);
        setAnimationTime(time); //inicia la animación desde la posición actual del slider
      };
      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });
      const filteredData = transformData(originalData, time);
      // const arcsLayer = {
      //   type: ArcLayer,
      //   props: {
      //     id: "trips",
      //     data: filteredData, // Usa filteredData en lugar de transformedData
      //     getPath: (d) => d.geometry.coordinates, // Usa las coordenadas directas del GeoJSON
      //     getColor: [100, 100, 100, 200],
      //     getWidth: 150,
      //     currentTime: animationTime, // Pasa el tiempo actual
      //     trailLength: 50, // Longitud de la estela
      //     getTimestamps: (d) => [
      //       convertToMinutes(d.properties.HoraOri),
      //       convertToMinutes(d.properties.HoraDest),
      //     ],
      //     loopLength: 144, // Longitud del bucle en segundos
      //     animationSpeed: 1, // Velocidad de la animación
      //   },
      // };

      const arcsLayer = {
        type: ArcLayer,
        props: {
          id: "trips",
          data: transformDataForArcsLayer(originalData, time),
          getSourcePosition: (d) => d.sourcePosition,
          getTargetPosition: (d) => d.targetPosition,
          getColor: [255, 0, 0, 255],
          getWidth: 3,
          currentTime: animationTime,
          trailLength: 100,
          // Otros props...
        },
      };

      setLayers([
        {
          type: GeoJsonLayer, //aqui puedo cambiar ArcLayer
          props: {
            id: "seccion_transporte_layer",
            data: filteredData, //aqui puedo cambiar a filteredDataForArcLayer
            getLineColor: [150, 0, 0, 80],
            getLineWidth: 150,
          },
        },
        arcsLayer, //y puedo borrar esta
        MASIVE_TRANSPORT_LAYER,
        PRIMARY_ROUTES_LAYER,
      ]);
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

  useEffect(() => {
    let animationFrame;

    const animate = () => {
      setTime((prevTime) => (prevTime + 1) % 144);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    } else {
      cancelAnimationFrame(animationFrame);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  // TODO: Usar chakra para el slider
  const handleSliderChange = (newTime) => {
    //const newTime = event.target.value; //obtiene el valor del tiempo del slider
    console.log("New Time:", newTime); //checar que valor tiene el slider
    setTime(newTime); //actualiza el estado de 'time' con el nuevo valor
    setAnimationTime(newTime);
    setIsPlaying(false); //pausa la animación al cambiar manualmente el slider
  };

  // const convertToMinutes = (timeString) => {
  //   const [hours, minutes] = timeString.split(":").map(Number);
  //   return hours * 60 + minutes;
  // };

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
      <CustomBarChart data={data.sort((a, b) => a.time - b.time).reverse()} />
    </>
  );
}
