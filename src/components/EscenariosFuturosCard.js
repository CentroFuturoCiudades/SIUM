import { useState, useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  sectionsInfo,
  separateLegendItemsByCategory,
  useFetch,
} from "../utils/constants";
import { AreaChartChart } from "./AreaChart";
import { CustomLegend } from "./CustomLegend.js";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls.js";

// Paleta de segregación
const startColor = "#68736d";
const endColor = "#1A57FF";
const ESCENARIOS_FUTUROS_COLORS = generateGradientColors(
  startColor,
  endColor,
  3
);

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
          getFillColor={[200, 50, 50]}
        />
        <GeoJsonLayer
          id="escenarios_actuales_layer"
          data={expansion_actual_data}
          getFillColor={[255, 255, 255]}
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
      </CustomMap>
      {/* <CustomLegend
        title={"Escenarios a futuro"}
        legendItems={legendItems}
        color={color}
        // legendLabels={ISLAS_CALOR_LEGEND_DATA}
        legendLabels={[`Expansión ${activeButton}`]}
      /> */}
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
        La Zona Metropolitana de Monterrey se enfrenta a un creciente fenómeno
        conocido como el efecto de isla de calor. Este se manifiesta cuando las
        áreas urbanas experimentan temperaturas significativamente más altas que
        sus entornos rurales, siendo una consecuencia directa de la presencia de
        edificios, asfalto, concreto y otras superficies urbanas que retienen el
        calor
      </p>
      <p>
        En el centro de la Zona Metropolitana de Monterrey, la alta densidad de
        edificaciones junto con la falta de espacios verdes como parques,
        jardines, camellones y áreas arboladas, juega un papel crucial en el
        incremento de las temperaturas, en contraste con las zonas menos
        urbanizadas. Las infraestructuras urbanas, principalmente compuestas por
        materiales como asfalto y concreto que son impermeables y retienen el
        calor, contribuyen significativamente a este fenómeno. Durante el día,
        estos materiales acumulan calor, que luego liberan gradualmente durante
        la noche. Este proceso intensifica el efecto isla de calor,
        repercutiendo adversamente en la salud, en la calidad de vida y en el
        costo de vida de los residentes, especialmente durante los meses de
        verano.
      </p>
      <br />
      <ContextTitle color={color}>
        El rápido crecimiento urbano, sumado a la escasez de infraestructura
        verde y a la falta de una planificación sostenible, agrava aún más este
        fenómeno.
      </ContextTitle>
      <AreaChartChart
        title="Proyección de superficie urbanizada 2020-2050"
        data={chartData}
        domain={[1975, 2070]}
        lines={["inercial", "acelerada", "controlada"]}
        lineColors={ESCENARIOS_FUTUROS_COLORS}
        columnKey="years"
        formatter={(d) => `${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
