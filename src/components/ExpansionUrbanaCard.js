import React, { useEffect, useState } from "react";
import {
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  ExpansionSpan,
} from "./Card";
import { useCardContext } from "../views/Body";
import { EXPANSION_LAYER, separateLegendItems } from "../utils/constants";
import "../index.css";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import { Tabs, TabList, Tab } from '@chakra-ui/react'


export const ExpansionUrbanaControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  
  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map((feat) => feat.properties["2020"]);
        setLegendItems(separateLegendItems(values, 4, "blue", "red"));
      })
      .catch((error) =>
        console.error("Error fetching the geojson data: ", error)
      );
  }, []);


  return (
    <>
      <div style={{ position: "absolute", top: 10, left: "40%" }}>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab onClick={() => {}}>POB Joven</Tab>
          <Tab onClick={() => {}}>POB +65</Tab>
        </TabList>
      </Tabs>
      </div>
      <Legend title="Cambio Poblacional" legendItems={legendItems} />;
    </>

  );
};

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/expansion_municipality.json")
        .then((response) => response.json())
        .then((data) => setChartData(data));
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([EXPANSION_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>
        Hacia las periferias, lejos unos de otros.
      </ResponseTitle>
      <p>
        En <ExpansionSpan setOutline={setOutline} /> los <b>adultos mayores</b>{" "}
        vivían en el <CenterSpan setOutline={setOutline} /> de Monterrey,
        mientras que las <b>familias jóvenes</b> vivían en{" "}
        <SubcentersSpan setOutline={setOutline} /> como Guadalupe, San Pedro,
        San Nicolás y Cumbres.
      </p>
      <p>
        En contraste, <b>actualmente</b> los <b>adultos mayores</b> viven en los{" "}
        <SubcentersSpan setOutline={setOutline} />, mientras que las{" "}
        <b>familias jóvenes</b> viven en la{" "}
        <PeripherySpan setOutline={setOutline} />, como Juárez, García, Apodaca,
        Santa Catarina y Suaza.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La migración de subcentros a la periferia, conocido como expansión
        urbana, nos aleja de servicios y empleo.
      </ContextTitle>
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab onClick={() => setLayers([EXPANSION_LAYER])}>POB Joven</Tab>
          <Tab onClick={() => setLayers([EXPANSION_LAYER])}>POB +65</Tab>
        </TabList>
      </Tabs>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="2020"
        columnKey="nom_mun"
        formatter={(d) => `${d.toLocaleString("en-US")} pob`}
      />

    </>
  );
}
