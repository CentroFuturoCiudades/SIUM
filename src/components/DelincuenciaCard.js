import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Body";
import { DELINCUENCIA_LAYER, separateLegendItems } from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";

export const DelincuenciaControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map(
          (feat) => feat.properties["num_crimen"]
        );
        setLegendItems(
          separateLegendItems(values, 4, "blue", "red")
        );
      })
      .catch((error) =>
        console.error("Error fetching the empleo data: ", error)
      );
  }, []);

  return <Legend title="Crimenes" legendItems={legendItems} />;
};


export function DelincuenciaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/crimen_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          const newData = data.filter(
            (x) => x.year === 2020 && x.TIPO_INCIDENCIA === "VIOLENCIA FAMILIAR"
          );
          setChartData(newData);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([DELINCUENCIA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>
        Porque la segregación aumenta la delincuencia.
      </ResponseTitle>
      <p>
        Incidencias delictivas como el robos en calles o a viviendas, así como
        violencia familiar se concentran en regiones segregadas.
      </p>
      <p>
        Estar alejado de actividades económicas como el comercio al por mayor
        aumentan la incidencia delictiva, mientras que estar cercano a centros
        con comercio al por menor la disminuyen.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La malas condiciones de vida en zonas marginadas contribuyen a la falta
        de oportunidades y a la delincuencia.
      </ContextTitle>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="num_crimen"
        columnKey="NOMGEO"
        formatter={(d) => `${d.toLocaleString("en-US")} crimen`}
      />
    </>
  );
}
