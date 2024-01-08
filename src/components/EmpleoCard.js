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
      <ResponseTitle color={color}>
        Principalmente en el centro, aunque hay nuevas centralidades.
      </ResponseTitle>
      <p>
        La migración de las familias jóvenes hacia la periferia provoca una
        disminución de la población en centros y subcentros urbanos, generando
        un aumento en los desplazamientos hacia los lugares de empleo.
      </p>
      <p>
        Aunque{" "}
        <b>
          la mayoría de los empleos continúan concentrándose en el centro, a
          unos diez kilómetros alrededor de la Macroplaza
        </b>
        , también han surgido nuevas centralidades. En 2010, el 53% de los
        empleos se concentraba en esta zona, cifra que disminuyó al 47% para el
        año 2020. Destaca que los{" "}
        <b>
          ritmos de crecimiento de los centros de empleo son menores en
          comparación con la migración residencial hacia la periferia urbana.
        </b>
      </p>
      <p>
        Durante el periodo de 1990 a 2020, la población de la Zona Metropolitana
        de Monterrey se duplicó, mientras que la expansión de la mancha urbana
        creció a un ritmo de 2.8 veces,{" "}
        <b>
          incrementando el tiempo de traslado a diferentes servicios y
          equipamientos.
        </b>
      </p>
      <ContextTitle color={color}>
        Incrementar la atracción de personas a centros y subcentros urbanos para
        una mejor accesibilidad a empleos.
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
