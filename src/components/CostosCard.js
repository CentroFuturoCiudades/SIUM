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
import { sectionsInfo } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/react";
import PopupButton from "./PopupButton";

export const CostosControls = () => {
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState("obras_ajustado");

  useEffect(() => {
    fetch(
      "https://sium.blob.core.windows.net/sium/datos/costos_municipality.json"
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

    return chartData;
  };

  const municipioColorMap = {
    Monterrey: "rgb(40, 60, 40)", // Lighter
    "San Pedro Garza García": "rgb(60, 90, 60)",
    "San Nicolás de los Garza": "rgb(90, 110, 90)", // Midpoint
    Guadalupe: "rgb(120, 140, 120)",
    "Santa Catarina": "rgb(140, 140, 140)", // Darker
    Apodaca: "rgb(130, 90, 160)", // Starting with a more pronounced purple-greenish
    "General Escobedo": "rgb(125, 78, 165)",
    García: "rgb(120, 66, 170)",
    Juárez: "rgb(113, 56, 174)", // Closer to midpoint
    Pesquería: "rgb(106, 46, 171)", // Midpoint purple
    "Cadereyta Jiménez": "rgb(99, 43, 165)",
    "General Zuazua": "rgb(92, 40, 159)",
    "Salinas Victoria": "rgb(85, 37, 153)",
    Hidalgo: "rgb(71, 31, 141)",
    "Ciénega de Flores": "rgb(64, 28, 135)",
  };

  // Esta función busca el color del municipio en el objeto de arriba.
  // Si no encuentra el municipio, devuelve un color predeterminado.
  const getColorForMunicipio = (municipio) => {
    return municipioColorMap[municipio] || "#000000"; // Color negro por defecto
  };
  const municipios = [
    "Monterrey",
    "San Pedro Garza García",
    "San Nicolás de los Garza",
    "Guadalupe",
    "Santa Catarina",
    "Apodaca",
    "General Escobedo",
    "García",
    "Juárez",
    "Pesquería",
    "Cadereyta Jiménez",
    "General Zuazua",
    "Salinas Victoria",
    "Hidalgo",
    "Ciénega de Flores",
  ];
  function labelMoney(value) {
    if (value > 1000000000) {
      return `$${value / 1000000000} mil millones`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  }

  return (
    <>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={[
          { id: "obras_ajustado", name: "Gastos en obras publicas" },
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
      <PopupButton
        videoId="_h7bXZyN2po"
        title="Ana Fernanda Hierro"
        subtitle="Consejo Nuevo León para la Planeación Estratégica, Secretaría Técnica."
        text="Eficiencia y aprovechamiento del espacio."
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 100, right: 30, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            style={{ fontSize: isMobile ? "12px" : "min(1.8dvh, 0.9dvw)" }}
          />
          <YAxis
            tickFormatter={labelMoney}
            style={{ fontSize: isMobile ? "12px" : "min(1.4dvh, 0.7dvw)" }}
          />
          <Tooltip
            itemSorter={(item) => -item.value}
            formatter={(value) =>
              `$${
                value > 1_000_000_000
                  ? (value / 1_000_000_000).toFixed(2) + " mil millones"
                  : value > 1_000_000
                  ? (value / 1_000_000).toFixed(0) + " millones"
                  : value < 1
                  ? value.toFixed(2)
                  : value.toFixed(0)
              }`
            }
            labelFormatter={(value) => `Año ${value}`}
            itemStyle={{ fontSize: isMobile ? "10px" : "min(2dvh, 1dvw)" }}
            labelStyle={{
              fontSize: isMobile ? "12px" : "min(2.4dvh, 1.2dvw)",
              fontWeight: "bold",
            }}
          />

          <Legend
            wrapperStyle={{ fontSize: isMobile ? "10px" : "min(2dvh, 1dvw)" }}
          />
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

export function CostosCard() {
  const { color, currentSection } = useCardContext();
  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        La expansión urbana no solo tiene altos costos sociales y ambientales,
        implica un gasto público mayor, en comparación con modelos de ciudades
        compactas. En 1995, se gastaban alrededor de tres mil millones en obras
        públicas de infraestructura para llevar servicios a las zonas urbanas.
        En 2020 se gastaron casi treinta y seis mil millones, un aumento del
        1,200%.
      </p>
      <p>
        Aún con este aumento no ha sido suficiente, ya que el gasto per cápita
        ha disminuido en un 88% en el mismo periodo. Los municipios ahora gastan
        más por metro cuadrado de la mancha urbana: pasando de $223/m2 en 1990 a
        $2,000/m2 en 2020.
      </p>
      <ContextTitle color={color}>
        Intensificar el uso del suelo urbano existente y mejorar las políticas
        regulatorias contra la expansión, mitigarían el gasto público excesivo
        en servicios urbanos e infraestructura.
      </ContextTitle>
    </>
  );
}
