import React, { useEffect } from "react";
import {
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  ExpansionSpan,
} from "./Card";
import { useCardContext } from "../views/Problematica";
import { EXPANSION_LAYER } from "../utils/constants";

export function ExpansionUrbanaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline } = useCardContext();
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
    </>
  );
}
