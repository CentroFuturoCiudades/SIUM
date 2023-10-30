import React from "react";
import { CENTER_LAYER, PERIPHERY_LAYER, EMPLOYMENT_LAYER, MASIVE_TRANSPORT_LAYER } from "../utils/constants";
import styles from "../styles.module.css";

export const PeripherySpan = ({ setOutline }) => (
  <span
    className={styles.highlightAccent}
    onMouseOver={() => setOutline(PERIPHERY_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    periferia
  </span>
);
  
export const CenterSpan = ({ setOutline }) => (
  <span
    className={styles.highlightCenters}
    onMouseOver={() => setOutline(CENTER_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    centro
  </span>
);

export const EmploymentSpan = ({ setOutline }) => (
  <span
    className={styles.highlightEmployments}
    onMouseOver={() => setOutline(EMPLOYMENT_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    empleos
  </span>
);

export const MasiveTransportSpan = ({ setOutline }) => (
  <span
    className={styles.highlightTransport}
    onMouseOver={() => setOutline(MASIVE_TRANSPORT_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    transporte público
  </span>
);

export const SubcentersSpan = ({ setOutline }) => (
  <span
    className={styles.highlightSubcenters}
    onMouseOver={() => setOutline(CENTER_LAYER)}
    onMouseOut={() => setOutline(null)}
  >
    subcentros
  </span>
);

export function Card({ id, children }) {
  return (
    <section id={id}>
      <div className={`${styles.card}`}>{children}</div>
    </section>
  );
}
