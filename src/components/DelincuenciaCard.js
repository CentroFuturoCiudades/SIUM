import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Problematica";
import {
  separateLegendItems,
  cleanedGeoData,
  colorInterpolate,
  useFetch,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, INITIAL_STATE } from "./CustomMap.js";
import Loading from "./Loading.js";
import ButtonControls from "./ButtonControls.js";
import Tooltip from "./Tooltip";

const legendMapping = {
  num_crimen: {
    title: "Incidencia delictiva 2017-2020",
    quantiles: [0, 20, 50, 100, 150, 200, 300, 400, 520],
  },
  violencia_familiar: {
    title: "Casos Violencia Familiar 2017-2020",
    quantiles: [0, 20, 50, 100, 150, 200, 250, 300, 425],
  },
  robo_transeunte: {
    title: "Robos a Transeúnte 2017-2020",
    quantiles: [0, 5, 10, 20, 30, 50, 70, 165],
  },
  robo_negocio: {
    title: "Robos a Negocio 2017-2020",
    quantiles: [0, 5, 10, 20, 30, 40, 60, 80, 145],
  },
  robo_casa: {
    title: "Robos a Casa Habitación 2017-2020",
    quantiles: [0, 5, 10, 20, 30, 40, 60, 80, 150],
  },
};

const DELINCUENCIA_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson";
const DELINCUENCIA_CHART_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen_municipality.json";
const DELINCUENCIA_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 50, 50)",
  "rgb(255, 150, 150)",
  "rgb(255, 200, 200)",
  "rgb(250, 200, 250)",
  "rgb(150, 150, 255)",
  "rgb(50, 50, 255)",
  "rgb(0, 0, 255)",
];

export const DelincuenciaControls = () => {
  const { color, setSharedProps } = useCardContext();
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(DELINCUENCIA_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const [activeButton, setActiveButton] = useState("num_crimen");

  useEffect(() => {
    if (!data) return;
    const values = data.features.map((feat) => feat.properties[activeButton]);
    setLegendItems(
      separateLegendItems(
        values,
        legendMapping[activeButton].quantiles,
        DELINCUENCIA_COLORS
      )
    );
  }, [data, activeButton]);

  useEffect(() => {
    setSharedProps({ activeButton });
  }, [activeButton]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="delincuencia_layer"
          data={cleanedGeoData(data.features, activeButton)}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties[activeButton],
              legendMapping[activeButton].quantiles,
              DELINCUENCIA_COLORS,
              0.8
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
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
          { id: "num_crimen", name: "Delitos" },
          {
            id: "violencia_familiar",
            name: "Violencia Familiar",
          },
          {
            id: "robo_transeunte",
            name: "Robo a Transeúnte",
          },
          {
            id: "robo_negocio",
            name: "Robo a Negocio",
          },
          {
            id: "robo_casa",
            name: "Robo a Casa Habitación",
          },
        ]}
      />
      <Legend
        title={legendMapping[activeButton].title}
        legendItems={legendItems}
      />
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>num_crimen:</b> {hoverInfo.object.properties["num_crimen"]}
          </span>
          <span className="tooltip-label">
            <b>robo_transeunte:</b> {hoverInfo.object.properties["robo_transeunte"]}
          </span>
          <span className="tooltip-label">
            <b>robo_casa:</b> {hoverInfo.object.properties["robo_casa"]}
          </span>
          <span className="tooltip-label">
            <b>violencia_familiar:</b> {hoverInfo.object.properties["violencia_familiar"]}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function DelincuenciaCard() {
  const { color, setOutline, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(DELINCUENCIA_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        Porque al estar alejados, no nos podemos cuidar los unos a los otros
      </ResponseTitle>
      <p>
        Entre más aumenta la mancha urbana, más aumenta la inseguridad: cuando
        la mancha urbana aumenta un kilómetro, el robo a casa habitación
        incrementa en un 0.04%.
      </p>
      <p>
        De forma similar, las incidencias delictivas como robos en calles o a
        viviendas, así como violencia familiar se concentran en regiones
        segregadas. Estar alejado de actividades económicas como el comercio al
        por mayor aumentan la incidencia delictiva, mientras que estar cercano a
        centros con comercio al por menor, la disminuyen.
      </p>
      <p>
        Las ciudades compactas y multifuncionales incentivan una vida pública
        activa, lo que podría disminuir los indices delictivos en la Zona
        Metropolitana de Monterrey.
      </p>
      <ContextTitle color={color}>
        Una mayor densificación, una diversificación de usos de suelo y
        transporte colectivo, incrementa los flujos peatonales e incentiva la
        vigilancia colectiva.
      </ContextTitle>
      <Chart
        title="Acumulado Robos a transeúntes por 10 mil personas (2017-2020)"
        data={chartData}
        domain={[0, 10500]}
        setOutline={setOutline}
        column={sharedProps.activeButton}
        columnKey="NOMGEO"
        formatter={(d) => `${Math.round(d).toLocaleString("en-US")}`}
      />
    </>
  );
}
