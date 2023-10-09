import { Card, SubcentersSpan, PeripherySpan } from "./Card";
import styles from "../styles.module.css";

export function CostosCard({ setOutline }) {
  return (
    <Card id="costos">
      <h2 className={styles.title}>
        ¿Por qué la expansión nos cuesta tanto dinero?
      </h2>
      <h4 className={styles.response}>
        Porque hay que llevar servicios públicos cada vez más lejos.
      </h4>
      <p>
        Incidencias delictivas como el robos en calles o a viviendas, así como
        violencia familiar se concentran en regiones segregadas.
      </p>
      <p>
        Estar alejado de actividades económicas como el comercio al por mayor
        aumentan la incidencia delictiva, mientras que estar cercano a centros
        con comercio al por menor la disminuyen.
      </p>
      <br />
      <br />
      <p className={styles.context}>
        La malas condiciones de vida en zonas marginadas contribuyen a la falta
        de oportunidades y a la delincuencia.
      </p>
    </Card>
  );
}