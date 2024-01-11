import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import {
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
  SegregacionSpan,
} from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { GeoJsonLayer } from "deck.gl";

export const SegregacionControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
     fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income2.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map(
          (feat) => feat.properties["income_pc"]
          );
        setLegendItems(
          separateLegendItems(values, 4, "red", "blue", (x) =>
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

  return <Legend title="Ingreso mensual per capita en 2020" legendItems={legendItems} />;
};

export function SegregacionCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();  
  const [chartData, setChartData] = useState([]);
  const [activeButton, setActiveButton] = useState('income_pc');
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income_municipality.json"
      )
        .then((response) => response.json())
        .then((data) => setChartData(data));
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income2.geojson"
      )
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setChartData([]);
      setOriginalData(null);
      setLayers([]);
    }
  }, [isCurrentSection, activeButton]);

  // Manejar clic en el boton para cambiar la información en base al id del botón
  function handleDataChange(event) {
    // Obtener el id del botón presionado
    const buttonId = event.target.id;
    setActiveButton(buttonId);
  }  

  useEffect(() => {
    if (isCurrentSection && originalData) {
    setLayers([
      {
        type: GeoJsonLayer,
        props: {
          id: "seccion_segregacion_layer",
          data: originalData,
          dataTransform: (d) => cleanedGeoData(d.features, activeButton),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "red", "blue", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "red", "blue", 0.5),
          getLineWidth: 20,
        },
      },
    ]);
  }
  }, [originalData]);

  return (
    <>
      <ResponseTitle color={color}>
        Porque expulsa a los más vulnerables a la periferia
      </ResponseTitle>
      <p>
        Al expandirnos en estos niveles es innevitable que ciertos grupos
        poblacionales queden alejados de las áreas con mejores oportunidades y
        acceso a servicios.
      </p>
      <p>
        De igual forma, la expansión provoca que zonas con mayores ingresos
        queden rodeadas de zonas de menor ingreso, ya que los costos del suelo
        son más bajos, como sucede en Céntrika y Loma Larga, y en Estanzuela
        Fomerrey y los límites de la colonia Independencia con Loma Larga.
      </p>
      <p>
        Integrar las zonas marginadas e informales por medio de transporte
        colectivo, disminuirá la segregación económica que la expansión provoca.
        Similarmente, se deben de generar políticas de vivienda asequible menos
        desconectadas de las zonas funcionales de la ciudad.
      </p>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          id="income_pc"
          size="sm"
          variant="outline"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'income_pc' ? 'gainsboro' : 'white',
          }}
        >
          Ingreso
        </Button>
        <Button
          id="local_centralization_q_1_k_100"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'local_centralization_q_1_k_100' ? 'gainsboro' : 'white',
          }}
        >
          Segregación-
        </Button>
        <Button
          id="local_centralization_q_5_k_100"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'local_centralization_q_5_k_100' ? 'gainsboro' : 'white',
          }}
        >
          Segregación+
        </Button>
      </ButtonGroup>
      <br />
      <br />
      <ContextTitle color={color}>
        La segregación aleja y separa, tanto de nosotros mismos, como de áreas
        urbanas imprescindibles para el desarrollo humano pleno.
      </ContextTitle>
      <Chart
        title="Ingreso mensual per capita en 2020"
        data={chartData}
        setOutline={setOutline}
        column="income_pc"
        columnKey="nom_mun"
        formatter={(d) => `$${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
