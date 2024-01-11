import { useEffect } from "react";
import { useCardContext } from "../views/Problematica";
import {
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
  SegregacionSpan,
} from "./Card";
import { SEGREGACION_LAYER } from "../utils/constants";

export function SegregacionCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([SEGREGACION_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

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
      <br />
      <br />
      <ContextTitle color={color}>
        La segregación crea zonas marginadas que presentan desafíos en servicios
        públicos y crimen.
      </ContextTitle>
    </>
  );
}
