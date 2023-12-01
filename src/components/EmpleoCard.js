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
import { EMPLEO_LAYER } from "../utils/constants";
import { Chart } from "./Chart";

export function EmpleoCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/empleo_municipality.json")
        .then((response) => response.json())
        .then((data) => setChartData(data));
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([EMPLEO_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

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
        data={chartData}
        setOutline={setOutline}
        column="per_ocu"
        columnKey="nom_mun"
        formatter={(d) => `${d.toLocaleString("en-US")} empleos`}
      />
    </>
  );
}
