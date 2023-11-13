import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CenterSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
  MasiveTransportSpan,
} from "./Card";
import { useMemo, useState, useEffect } from "react";
import { CustomMap, INITIAL_STATE } from "./CustomMap.js";
import * as d3 from 'd3';

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

export function TransporteCard({ setOutline, handleSliderChange, time}) {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    // Lógica para cargar el GeoJSON desde un archivo
    fetch("data/TRANSPORTEJEANNETTE.geojson")
      .then(response => response.json())
      .then(data => setOriginalData(data))
      .catch(error => console.error("Error cargando el GeoJSON:", error));
  }, []); // Esto se ejecutará solo una vez al montar el componente


  // Función de transformación y filtrado de datos
  const transformData = (data, time) => {
    const lineStringGenerator = d3.line();
  
    const transformedData = data.features.map((feature) => {
      const horaOri = feature.properties.HoraOri.split(":");
      const horaDest = feature.properties.HoraDest.split(":");
      const horaOriNum = parseInt(horaOri[0], 10) * 60 + parseInt(horaOri[1], 10);
      const horaDestNum = parseInt(horaDest[0], 10) * 60 + parseInt(horaDest[1], 10);
  
      const timeInMinutes = time * 10;
  
      if (
        (horaOriNum <= timeInMinutes && timeInMinutes <= horaDestNum) ||
        (horaOriNum >= timeInMinutes && timeInMinutes >= horaDestNum)
      ) {
        const startCoords = feature.geometry.coordinates[0];
        const endCoords = feature.geometry.coordinates[feature.geometry.coordinates.length - 1];
  
        const numPoints = 100;
        const factor = 0.1;
        const arcPoints = Array.from({ length: numPoints }, (_, i) => {
          const t = i / (numPoints - 1);
          const x = startCoords[0] + t * (endCoords[0] - startCoords[0]);
          const y = startCoords[1] + factor * Math.sin(Math.PI * t);
  
          return [x, y, 0];
        });
  
        const coordinates = arcPoints.map(([lon, lat, altitude]) => [lon, lat, altitude]);
        const lineString = lineStringGenerator(coordinates);
  
        return {
          ...feature,
          geometry: {
            type: 'LineString',
            coordinates,
          },
          lineString,
        };
      } else {
        return null;
      }
    });
  
    const filteredData = transformedData.filter((feature) => feature !== null);
  
    return { ...data, features: filteredData };
  };
  
  // En tu componente TransporteCard
  const primaryRoutesLayer = useMemo(() => {
    // ...
    if (!originalData) {
      return null;
    }
  
    const filteredData = transformData(originalData, time);
  
    return {
      id: "primary_routes",
      data: filteredData,
      getLineColor: [100, 100, 100, 200],
      getLineWidth: 150,
    };
  }, [originalData, time]);
  




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
  return (
    <Card id="transporte" color="orange">
      <ResponseTitle color="orange">Mayormente en automovil.</ResponseTitle>
      <p>
        El <b>45%</b> de los viajes son hechos al trabajo y el <b>47%</b> de los
        viajes son hechos en automóvil, donde más de la mitad viajan solos.
      </p>
      <p>
        El <b>21%</b> se mueve en{" "}
        <MasiveTransportSpan setOutline={setOutline} /> y 19% a pie. 1 de cada 3
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
      <ContextTitle color="orange">
        La expansión urbana aumenta la dependencia del automovil, contribuyendo
        a que el tráfico aumente.
      </ContextTitle>
      <CustomBarChart data={data.sort((a, b) => a.time - b.time).reverse()} />
      <input
        style={{ width: '100%' }}
        type="range"
        min="0"
        max="23" // Ajusta el valor máximo según tus necesidades de tiempo
        step="1" // O ajusta el paso según tus necesidades
        value={time}
        onChange={handleSliderChange} // Envía el evento del cambio del slider al componente App
      />
      <CustomMap
        viewState={viewState}
        setViewState={setViewState}
        //layers={[primaryRoutesLayer]}
        layers={primaryRoutesLayer ? [primaryRoutesLayer] : []}

        handleSliderChange={handleSliderChange} 
        time={time}
      />
    </Card>
  );
}
