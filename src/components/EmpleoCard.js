import {
  Card,
  SubcentersSpan,
  PeripherySpan,
  CenterSpan,
  ResponseTitle,
  ContextTitle,
  EmploymentSpan,
  ExpansionSpan,
} from "./Card";

export function EmpleoCard({ setOutline }) {
  return (
    <Card id="empleo" color="brown2">
      <ResponseTitle color="brown2">En el centro.</ResponseTitle>
      <p>
        El <b>X%</b> de los <EmploymentSpan setOutline={setOutline} /> se concentra en el{" "}
        <CenterSpan setOutline={setOutline} />. Debido a que las familias han
        migrado hacia la <PeripherySpan setOutline={setOutline} />, se ha
        perdido población en los <SubcentersSpan setOutline={setOutline} /> y
        los translados hacia el trabajo han aumentado.
      </p>
      <p>
        De <ExpansionSpan setOutline={setOutline} /> a 2010 la <b>población</b> de la Zona Metropolitana de Monterrey
        aumentó <b>2 veces</b>, pero la <b>expansión urbana</b> creció{" "}
        <b>2.8 veces</b>.
      </p>
      <br />
      <br />
      <ContextTitle color="brown2">
        La gente migran a la periferia, lejos de oportunidades laborales y con
        menor cobertura de transporte público.
      </ContextTitle>
    </Card>
  );
}
