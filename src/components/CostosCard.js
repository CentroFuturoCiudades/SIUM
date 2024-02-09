import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ButtonControls from "./ButtonControls";
import { useCardContext } from "../views/Problematica";

export const CostosControls = () => {
  const { color } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState("obras");

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/costos_municipality.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setChartData(processData(data));
      })
      .catch((error) =>
        console.error("Error al cargar datos para el gráfico:", error)
      );
  }, [activeButton]);

  const processData = (data) => {
    // Inicializa un objeto para mantener la suma de obras por año para cada municipio
    const obrasPorAnoYMunicipio = {};

    data.forEach((item) => {
      const año = item.fecha;
      const municipio = item.nom_mun;
      const obras = item[activeButton];

      if (!obrasPorAnoYMunicipio[año]) {
        obrasPorAnoYMunicipio[año] = {};
      }

      if (!obrasPorAnoYMunicipio[año][municipio]) {
        obrasPorAnoYMunicipio[año][municipio] = 0;
      }

      obrasPorAnoYMunicipio[año][municipio] += obras;
    });

    // Transforma el objeto en un array de datos para Recharts
    const chartData = Object.keys(obrasPorAnoYMunicipio).map((fecha) => {
      const dataForYear = { fecha };
      Object.keys(obrasPorAnoYMunicipio[fecha]).forEach((municipio) => {
        dataForYear[municipio] = obrasPorAnoYMunicipio[fecha][municipio];
      });
      return dataForYear;
    });
    console.log(chartData);

    return chartData;
  };

  const municipioColorMap = {
    // blues
    Monterrey: "rgb(0, 0, 250)",
    "San Nicolás de los Garza": "rgb(40, 20, 210)",
    Guadalupe: "rgb(60, 30, 190)",
    "San Pedro Garza García": "rgb(20, 10, 230)",
    "Santa Catarina": "rgb(80, 40, 210)",
    // reds
    Apodaca: "rgb(250, 0, 0)",
    "General Escobedo": "rgb(230, 10, 20)",
    García: "rgb(210, 20, 40)",
    "Cadereyta Jiménez": "rgb(190, 30, 60)",
    Juárez: "rgb(210, 40, 80)",
    "Salinas Victoria": "rgb(230, 50, 100)",
    "General Zuazua": "rgb(250, 60, 120)",
    Pesquería: "rgb(250, 70, 140)",
    Hidalgo: "rgb(250, 80, 160)",
    "Ciénega de Flores": "rgb(250, 90, 180)",
    Abasolo: "rgb(250, 100, 200)",
  };

  // Esta función busca el color del municipio en el objeto de arriba.
  // Si no encuentra el municipio, devuelve un color predeterminado.
  const getColorForMunicipio = (municipio) => {
    return municipioColorMap[municipio] || "#000000"; // Color negro por defecto
  };
  const municipios = [
    "Monterrey",
    "San Nicolás de los Garza",
    "Guadalupe",
    "San Pedro Garza García",
    "Santa Catarina",
    "Apodaca",
    "General Escobedo",
    "García",
    "Cadereyta Jiménez",
    "Juárez",
    "Salinas Victoria",
    "General Zuazua",
    "Pesquería",
    "Hidalgo",
    "Ciénega de Flores",
    "Abasolo",
  ];
  function labelMoney(value) {
    if (value > 1000000000) {
      return `$${value / 1000000000} mil millones`
    } else {
      return `$${value.toLocaleString()}`
    }
  }

  return (
    <>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={[
          { id: "obras", name: "Gastos en obras publicas" },
          {
            id: "obras_percapita",
            name: "Gastos en obras publicas por persona",
          },
          {
            id: "obras_perarea",
            name: "Gastos en obras publicas por área construida",
          },
        ]}
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 100, right: 30, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" style={{ fontSize: "1dvw" }} />
          <YAxis
            tickFormatter={labelMoney}
            style={{ fontSize: "1dvw" }}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />

          <Legend />
          {chartData.length > 0 &&
            municipios.map((municipio, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={municipio}
                stackId="1"
                stroke={getColorForMunicipio(municipio)} // Necesitarás crear una función que asigne un color a cada municipio
                fill={getColorForMunicipio(municipio)} // o que los mapee de alguna manera para que sean consistentes
              />
            ))}
        </AreaChart>
      </ResponsiveContainer>
    </>
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
