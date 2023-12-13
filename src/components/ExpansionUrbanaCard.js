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
import { colorInterpolate } from "../utils/constants";
import { render } from "react-dom";
import { Legend } from "./Legend";
import { Chart } from "./Chart";


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

  return <Legend title="Cambio Poblacional" legendItems={legendItems} />;
};

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [tooltipInfo, setTooltipInfo] = useState({ isVisible: false, x: 0, y: 0, text: '' });

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
      setLayers([EXPANSION_LAYER(setTooltipInfo)]);
    }
  }, [isCurrentSection, setLayers]);

  const handleMouseMove = (event) => {
    // Coordenadas del mouse con respecto al viewport
    const { clientX, clientY } = event;
  
    if (tooltipInfo.isVisible) {
      setTooltipInfo({
        ...tooltipInfo,
        x: clientX,
        y: clientY,
      });
    }
  };

  const handleMouseOut = () => {
    setTooltipInfo({ isVisible: false, x: 0, y: 0, text: '' });
  };

  const renderTooltip = () => {
    if (tooltipInfo.isVisible) {
      const style = {
        position: 'absolute',
        zIndex: 1,
        pointerEvents: 'none',
        left: `${tooltipInfo.x}px`,
        top: `${tooltipInfo.y}px`,
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
        borderRadius: '3px',
        whiteSpace: 'nowrap',
      };

      return (
        <div style={style}>
          {tooltipInfo.text}
        </div>
      );
    }
    return null;
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
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
      <ContextTitle color={color}>
        La migración de subcentros a la periferia, conocido como expansión
        urbana, nos aleja de servicios y empleo.
      </ContextTitle>
  
      {renderTooltip()}
      
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="2020"
        columnKey="nom_mun"
        formatter={(d) => `${d.toLocaleString("en-US")} pob`}
      />
    </div>
  );
}

