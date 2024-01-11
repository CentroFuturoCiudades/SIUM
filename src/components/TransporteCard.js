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
import { useCardContext } from "../views/Problematica.js";
import {
  MASIVE_TRANSPORT_LAYER,
  PRIMARY_ROUTES_LAYER,
} from "../utils/constants.js";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Chart } from "./Chart.js";
import _ from "lodash";
import { Button, ButtonGroup } from '@chakra-ui/react'
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
      defaultValue={1020}
      togglePlay={togglePlay}
      isPlaying={isPlaying}
      handleSliderChange={handleSliderChange}
      marks={marks}
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
  const [generalLayer, setGeneralLayer] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [generalChartData, setGeneralChartData] = useState([]);
  const [activeButton, setActiveButton] = useState('General');
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } =
    TimeComponentClean(300, 1320, 2, 0.05, false, 1020);

  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/transporte_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => {
          setChartData(data);
          setGeneralChartData(data);
        });
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/TRANSPORTEJEANNETTE.geojson"
      )
        .then((response) => response.json())
        .then((data) => {
          setOriginalData(data);
          setGeneralLayer(data);

        })
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setChartData([]);
      setOriginalData(null);
      setLayers([]);
    }
  }, [isCurrentSection]);

  // Manejar clic en el boton para cambiar la información en base al id del botón
  function handleDataChange(event) {
    if(originalData){
      // Obtener el id del botón presionado
      const buttonId = event.target.id;
      setActiveButton(buttonId);
  
      if(buttonId == 'General'){
        setOriginalData(generalLayer);
        setChartData(generalChartData);
      } else {
        let actualLayerData = {...generalLayer};
        let actualChartData = {...generalChartData};
  
        // Filtrar en base al id del botón presionado
        if (buttonId == "transporteActivo"){
          actualLayerData.features = generalLayer.features.filter((feature) => feature.properties.Transporte == "Bicicleta" || feature.properties.Transporte == "Caminando");
          actualChartData = generalChartData.filter((feature) => feature["Transporte"] == "Bicicleta" || feature["Transporte"] == "Caminando");
        } else {
          actualLayerData.features = generalLayer.features.filter((feature) => feature.properties.Transporte == buttonId);
          actualChartData = generalChartData.filter((feature) => feature["Transporte"] == buttonId);
        }
  
        setOriginalData(actualLayerData);
        setChartData(actualChartData)
      }
    }

  }

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
  }, [originalData, time, isPlaying, animationTime]);

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
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          id="General"
          size="sm"
          variant="outline"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'General' ? 'gainsboro' : 'white',
          }}
        >
          General
        </Button>

        <Button
          id="Autómovil"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'Autómovil' ? 'gainsboro' : 'white',
          }}
        >
          Auto
        </Button>

        <Button
          id="TPUB"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'TPUB' ? 'gainsboro' : 'white',
          }}
        >
          Transporte público
        </Button>

        <Button
          id="transporteActivo"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'transporteActivo' ? 'gainsboro' : 'white',
          }}
        >
          Transporte Activo
        </Button>
      </ButtonGroup>

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
