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
import { Card, useMediaQuery, Box, Flex, Text } from "@chakra-ui/react";
import PopupButton from "./PopupButton";

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
const municipiosPerifericos = [
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
const municipioColorMap = {
  Monterrey: "rgb(40, 60, 40)",
  "San Pedro Garza García": "rgb(60, 80, 60)",
  "San Nicolás de los Garza": "rgb(80, 100, 80)",
  Guadalupe: "rgb(100, 120, 100)",
  "Santa Catarina": "rgb(120, 140, 120)",
  Apodaca: "rgb(64, 28, 135)",
  "General Escobedo": "rgb(71, 31, 141)",
  García: "rgb(85, 37, 153)",
  Juárez: "rgb(92, 40, 159)",
  Pesquería: "rgb(99, 43, 165)",
  "Cadereyta Jiménez": "rgb(106, 46, 171)",
  "General Zuazua": "rgb(113, 56, 174)",
  "Salinas Victoria": "rgb(120, 66, 170)",
  Hidalgo: "rgb(125, 78, 165)",
  "Ciénega de Flores": "rgb(130, 90, 160)",
};

const CustomLegend = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <Flex mb="2">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Card
          className="legend-color"
          h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          bg="rgb(130, 90, 160)"
          borderRadius="15%"
        />
        <Text
          color="gray.600"
          ml="5px"
          fontSize={isMobile ? "10px" : "min(2dvh, 1dvw)"}
        >
          Municipios Periféricos
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Card
          className="legend-color"
          h={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          w={isMobile ? "10px" : "min(1.6dvh, 0.8dvw)"}
          bg="rgb(120, 140, 120)"
          borderRadius="15%"
        />
        <Text
          color="gray.600"
          ml="5px"
          fontSize={isMobile ? "10px" : "min(2dvh, 1dvw)"}
        >
          Municipios Centrales
        </Text>
      </div>
    </Flex>
  );
};

export const CostosControls = () => {
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState("obras_ajustado");

  const [activeMunicipio, setActiveMunicipio] = useState(); // State to track the active (hovered) area

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

  const CustomTooltip = ({
    active,
    payload,
    label,
    activeIndex: activeMunicipio,
  }) => {
    const { color } = useCardContext();
    const format = (value) =>
      value > 1_000_000_000
        ? (value / 1_000_000_000).toFixed(2) + " mil millones"
        : value > 1_000_000
        ? (value / 1_000_000).toFixed(0) + " millones"
        : value < 1
        ? value.toFixed(2)
        : value.toFixed(0);
    const periferico = municipiosPerifericos.includes(activeMunicipio);
    if (active && payload && payload.length > 0) {
      const reversedPayload = payload
        .filter(
          (entry) =>
            (periferico && municipiosPerifericos.includes(entry.name)) ||
            (!periferico && !municipiosPerifericos.includes(entry.name))
        )
        .reverse();
      return (
        <Box
          className="custom-tooltip"
          borderColor={`${color}.400`}
          borderWidth={0.5}
          borderRadius={5}
          style={{
            backgroundColor: "#fff",
            padding: "10px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: isMobile ? "10px" : "min(2.6dvh, 1.3dvw)",
            }}
          >{`Año ${label}`}</p>
          {reversedPayload.map((entry, index) => (
            <p
              key={index}
              style={{
                color: entry.color,
                textDecoration:
                  entry.name === activeMunicipio ? "underline" : "none",
                opacity: entry.name === activeMunicipio ? "1" : "0.5",
                fontWeight: entry.name === activeMunicipio ? "800" : "500",
                fontSize: isMobile ? "8px" : "min(2.4dvh, 1.2dvw)",
              }}
            >
              <span>{entry.name}</span>: ${format(entry.value)}
            </p>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Esta función busca el color del municipio en el objeto de arriba.
  // Si no encuentra el municipio, devuelve un color predeterminado.
  const getColorForMunicipio = (municipio) => {
    return municipioColorMap[municipio] || "#000000"; // Color negro por defecto
  };
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
          { id: "obras_ajustado", name: "Gasto en obras pública" },
          {
            id: "obras_percapita",
            name: "Gasto en obras pública por persona",
          },
          {
            id: "obras_perarea",
            name: "Gasto en obras pública por área construida",
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
          margin={{
            top: 100,
            right: isMobile ? 5 : 30,
            left: isMobile ? 0 : 30,
            bottom: 0,
          }}
          onMouseLeave={() => setActiveMunicipio(undefined)}
        >
          <defs>
            {municipios.map((municipio, index) => (
              <linearGradient
                key={index}
                id={`colorU${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={getColorForMunicipio(municipio)}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={getColorForMunicipio(municipio)}
                  stopOpacity={0.2}
                />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            dataKey="fecha"
            style={{ fontSize: isMobile ? "10px" : "min(1.8dvh, 0.9dvw)" }}
          />
          <YAxis
            tickFormatter={labelMoney}
            style={{ fontSize: isMobile ? "10px" : "min(1.8dvh, 0.9dvw)" }}
          />
          <Tooltip content={<CustomTooltip activeIndex={activeMunicipio} />} />
          <Legend content={<CustomLegend />} />

          {chartData.length > 0 &&
            municipios.map((municipio, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={municipio}
                stackId="1"
                stroke={getColorForMunicipio(municipio)}
                fill={getColorForMunicipio(municipio)}
                onMouseEnter={() => setActiveMunicipio(municipio)}
                onMouseLeave={() => setActiveMunicipio(undefined)}
                strokeOpacity={municipio === activeMunicipio ? 1 : 0.4}
                fillOpacity={municipio === activeMunicipio ? 1 : 0.6}
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
