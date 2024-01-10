import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
  SegregacionSpan,
} from "./Card";
import { SEGREGACION_LAYER, separateLegendItems } from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "@deck.gl/layers";
import { colorInterpolate } from "../utils/constants";
import { cleanedGeoData } from "../utils/constants";
import { hover } from "@testing-library/user-event/dist/hover";

export const SegregacionControls = ({hoverInfo}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map(
          (feat) => feat.properties["income_pc"]
        );
        console.log(values);
        setLegendItems(
          separateLegendItems(values, 4, "blue", "red", (x) =>
            x.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching the empleo data: ", error)
      );
  }, []);

  console.log(hoverInfo)
  
  return (
    <>
      <Legend title="Ingreso" legendItems={legendItems} />
      {hoverInfo && hoverInfo.object && (
        <div className="tooltip-container" style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y }}>
          <span className="tooltip-label">Valor de la propiedad income_pc: ${Math.round(hoverInfo.object.properties['income_pc'] * 100) / 100}</span>
          <span className="tooltip-label">Valor de la propiedad cvegeo: ${(hoverInfo.object.properties['cvegeo']) / 100}</span>
          <span className="tooltip-label">Valor de la propiedad q_5: ${(hoverInfo.object.properties['local_centralization_q_5_k_100'])}</span>
          <span className="tooltip-label">Valor de la propiedad q_1: ${(hoverInfo.object.properties['local_centralization_q_1_k_100'])}</span>
        </div>
      )}
    </>
  );
};

export function SegregacionCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  console.log(hoverInfo)

  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/income_municipality.json")
        .then((response) => response.json())
        .then((data) => setChartData(data));
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);
  
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([{
        type: GeoJsonLayer,
        props: {
          id: "seccion_segregacion_layer",
          data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income.geojson",
          dataTransform: (d) =>
            cleanedGeoData(d.features, "local_centralization_q_1_k_100"),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
          getLineWidth: 20,
          onHover: info => setHoverInfo(info),
           pickable: true,
           getPosition: d => d.position
        },
      }]);
    }
  }, [isCurrentSection, setLayers]);

  useEffect(() => {
    setControlsProps({hoverInfo});
  }, [hoverInfo]); 

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
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="income_pc"
        columnKey="NOM_MUN"
        formatter={(d) => `$ ${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
