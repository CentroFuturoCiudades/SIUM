import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Problematica";
import {
  separateLegendItems,
  cleanedGeoData,
  colorInterpolate,
} from "../utils/constants";
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

  return <Legend title={"Incidencia delictiva 2017-2020"} legendItems={legendItems} />;
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
  }, [isCurrentSection]);

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
        },
      ]);
    }
  }, [originalData]);

  return (
    <>
      <ResponseTitle color={color}>
        Porque al estar alejados, no nos podemos cuidar los unos a los otros
      </ResponseTitle>
      <p>
        Entre más aumenta la mancha urbana, más aumenta la inseguridad: cuando
        la mancha urbana aumenta un kilómetro, el robo a casa habitación
        incrementa en un 0.04%.
      </p>
      <p>
        De forma similar, las incidencias delictivas como robos en calles o a
        viviendas, así como violencia familiar se concentran en regiones
        segregadas. Estar alejado de actividades económicas como el comercio al
        por mayor aumentan la incidencia delictiva, mientras que estar cercano a
        centros con comercio al por menor, la disminuyen.
      </p>
      <p>
        Las ciudades compactas y multifuncionales incentivan una vida pública
        activa, lo que podría disminuir los indices delictivos en la Zona
        Metropolitana de Monterrey.
      </p>
      <ContextTitle color={color}>
        Una mayor densificación, una diversificación de usos de suelo y
        transporte colectivo, incrementa los flujos peatonales e incentiva la
        vigilancia colectiva.
      </ContextTitle>
      <Chart
        title="Acumulado Robos a transeúntes por 10 mil personas (2017-2020)"
        data={chartData}
        setOutline={setOutline}
        column="num_crimen"
        columnKey="NOMGEO"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
