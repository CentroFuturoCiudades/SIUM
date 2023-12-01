import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { VIVIENDA_LAYER, separateLegendItems } from "../utils/constants";
import { Legend } from "./Legend";

export const ViviendaControls = () => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const valuesPrecio = data.features.map(
          (feat) => feat.properties["IM_PRECIO_VENTA"]
        );
        setLegendItems(
          separateLegendItems(valuesPrecio, 4, "blue", "red", (x) =>
            x.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching the geojson data: ", error)
      );
  }, []);

  return <Legend title="Precio de Venta" legendItems={legendItems} />;
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
