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
import { EXPANSION_LAYER } from "../utils/constants";
import { LEGEND_ITEMS } from "../utils/constants";
import { Legend } from "../components/Legend";
import "../index.css";
import { colorInterpolate } from "../utils/constants";
import { render } from "react-dom";

export const ExpansionUrbanaControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/agebs-pob-1990-2020.geojson")
      .then(response => response.json())
      .then(data => {
        const features = data.features;
        const values2020 = features.map(feat => feat.properties["2020"]);
        const min2020 = Math.min(...values2020);
        const max2020 = Math.max(...values2020);
        const range = max2020 - min2020;
        const breakpoints = [0, 0.2, 0.4, 0.6, 0.8, 1].map(bp => min2020 + bp * range);

        const newLegendItems = breakpoints.slice(0, -1).map((breakpoint, index) => {
          const nextBreakpoint = breakpoints[index + 1];
          const midpoint = (breakpoint + nextBreakpoint) / 2;
          const normalizedMidpoint = (midpoint - min2020) / range;
          const interpolatedColor = colorInterpolate(normalizedMidpoint, "blue", "red", 1);
          return {
            color: `rgba(${interpolatedColor.join(',')})`,
            label: `${breakpoint.toFixed(0)} - ${nextBreakpoint.toFixed(0)}`,
          };
        });

        setLegendItems(newLegendItems);
      })
      .catch(error => console.error('Error fetching the geojson data: ', error));
  }, []);

  return (
    <div className="legend-container">
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }} />
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// export function ExpansionUrbanaCard({ color, isCurrentSection }) {  
//   const { setLayers, setOutline } = useCardContext();
//   useEffect(() => {
//     if (isCurrentSection) {
//       setLayers([EXPANSION_LAYER]);
//     }
//   }, [isCurrentSection, setLayers]);

//   return (
//     <>
//       <ResponseTitle color={color}>
//         Hacia las periferias, lejos unos de otros.
//       </ResponseTitle>
//       <p>
//         En <ExpansionSpan setOutline={setOutline} /> los <b>adultos mayores</b>{" "}
//         vivían en el <CenterSpan setOutline={setOutline} /> de Monterrey,
//         mientras que las <b>familias jóvenes</b> vivían en{" "}
//         <SubcentersSpan setOutline={setOutline} /> como Guadalupe, San Pedro,
//         San Nicolás y Cumbres.
//       </p>
//       <p>
//         En contraste, <b>actualmente</b> los <b>adultos mayores</b> viven en los{" "}
//         <SubcentersSpan setOutline={setOutline} />, mientras que las{" "}
//         <b>familias jóvenes</b> viven en la{" "}
//         <PeripherySpan setOutline={setOutline} />, como Juárez, García, Apodaca,
//         Santa Catarina y Suaza.
//       </p>
//       <br />
//       <br />
//       <ContextTitle color={color}>
//         La migración de subcentros a la periferia, conocido como expansión
//         urbana, nos aleja de servicios y empleo.
//       </ContextTitle>
//     </>
//   );
// }

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const [tooltipInfo, setTooltipInfo] = useState({ isVisible: false, x: 0, y: 0, text: '' });
  const { setLayers, setOutline } = useCardContext();

  useEffect(() => {
    if (isCurrentSection) {
      setLayers([EXPANSION_LAYER(setTooltipInfo)]);
    }
  }, [isCurrentSection, setLayers]);

  const handleMouseMove = (event) => {
    if (tooltipInfo.isVisible) {
      setTooltipInfo({
        ...tooltipInfo,
        x: event.clientX,
        y: event.clientY,
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
        left: tooltipInfo.x,
        top: tooltipInfo.y,
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid black',
        borderRadius: '3px',
        transform: 'translate(-50%, -100%)', // Ajusta la posición del tooltip
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
    </div>
  );
}

