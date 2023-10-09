import { Card, SubcentersSpan, PeripherySpan, CenterSpan } from "./Card";
import styles from "../styles.module.css";

export function EmpleoCard({ setOutline }) {
  return (
    <Card id="empleo">
      <h2 className={styles.title}>¿En dónde trabajamos?</h2>
      <h4 className={styles.response}>En el centro.</h4>
      <p>
        El <b>X%</b> de los empleos se concentra en el{" "}
        <CenterSpan setOutline={setOutline} />. Debido a que las familias han
        migrado hacia la <PeripherySpan setOutline={setOutline} />, se ha
        perdido población en los <SubcentersSpan setOutline={setOutline} /> y
        los translados hacia el trabajo han aumentado.
      </p>
      <p>
        De 1990 a 2010 la <b>población</b> de la Zona Metropolitana de Monterrey
        aumentó <b>2 veces</b>, pero la <b>expansión urbana</b> creció{" "}
        <b>2.8 veces</b>.
      </p>
      <br />
      <br />
      <p className={styles.context}>
        La gente migran a la periferia, lejos de oportunidades laborales y con
        menor cobertura de transporte público.
      </p>
    </Card>
  );
}
