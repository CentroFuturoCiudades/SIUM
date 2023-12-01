import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { VIVIENDA_LAYER } from "../utils/constants";
import { LEGEND_ITEMS } from "../utils/constants";
import { colorInterpolate } from "../utils/constants";

export const ViviendaControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson")
      .then(response => response.json())
      .then(data => {
        const features = data.features;
        const valuesPrecio = features.map(feat => feat.properties["IM_PRECIO_VENTA"]);
        const minVal = Math.min(...valuesPrecio);
        const maxVal = Math.max(...valuesPrecio);
        const range = maxVal - minVal;
        const breakpoints = [0, 0.2, 0.4, 0.6, 0.8, 1].map(bp => minVal + bp * range);

        const newLegendItems = breakpoints.slice(0, -1).map((breakpoint, index) => {
          const nextBreakpoint = breakpoints[index + 1];
          const midpoint = (breakpoint + nextBreakpoint) / 2;
          const normalizedMidpoint = (midpoint - minVal) / range;
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


export function ViviendaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([VIVIENDA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

  return (
    <>
      <ResponseTitle color={color}>
        La vivienda es más asequible en las periferias.
      </ResponseTitle>
      <p>
        En <b>1990</b> había vivienda asequible en los{" "}
        <SubcentersSpan setOutline={setOutline} />, como Santa Catarina,
        Cumbres, San Nicolás y Guadalupe. <b>Actualmente</b> la vivienda barata
        se encuentra en la <PeripherySpan setOutline={setOutline} /> como
        García, Juárez, Pesquería, Zuazua y Cadereyta.
      </p>
      <p>
        De 1990 a 2020 el costo de la vivienda asequible aumentó en un{" "}
        <b>50%</b> y la vivienda en general en más del <b>300%</b>. El{" "}
        <b>45%</b> de viviendas han sido financiadas con crédito{" "}
        <b>INFONAVIT</b> de los cuales el <b>87%</b> se encuentran en la{" "}
        <PeripherySpan setOutline={setOutline} />.
      </p>
      <p>
        El 50% de las solicitudes para el crédito tienen ingresos inferiores a
        $12,614. Considerando que el 60% de hogares viven con menos de $12,800,
        los costos de comprar casa y automóvil son, en la mayoría de los casos,
        incosteables.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        Aunque los costos de la vivienda son menores en las periferias, otros
        costos se elevan, aumentando la desigualdad.
      </ContextTitle>
    </>
  );
}
