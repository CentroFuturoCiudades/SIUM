import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  ExpansionSpan,
} from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
} from "../utils/constants";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "deck.gl";

export const EmpleoControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const valuesEmpleos = data.features.map(
          (feat) => feat.properties["Empleos"]
        );
        setLegendItems(separateLegendItems(valuesEmpleos, 4, "yellow", "red"));
      })
      .catch((error) =>
        console.error("Error fetching the empleo data: ", error)
      );
  }, []);

  return <Legend title="Número de Empleos" legendItems={legendItems} />;
};

export function EmpleoCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/empleo_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => setChartData(data));
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2020_Municipios_Geo.json"
      )
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setChartData([]);
      setOriginalData(null);
      setLayers([]);
    }
  }, [isCurrentSection, setLayers]);

  useEffect(() => {
    if (isCurrentSection && originalData) {
      setLayers([
        {
          type: GeoJsonLayer,
          props: {
            id: "empleo_layer",
            data: originalData,
            dataTransform: (d) => cleanedGeoData(d.features, "Empleos"),
            getFillColor: (d) =>
              colorInterpolate(d.properties.normalized, "yellow", "red", 1.5),
            getLineColor: (d) =>
              colorInterpolate(d.properties.normalized, "yellow", "red", 0.5),
            getLineWidth: 10,
          },
        },
      ]);
    }
  }, [isCurrentSection, originalData, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>En el centro.</ResponseTitle>
      <p>
        El <b>X%</b> de los empleos se concentra en el{" "}
        <CenterSpan setOutline={setOutline} />. Debido a que las familias han
        migrado hacia la <PeripherySpan setOutline={setOutline} />, se ha
        perdido población en los <SubcentersSpan setOutline={setOutline} /> y
        los translados hacia el trabajo han aumentado.
      </p>
      <p>
        De <ExpansionSpan setOutline={setOutline} /> a 2010 la <b>población</b>{" "}
        de la Zona Metropolitana de Monterrey aumentó <b>2 veces</b>, pero la{" "}
        <b>expansión urbana</b> creció <b>2.8 veces</b>.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La gente migran a la periferia, lejos de oportunidades laborales y con
        menor cobertura de transporte público.
      </ContextTitle>
      <Chart
        title="Número de empleos en 2020"
        data={chartData}
        setOutline={setOutline}
        column="per_ocu"
        columnKey="nom_mun"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
