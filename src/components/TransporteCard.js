import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CenterSpan, PeripherySpan } from "./Card";
import styles from "../styles.module.css";

export const CustomBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={150}>
    <BarChart layout="vertical" data={data}>
      <XAxis
        tickFormatter={(d) => `${d} min`}
        type="number"
        dataKey="time"
        style={{ fontSize: "0.8rem" }}
      />
      <YAxis type="category" dataKey="municipality" hide />
      <Bar background dataKey="time" fill="orange" barSize={30}>
        <LabelList
          dataKey="municipality"
          position="insideRight"
          style={{ fill: "white" }}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export function TransporteCard({ setOutline }) {
  const data = [
    {
      municipality: "Monterrey",
      time: 20,
    },
    {
      municipality: "San Pedro",
      time: 15,
    },
    {
      municipality: "Juárez",
      time: 40,
    },
    {
      municipality: "García",
      time: 50,
    },
  ];
  return (
    <Card id="transporte">
      <h2 className={styles.title}>¿Como nos movemos?</h2>
      <h4 className={styles.response}>Mayormente en automovil.</h4>
      <p>
        El <b>45%</b> de los viajes son hechos al trabajo y el <b>47%</b> de los
        viajes son hechos en automóvil, donde más de la mitad viajan solos.
      </p>
      <p>
        El <b>21%</b> se mueve en transporte público y 19% a pie. 1 de cada 3
        personas pasan 3 horas al día en ir y venir de su viaje principal en
        transporte público. En promedio se espera 21 minutos a que llegue el
        transporte público.
      </p>
      <p>
        Alrededor del <b>40%</b> de los traslados se hacen desde la{" "}
        <PeripherySpan setOutline={setOutline} /> como Apodaca, Escobedo, García
        y Juárez, y el <b>26%</b> se traslada al{" "}
        <CenterSpan setOutline={setOutline} />. En promedio se invierten{" "}
        <b>68 minutos</b> por viaje redondo, el equivalente a doce días por año.
      </p>
      <br />
      <br />
      <p className={styles.context}>
        La expansión urbana aumenta la dependencia del automovil, contribuyendo a
        que el tráfico aumente.
      </p>
      <CustomBarChart data={data.sort((a, b) => a.time - b.time).reverse()} />
    </Card>
  );
}
