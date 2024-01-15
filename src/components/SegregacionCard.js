import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  MAP_COLORS,
  cleanedGeoData,
  colorInterpolate,
  separateLegendItems,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "deck.gl";
import Tooltip from "./Tooltip";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls";

const legendMapping = {
  income_pc: {
    title: "Ingreso mensual per capita en 2020",
    formatter: (d) =>
      d.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    quantiles: [4000, 7000, 10000, 13000, 18000, 25000, 35000, 50000, 74000],
  },
  local_centralization_q_1_k_100: {
    title: "Quinto quintil segregación",
    formatter: (d) => `${Math.round(d * 100)}%`,
    quantiles: [-0.18, -0.12, -0.08, -0.04, 0, 0.02, 0.04, 0.06, 0.08],
  },
  local_centralization_q_5_k_100: {
    title: "Primer quintil segregación",
    formatter: (d) => `${Math.round(d * 100)}%`,
    quantiles: [-0.18, -0.12, -0.08, -0.04, 0, 0.02, 0.04, 0.06, 0.08],
  },
};
const SEGREGATION_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income2.geojson";
const SEGREGACION_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/income_municipality.json";

export const SegregacionControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(SEGREGATION_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const [activeButton, setActiveButton] = useState("income_pc");

  useEffect(() => {
    if (!data) return;
    const values = data.features.map((feat) => feat.properties[activeButton]);
    setLegendItems(
      separateLegendItems(
        values,
        legendMapping[activeButton].quantiles,
        MAP_COLORS,
        (x) => legendMapping[activeButton].formatter(x)
      )
    );
  }, [data, activeButton]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="segregacion_layer"
          data={cleanedGeoData(data.features, activeButton)}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties[activeButton],
              legendMapping[activeButton].quantiles,
              MAP_COLORS,
              0.8
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={8}
          onHover={(info) => setHoverInfo(info)}
          pickable={true}
          autoHighlight={true}
          getPosition={(d) => d.position}
        />
      </CustomMap>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={[
          { id: "income_pc", name: "Ingreso" },
          {
            id: "local_centralization_q_1_k_100",
            name: "Segregación Menor Ingreso",
          },
          {
            id: "local_centralization_q_5_k_100",
            name: "Segregación Mayor Ingreso",
          },
        ]}
      />
      <Legend
        title={legendMapping[activeButton].title}
        legendItems={legendItems}
        color={color}
      />
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>AGEB:</b> {hoverInfo.object.properties["cvegeo"]}
          </span>
          <span className="tooltip-label">
            <b>Ingreso mensual per capita:</b> $
            {Math.round(
              hoverInfo.object.properties["income_pc"]
            ).toLocaleString("en-US")}
          </span>
          <span className="tooltip-label">
            <b>Quinto quintil segregación:</b>{" "}
            {Math.round(
              hoverInfo.object.properties["local_centralization_q_5_k_100"] *
                100
            ) / 100}
          </span>
          <span className="tooltip-label">
            <b>Primer quintil segregación:</b>{" "}
            {Math.round(
              hoverInfo.object.properties["local_centralization_q_1_k_100"] *
                100
            ) / 100}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function SegregacionCard() {
  const { color, setOutline } = useCardContext();
  const { data: chartData } = useFetch(SEGREGACION_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        Porque expulsa a los más vulnerables a la periferia
      </ResponseTitle>
      <p>
        Al expandirnos en estos niveles es innevitable que ciertos grupos
        poblacionales queden alejados de las áreas con mejores oportunidades y
        acceso a servicios.
      </p>
      <p>
        De igual forma, la expansión provoca que zonas con mayores ingresos
        queden rodeadas de zonas de menor ingreso, ya que los costos del suelo
        son más bajos, como sucede en Céntrika y Loma Larga, y en Estanzuela
        Fomerrey y los límites de la colonia Independencia con Loma Larga.
      </p>
      <p>
        Integrar las zonas marginadas e informales por medio de transporte
        colectivo, disminuirá la segregación económica que la expansión provoca.
        Similarmente, se deben de generar políticas de vivienda asequible menos
        desconectadas de las zonas funcionales de la ciudad.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La segregación aleja y separa, tanto de nosotros mismos, como de áreas
        urbanas imprescindibles para el desarrollo humano pleno.
      </ContextTitle>
      <Chart
        title="Ingreso mensual per capita en 2020"
        data={chartData}
        domain={[5000, 35000]}
        column="income_pc"
        columnKey="nom_mun"
        formatter={(d) => `$${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
