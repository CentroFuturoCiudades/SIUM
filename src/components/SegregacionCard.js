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
import { Button, ButtonGroup } from '@chakra-ui/react'


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
  const [chartDataId, setChartDataId] = useState('income_pc');

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/income_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          // Hacer que se muestre la informacion en base a income_pc
          setChartData(data);
          // console.log(data);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch(
        "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson"
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error fetching the empleo data: ", error)
        );
      // console.log(SEGREGACION_LAYER)
      setLayers([SEGREGACION_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  // Manejar clic en el boton para cambiar la información en base al id del botón
  function handleDataChange(event) {

    // Obtener el id del botón presionado
    const buttonId = event.target.id;
    // setChartDataId(buttonId);

    console.log(buttonId);
  }

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
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          id="income_pc"
          size="sm"
          variant="outline"
          onClick={handleDataChange}
          style={{
            backgroundColor: chartDataId === 'income_pc' ? 'gainsboro' : 'white',
          }}
        >
          Ingreso
        </Button>
        <Button
          id="local_centralization_q_1_k_100"
          onClick={handleDataChange}
          style={{
            backgroundColor: chartDataId === 'local_centralization_q_1_k_100' ? 'gainsboro' : 'white',
          }}
        >
          Segregación-
        </Button>
        <Button
          id="local_centralization_q_5_k_100"
          onClick={handleDataChange}
          style={{
            backgroundColor: chartDataId === 'local_centralization_q_5_k_100' ? 'gainsboro' : 'white',
          }}
        >
          Segregación+
        </Button>
      </ButtonGroup>
      <br />
      <br />
      <ContextTitle color={color}>
        La segregación crea zonas marginadas que presentan desafíos en servicios
        públicos y crimen.
      </ContextTitle>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column={chartDataId}
        columnKey="NOM_MUN"
        formatter={(d) => `$ ${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
