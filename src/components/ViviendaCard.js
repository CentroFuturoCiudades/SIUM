import { Card, SubcentersSpan, PeripherySpan } from "./Card";
import styles from "../styles.module.css";

export function ViviendaCard({ setOutline }) {
  return (
    <Card id="vivienda">
      <h2 className={styles.title}>¿Por qué nos expandimos?</h2>
      <h4 className={styles.response}>
        La vivienda es más asequible en las periferias.
      </h4>
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
      <p className={styles.context}>
        Aunque los costos de la vivienda son menores en las periferias, otros
        costos se elevan, aumentando la desigualdad.
      </p>
    </Card>
  );
}
