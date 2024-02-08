import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    // Inicializa un objeto para mantener la suma de obras por año para cada municipio
    const obrasPorAnoYMunicipio = {};
  
    data.forEach(item => {
      const año = item.fecha;
      const municipio = item.nom_mun;
      const obras = item.obras;
  
      if (!obrasPorAnoYMunicipio[año]) {
        obrasPorAnoYMunicipio[año] = {};
      }
      
      if (!obrasPorAnoYMunicipio[año][municipio]) {
        obrasPorAnoYMunicipio[año][municipio] = 0;
      }
  
      obrasPorAnoYMunicipio[año][municipio] += obras;
    });
  
    // Transforma el objeto en un array de datos para Recharts
    const chartData = Object.keys(obrasPorAnoYMunicipio).map(fecha => {
      const dataForYear = { fecha };
      Object.keys(obrasPorAnoYMunicipio[fecha]).forEach(municipio => {
        dataForYear[municipio] = obrasPorAnoYMunicipio[fecha][municipio];
      });
      return dataForYear;
    });
    console.log(chartData)

    return chartData;
  };

  const municipioColorMap = {
    "Abasolo": "#FF6633",
    "Apodaca": "#FFB399",
    "Cadereyta Jiménez": "#FF33FF",
    "Ciénega de Flores": "#FFFF99",
    "García": "#00B3E6",
    "General Escobedo": "#E6B333",
    "General Zuazua": "#3366E6",
    "Guadalupe": "#999966",
    "Hidalgo": "#99FF99",
    "Juárez": "#B34D4D",
    "Monterrey": "#80B300",
    "Pesquería": "#809900",
    "Salinas Victoria": "#E6B3B3",
    "San Nicolás de los Garza": "#6680B3",
    "San Pedro Garza García": "#66991A",
    "Santa Catarina": "#FF99E6",
  };
  
  // Esta función busca el color del municipio en el objeto de arriba.
  // Si no encuentra el municipio, devuelve un color predeterminado.
  const getColorForMunicipio = (municipio) => {
    return municipioColorMap[municipio] || "#000000"; // Color negro por defecto
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 55, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          {
            chartData.length > 0 &&
            Object.keys(chartData[0]).filter(key => key !== 'fecha').map((municipio, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={municipio}
                stackId="1"
                stroke={getColorForMunicipio(municipio)} // Necesitarás crear una función que asigne un color a cada municipio
                fill={getColorForMunicipio(municipio)} // o que los mapee de alguna manera para que sean consistentes
              />
            ))
          }
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