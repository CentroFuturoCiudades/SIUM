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
import { 
  CustomLegend,
  CustomLegendMobile,
  LegendItem,
} from "./CustomLegend.js";

export const CostosControls = () => {
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState("obras");
  const [clickedIndex, setClickedIndex] = useState(null);


  const [activeIndex, setActiveIndex] = useState(-1); // State to track the active (hovered) area

  const legendData = [
    { name: "Municipios Periféricos", color: "rgb(153, 4, 253)" },
    { name: "Municipios Centrales", color: "rgb(147, 176, 154)" }
  ];

  const handleMouseEnter = (data, index) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    if (clickedIndex === null) { // Clear hover only if no tooltip is pinned
      setActiveIndex(-1);
    }
  };
  
  const handleClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index); // Toggle pinning of tooltip
  };
  

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

    return chartData;
  };

  const CustomTooltip = ({ active, payload, label, activeIndex }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label" style={{ fontWeight: 'bold', fontSize: '14px' }}>{`Año ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, textDecoration: index === activeIndex ? 'underline' : 'none', opacity: index !== activeIndex ? '0.3' : '1', fontSize: '16px' }}>
              <span style={{ fontWeight: 'bold' }}>{entry.name}</span>: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  

  const municipioColorMap = {
    // blues
    Monterrey: "rgb(147, 176, 154)",
    "San Nicolás de los Garza": "rgb(147, 176, 154)",
    Guadalupe: "rgb(147, 176, 154)",
    "San Pedro Garza García": "rgb(147, 176, 154)",
    "Santa Catarina": "rgb(153, 4, 253)",
    // reds
    Apodaca: "rgb(147, 176, 154)",
    "General Escobedo": "rgb(147, 176, 154)",
    García: "rgb(147, 176, 154)",
    "Cadereyta Jiménez": "rgb(153, 4, 253)",
    Juárez: "rgb(147, 176, 154)",
    "Salinas Victoria": "rgb(153, 4, 253)",
    "General Zuazua": "rgb(153, 4, 253)",
    Pesquería: "rgb(153, 4, 253)",
    Hidalgo: "rgb(153, 4, 253)",
    "Ciénega de Flores": "rgb(153, 4, 253)",
    Abasolo: "rgb(147, 176, 154)",
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
      return `$${value / 1000000000} mil millones`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  }

  return (
    <>
     <CustomLegend
        title={"Costos de expansión"}
        color={color}
        description={"Legend description here"}
      >
        {legendData.map((item, index) => (
          <LegendItem key={index} color={item.color} label={item.name} />
        ))}
      </CustomLegend>
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
      <PopupButton
        videoId="_h7bXZyN2po?si=fhz7F9Wv9jnT-kig"
        title="Ana Fernanda Hierro"
        subtitle="Consejo de Nuevo León."
        text="Eficiencia y aprovechamiento del espacio."
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 100, right: 30, left: 30, bottom: 0 }}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <defs>
            {municipios.map((municipio, index) => (
              <linearGradient key={index} id={`colorU${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getColorForMunicipio(municipio)} stopOpacity={0.8} />
                <stop offset="95%" stopColor={getColorForMunicipio(municipio)} stopOpacity={0.2} />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            dataKey="fecha"
            style={{ fontSize: isMobile ? "12px" : "1dvw" }}
          />
          <YAxis
            tickFormatter={labelMoney}
            style={{ fontSize: isMobile ? "12px" : "1dvw" }}
          />
<Tooltip content={<CustomTooltip activeIndex={activeIndex} />} />




          {/* <Legend wrapperStyle={{ fontSize: isMobile ? "10px" : "1dvw" }} /> */}
          {chartData.length > 0 &&
            municipios.map((municipio, index) => (
              <Area
                key={index}
                type="natural"
                dataKey={municipio}
                stackId="1"
                stroke={getColorForMunicipio(municipio)}
                fill={`url(#colorU${index})`}
                onMouseEnter={() => handleMouseEnter(municipio, index)}
                onMouseLeave={handleMouseLeave}
                strokeOpacity={(index === activeIndex || index === clickedIndex) ? 1 : 0.5}
                fillOpacity={(index === clickedIndex) ? 0.8 : (index === activeIndex ? 0.8 : 0.5)}
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
