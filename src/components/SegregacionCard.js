import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
  SegregacionSpan,
} from "./Card";
import { SEGREGACION_LAYER, separateLegendItems } from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";


export const SegregacionControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map(
          (feat) => feat.properties["income_pc"]
        );
        console.log(values);
        setLegendItems(
          separateLegendItems(values, 4, "blue", "red", (x) =>
            x.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching the empleo data: ", error)
      );
  }, []);

  return (
    <>
      <Legend title="Ingreso" legendItems={legendItems} />;
    </>
  ) 
};

export function SegregacionCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/income_municipality.json")
        .then((response) => response.json())
        .then((data) => setChartData(data));
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([SEGREGACION_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>
        Aisla a personas con menos recursos de zonas con mayor inversión.
      </ResponseTitle>
      <p>
        La expansión urbana causa segregación económica, es decir la separación
        entre barrios pobres y barrios afluentes.
      </p>
      <p>
        La segregación tiene efectos negativos en la calidad de vida de la
        gente, como la 🏥falta de servicios, falta de 👷mantenimiento en
        infraestructura, 🚌altos costos y tiempo de traslados, 🥂falta de
        capital social y más.
      </p>
      <p>
        Las zonas con mayor <SegregacionSpan setOutline={setOutline} /> se
        tienden concentrar en las <PeripherySpan setOutline={setOutline} /> como
        Juarez, Garcia, Pesquería y Cadereyta.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La segregación crea zonas marginadas que presentan desafíos en servicios
        públicos y crimen.
      </ContextTitle>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="income_pc"
        columnKey="NOM_MUN"
        formatter={(d) => `$ ${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
