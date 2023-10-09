import { Card, SubcentersSpan, PeripherySpan } from "./Card";
import styles from "../styles.module.css";

export function SegregacionCard({ setOutline }) {
  return (
    <Card id="segregacion">
      <h2 className={styles.title}>¿Por qué la expansión segrega?</h2>
      <h4 className={styles.response}>
        Aisla a personas con menos recursos de zonas con mayor inversión.
      </h4>
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
        Las zonas con mayor segregación se tienden concentrar en las{" "}
        <PeripherySpan setOutline={setOutline} /> como Juarez, Garcia, Pesquería
        y Cadereyta.
      </p>
      <br />
      <br />
      <p className={styles.context}>
        La segregación crea zonas marginadas que presentan desafíos en servicios
        públicos y crimen.
      </p>
    </Card>
  );
}
