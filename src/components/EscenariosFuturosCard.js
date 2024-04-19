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
  "https://sium.blob.core.windows.net/sium/datos/mancha_urbana_2020.geojson";
const ESCENARIOS_FUTUROS_ACELERADA_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenario_acelerado.geojson"; // Acelerado
const ESCENARIOS_FUTUROS_INERCIAL_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenario_inercial.geojson"; // Inercial
const ESCENARIOS_FUTUROS_CONTROLADA_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenario_controlado.geojson"; // Controlado

const ESCENARIOS_FUTUROS_CHART_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenarios.json"; // Chart

const COLORS = ["#6D4F90", "#4A6985", "#58777A"];
const SCENARIOS_NAMES = ["acelerada", "inercial", "controlada"];

export const EscenariosFuturosControls = () => {
  const { color } = useCardContext();
  const startColor = useToken("colors", `${color}.600`);
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [activeButton, setActiveButton] = useState("acelerada");
  const currentColor =
    COLORS[SCENARIOS_NAMES.findIndex((t) => t === activeButton)];
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
          getFillColor={hexToRgb(currentColor)}
          opacity={0.6}
        />
        <GeoJsonLayer
          id="escenarios_actuales_layer"
          data={expansion_actual_data}
          getFillColor={[168, 174, 193]}
          opacity={0.6}
        />
        <ButtonControls
          color={color}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          mapping={[
            { id: "controlada", name: "Controlada" },
            { id: "inercial", name: "Inercial" },
            { id: "acelerada", name: "Acelerada" },
          ]}
        />
        <PopupButton 
          videoId="2eRmyQBQ5aA"
          title="José Antonio Torre" 
          subtitle="CFC." 
          text="Escenarios a futuro." 
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
        <LegendItem color={'#A8AEC1'} label="Suelo urbanizado" />
        <LegendItem color={currentColor} label={`Expansión ${activeButton}`} />
      </CustomLegend>
    </>
  );
};

export function EscenariosFuturosCard() {
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(ESCENARIOS_FUTUROS_CHART_URL, []);
  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        El patrón de urbanización de Monterrey en las últimas tres décadas,
        muestra una expansión de baja densidad hacia las periferias. Utilizando
        datos históricos, simulamos y proyectamos que, de continuar así, en 2070
        la superficie urbanizada crecerá un 76%, fragmentando la ciudad y
        aumentando la integración de centralidades lejanas como Santiago,
        Saltillo y Ramos Arizpe a la metrópoli.
      </p>
      <p>
        Planteamos dos alternativas de crecimiento: controlado (mil km²
        urbanizados) o acelerado (casi 2 mil km² urbanizados). Alcanzar uno u otro
        escenario dependerá de las políticas actuales para regularlo, y de si
        consiguen enfocarse en regenerar y densificar, asegurando, por ejemplo,
        vivienda asequible en municipios centrales como San Nicolás, Guadalupe y
        Monterrey.
      </p>
      <AreaChartChart
        title="Proyección de superficie urbanizada 2020-2070"
        data={chartData}
        domain={[2020, 2030, 2040, 2050, 2060, 2070]}
        lines={SCENARIOS_NAMES}
        lineColors={COLORS}
        columnKey="year"
        formatter={(d) =>
          d.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " km²"
        }
      ></AreaChartChart>
    </>
  );
}