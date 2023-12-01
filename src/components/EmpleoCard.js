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
import { EMPLEO_LAYER } from "../utils/constants";
import { LEGEND_ITEMS } from "../utils/constants";
import { colorInterpolate, cleanedGeoData } from "../utils/constants";

export const EmpleoControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/contexto/json/DENUE2010_Municipios_Geo2.json")
      .then(response => response.json())
      .then(data => {
        // const cleanedData = cleanedGeoData(data.features, "Empleos");
        // const normalizedValues = cleanedData.map(feature => feature.properties.normalized);
        // const minVal = Math.min(...normalizedValues);
        // const maxVal = Math.max(...normalizedValues);

        const features = data.features;
        const valuesEmpleos = features.map(feat => feat.properties["Empleos"]);
        const minVal = Math.min(...valuesEmpleos);
        const maxVal = Math.max(...valuesEmpleos);
        const range = maxVal - minVal;

        // Genera puntos de quiebre basados en el rango de valores normalizados
        const breakpoints = [0, 0.2, 0.4, 0.6, 0.8, 1].map(bp => minVal + bp * (maxVal - minVal));

        // Genera los elementos de leyenda usando los puntos de quiebre
        const newLegendItems = breakpoints.slice(0, -1).map((breakpoint, index) => {
          const nextBreakpoint = breakpoints[index + 1];
          // El punto medio se utiliza para calcular el color de la leyenda
          const midpoint = (breakpoint + nextBreakpoint) / 2;
          // Normaliza el punto medio para la interpolación de colores
          const normalizedMidpoint = (midpoint - minVal) / (maxVal - minVal);
          const interpolatedColor = colorInterpolate(normalizedMidpoint, "yellow", "red", 1);
          return {
            color: `rgba(${interpolatedColor.join(',')})`, // Convierte el color a cadena para CSS
            label: `${breakpoint.toFixed(0)} - ${nextBreakpoint.toFixed(0)}`, // Formatea la etiqueta
          };
        });

        setLegendItems(newLegendItems);
      })
      .catch(error => console.error('Error fetching the empleo data: ', error));
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

export function EmpleoCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([EMPLEO_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>En el centro.</ResponseTitle>
      <p>
        El <b>X%</b> de los empleos se concentra en el{" "}
        <CenterSpan setOutline={setOutline} />. Debido a que las familias han
        migrado hacia la <PeripherySpan setOutline={setOutline} />, se ha
        perdido población en los <SubcentersSpan setOutline={setOutline} /> y
        los translados hacia el trabajo han aumentado.
      </p>
      <p>
        De <ExpansionSpan setOutline={setOutline} /> a 2010 la <b>población</b>{" "}
        de la Zona Metropolitana de Monterrey aumentó <b>2 veces</b>, pero la{" "}
        <b>expansión urbana</b> creció <b>2.8 veces</b>.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La gente migran a la periferia, lejos de oportunidades laborales y con
        menor cobertura de transporte público.
      </ContextTitle>
    </>
  );
}
