import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { COSTOS_LAYER } from "../utils/constants";
import { useCardContext } from "../views/Problematica";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const CostosControls = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/costos_municipality.json")
      .then(response => response.json())
      .then(data => {
        setChartData(processData(data));
      })
      .catch(error => console.error("Error al cargar datos para el gráfico:", error));
  }, []);

const processData = (data) => {
  // Creamos un objeto para sumar las obras por año
  const obrasPorAno = {};

  data.forEach(item => {
    if (!obrasPorAno[item.fecha]) {
      obrasPorAno[item.fecha] = 0;
    }
    obrasPorAno[item.fecha] += item.obras;
  });

  // Convertimos el objeto en un array para Recharts
  return Object.keys(obrasPorAno).map(fecha => ({
    fecha: fecha,
    obras: obrasPorAno[fecha]
  }));
};

  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="obras" stackId="1" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
  );
};


export function CostosCard({ color, isCurrentSection }) {
 

  return (
    <>
      <ResponseTitle color={color}>
        Hay que llevar servicios públicos más lejos
      </ResponseTitle>
      <p>
        Incidencias delictivas como el robos en calles o a viviendas, así como
        violencia familiar se concentran en regiones segregadas.
      </p>
      <p>
        Estar alejado de actividades económicas como el comercio al por mayor
        aumentan la incidencia delictiva, mientras que estar cercano a centros
        con comercio al por menor la disminuyen.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La malas condiciones de vida en zonas marginadas contribuyen a la falta
        de oportunidades y a la delincuencia.
      </ContextTitle>
    </>
  );
}
