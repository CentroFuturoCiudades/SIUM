import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Body";
import { separateLegendItems, cleanedGeoData, colorInterpolate } from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "deck.gl";

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
        setLegendItems(separateLegendItems(values, 4, "blue", "red"));
      })
      .catch((error) =>
        console.error("Error fetching the delincuencia data: ", error)
      );
  }, []);

  return <Legend title={"Crimenes"} legendItems={legendItems} />;
};

export function DelincuenciaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  //los datos que se leen para los charts
  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => setChartData(data));
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson"
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
            id: "seccion_delincuencia_layer",
            data: originalData,
            dataTransform: (d) => cleanedGeoData(d.features, "num_crimen"),
            getFillColor: (d) =>
              colorInterpolate(d.properties.normalized, "blue", "red", 1),
            getLineColor: (d) =>
              colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
            getLineWidth: 10,
          },
        }
      ]);
    }
  }, [isCurrentSection, originalData, setLayers]);

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
        title="Robos a transeúntes por 10 mil personas (2017-2020)"
        data={chartData}
        setOutline={setOutline}
        column="num_crimen"
        columnKey="NOMGEO"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
