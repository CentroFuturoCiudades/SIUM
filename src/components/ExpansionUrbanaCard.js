import React from "react";
import { Card, SubcentersSpan, PeripherySpan, CenterSpan, ExpansionSpan } from "./Card";
import styles from "../styles.module.css";

export function ExpansionUrbanaCard({ setOutline }) {
  return (
    <Card id="expansion-urbana">
      <h2 className={styles.title}>¿Hacia dónde crecemos?</h2>
      <h4 className={styles.response}>
        Hacia las periferias, lejos unos de otros.
      </h4>
      <p>
        En <ExpansionSpan setOutline={setOutline} /> los <b>adultos mayores</b> vivían en el{" "}
        <CenterSpan setOutline={setOutline} /> de Monterrey, mientras que las{" "}
        <b>familias jóvenes</b> vivían en{" "}
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
      <p className={styles.context}>
        La migración de subcentros a la periferia, conocido como expansión
        urbana, nos aleja de servicios y empleo.
      </p>
    </Card>
  );
}
