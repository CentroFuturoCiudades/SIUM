import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  hexToRgb,
  sectionsInfo,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { AreaChartChart } from "./AreaChart";
import { 
  CustomLegend,
  CustomLegendMobile,
  LegendItem,
} from "./CustomLegend.js";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls.js";
import { Area, XAxis, YAxis } from "recharts";
import { useToken } from "@chakra-ui/react";
import PopupButton from "./PopupButton";

const EXPANSION_ACTUAL_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/mancha_urbana_2020.geojson";
const ESCENARIOS_FUTUROS_ACELERADA_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/escenario_acelerado.geojson"; // Acelerado
const ESCENARIOS_FUTUROS_INERCIAL_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/escenario_inercial.geojson"; // Inercial
const ESCENARIOS_FUTUROS_CONTROLADA_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/escenario_controlado.geojson"; // Controlado

const ESCENARIOS_FUTUROS_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/escenarios.json"; // Chart

const ISLAS_CALOR_LEGEND_DATA = [
  "Muy frío",
  "Frío",
  "Ligeramente frío",
  "Templado",
  "Ligeramente cálido",
  "Caliente",
  "Muy caliente",
];

export const EscenariosFuturosControls = () => {
  const { color } = useCardContext();
  const endColor = useToken("colors", `${color}.300`);
  const startColor = "#6a2eab";
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [legendItems, setLegendItems] = useState([]);
  const [activeButton, setActiveButton] = useState("acelerada");
  var { data: expansion_futura_acelerada_data } = useFetch(
    ESCENARIOS_FUTUROS_ACELERADA_URL
  );
  var { data: expansion_futura_inercial_data } = useFetch(
    ESCENARIOS_FUTUROS_INERCIAL_URL
  );
  var { data: expansion_futura_controlada_data } = useFetch(
    ESCENARIOS_FUTUROS_CONTROLADA_URL
  );
  const [data, setData] = useState([]);
  const { data: expansion_actual_data } = useFetch(EXPANSION_ACTUAL_URL);

  useEffect(() => {
    switch (activeButton) {
      case "acelerada":
        setData(expansion_futura_acelerada_data);
        break;
      case "inercial":
        setData(expansion_futura_inercial_data);
        break;
      case "controlada":
        setData(expansion_futura_controlada_data);
        break;
      default:
        console.log('error: no hay "active_button"');
    }

    if (!expansion_actual_data || !data) return;
  }, [expansion_actual_data, activeButton]);

  if (!expansion_actual_data || !data) return <Loading />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id={`escenarios_futuros_layer`}
          data={cleanedGeoData(data.features, "index")}
          getFillColor={hexToRgb(endColor)}
        />
        <GeoJsonLayer
          id="escenarios_actuales_layer"
          data={expansion_actual_data}
          getFillColor={hexToRgb(startColor)}
        />
        <ButtonControls
          color={color}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          mapping={[
            { id: "acelerada", name: "Acelerada" },
            { id: "controlada", name: "Controlada" },
            { id: "inercial", name: "Inercial" },
          ]}
        />
        <PopupButton 
          videoId="2eRmyQBQ5aA"
          title="Lorem Ipsum" 
          subtitle="Lorem Ipsum" 
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae lorem dolor. Curabitur eu sodales diam." 
        />
      </CustomMap>
      <CustomLegend
        title={"Escenarios a futuro"}
        color={color}
        description={
          <>
            <b>
              SLEUTH (Slope-Land
              use-Elevation-Urbanization-Transportation-Hillshade)
            </b>
            <p>
              Modelo de simulacion urbana de monterrey se construyó a partir de
              este modelo.
            </p>
            <p>
              El modelo tuvo un proceso de calibracion para simular procesos de
              expansion a partir de la informaicon histórica de Monterrey.
            </p>
            <p>
              Clarke, K. C., & Johnson, J. M. (2020). Calibrating SLEUTH with
              big data: Projecting California's land use to 2100. Computers,
              Environment and Urban Systems, 83, 101525.
            </p>
          </>
        }
      >
        <LegendItem color={startColor} label="Expansión actual" />
        <LegendItem color={endColor} label={`Expansión ${activeButton}`} />
      </CustomLegend>
    </>
  );
};

export function EscenariosFuturosCard() {
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(ESCENARIOS_FUTUROS_CHART_URL, []);
  const startColor = useToken("colors", `${color}.700`);
  const endColor = "#9904fd";
  const ESCENARIOS_FUTUROS_COLORS = generateGradientColors(
    startColor,
    endColor,
    4
  );

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <ContextTitle color={color}>
        <p>
          El patrón de urbanización de Monterrey en las últimas tres décadas
          muestra una expansión de baja densidad hacia las periferias.
          Utilizando datos históricos, simulamos y proyectamos que, de continuar
          así, en 2040 la superficie urbanizada crecería un XXXX%, fragmentando
          la ciudad y aumentando la integración de centralidades lejanas como
          Santigago, Saltillo y Ramos Arizpe a la metrópoli.
        </p>
        <p>
          Planteamos dos alternativas: crecimiento compacto (XXXX km²
          urbanizados) y acelerado (XXXX km² urbanizados). Alcanzar uno u otro
          escenario dependerá de las políticas actuales para regular el
          crecimiento, enfocándose en regenerar y densificar, asegurando
          vivienda asequible en municipios centrales como San Nicolás, Guadalupe
          y Monterrey.
        </p>
      </ContextTitle>
      <AreaChartChart
        title="Proyección de superficie urbanizada 2020-2050"
        data={chartData}
        domain={[1975, 2070]}
        lines={["inercial", "acelerada", "controlada"]}
        lineColors={ESCENARIOS_FUTUROS_COLORS}
        columnKey="years"
        formatter={(d) => `${d.toLocaleString("en-US")}`}
      ></AreaChartChart>
    </>
  );
}
