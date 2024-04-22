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
import axios from "axios";

const ESCENARIOS_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenarios.geojson";

const ESCENARIOS_FUTUROS_CHART_URL =
  "https://sium.blob.core.windows.net/sium/datos/escenarios.json"; // Chart

const COLORS = ["#6D4F90", "#4A6985", "#58777A"];
const SCENARIOS_NAMES = ["acelerada", "inercial", "controlada"];
export const ESCENARIOS_COLOR_MAPPING = {
  actual: "#A8AEC1",
  acelerada: "#6D4F90",
  inercial: "#4A6985",
  controlada: "#58777A",
};

export const EscenariosFuturosControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const [activeButton, setActiveButton] = useState("acelerada");
  const currentColor = ESCENARIOS_COLOR_MAPPING[activeButton];
  const { data } = useFetch(ESCENARIOS_URL);

  if (!data) return <Loading />;
  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="escenarios_layer"
          data={data.features.filter(
            (x) =>
              x.properties.escenario === "actual" ||
              x.properties.escenario === activeButton
          )}
          getFillColor={(d) =>
            d.properties.escenario === "actual"
              ? [168, 174, 193]
              : hexToRgb(currentColor)
          }
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
          videoId="ATySU6rtJ98"
          title="José Antonio Torre"
          subtitle="Tecnológico de Monterrey, Centro para el Futuro de las Ciudades."
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
        <LegendItem color={"#A8AEC1"} label="Suelo urbanizado" />
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
        La ZMM ha agregado en promedio en los últimos 30 años 5.4 km2 cada año
        de suelo construido, equivalente a 700 campos de fútbol. Este suelo deja
        de ser agrícola o forestal y se suma a la mancha urbana anualmente. El
        patrón de urbanización de Monterrey en las últimas tres décadas muestra
        una expansión de baja densidad hacia las periferias. Utilizando datos
        históricos, simulamos y proyectamos que, de continuar así, en 2070 la
        superficie urbanizada crecerá un 76%, fragmentando la ciudad y
        aumentando la integración de centralidades lejanas como Santiago,
        Saltillo y Ramos Arizpe a la metrópoli.
      </p>
      <p>
        Planteamos dos alternativas de crecimiento: controlado (mil km²
        urbanizados) o acelerado (casi 2 mil km² urbanizados). Alcanzar uno u
        otro escenario dependerá de las políticas actuales para regularlo, y de
        si consiguen enfocarse en regenerar y densificar, asegurando, por
        ejemplo, vivienda asequible en municipios centrales como San Nicolás,
        Guadalupe y Monterrey.
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
