import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Problematica";
import {
  separateLegendItems,
  cleanedGeoData,
  colorInterpolate,
  useFetch,
  DELINCUENCIA_URL,
  DELINCUENCIA_CHART_URL,
  generateGradientColors,
  sectionsInfo,
  generateQuantileColors,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, INITIAL_STATE } from "./CustomMap.js";
import Loading from "./Loading.js";
import ButtonControls from "./ButtonControls.js";
import PopupButton from "./PopupButton";
import Tooltip from "./Tooltip";
import { TimeComponentClean } from "./TimeComponent.js";
import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { MdPause } from "react-icons/md";
import { useToken } from "@chakra-ui/react";

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

const mappingTipoDelitos = [
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
];

export const DelincuenciaControls = () => {
  const { color, setSharedProps } = useCardContext();
  const startColor = useToken("colors", [`${color}.200`]);
  const endColor = "#6a2eab";
  const DELINCUENCIA_COLORS = generateQuantileColors(startColor, endColor, 8);
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(DELINCUENCIA_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const [activeButton, setActiveButton] = useState("num_crimen");

  useEffect(() => {
    setLegendItems(
      separateLegendItems(
        legendMapping[activeButton].quantiles,
        DELINCUENCIA_COLORS
      )
    );
  }, [activeButton]);

  useEffect(() => {
    setSharedProps({ activeButton });
  }, [activeButton]);

  if (!data) return <Loading color={color} />;

  return (
    <>
      <CustomMap viewState={viewState}>
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
          getLineWidth={0}
          onHover={(info) => setHoverInfo(info)}
          pickable={true}
          autoHighlight={true}
          getPosition={(d) => d.position}
        />
        <PopupButton 
          videoId="0iY7lM81XiQ?si=UBJTuAb7Vo30TAck"
          title="Rebecca Bell" 
          subtitle="Profesora/ Investigadora en el Tecnológico de Monterrey, Campus Monterrey." 
          text="Confianza e involucramiento en la seguridad pública." 
        />
      </CustomMap>
      <ButtonControls
        color={color}
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        mapping={mappingTipoDelitos}
      />
      <Slider />
      <Legend
        title={legendMapping[activeButton].title}
        legendItems={legendItems}
        description={
          <>
            <b>
              Reportes y datos anonimizados del Secretario Ejecutivo de
              Seguridad Pública
            </b>
            <p>
              Los datos se muestran para 4 tipos de delitos violencia familiar,
              robo a transeúnte, negocio y casa habitación. Se reporta la
              incidencia delictiva acumulada de 2017 al 2020 del número de
              delitos por cada diez mil personas.
            </p>
          </>
        }
        color={color}
      />
      {hoverInfo && hoverInfo.object && (
        <Tooltip hoverInfo={hoverInfo}>
          <span className="tooltip-label">
            <b>AGEB:</b> {hoverInfo.object.properties["CVEGEO"]}
          </span>
          {hoverInfo.object.properties["colonia"] && (
            <span className="tooltip-label">
              <b>Colonia:</b> {hoverInfo.object.properties["colonia"]}
            </span>
          )}
          <span className="tooltip-label">
            <b>Número de delitos:</b>{" "}
            {hoverInfo.object.properties["num_crimen"]}
          </span>
          <span className="tooltip-label">
            <b>Número de robos a transeúntes:</b>{" "}
            {hoverInfo.object.properties["robo_transeunte"]}
          </span>
          <span className="tooltip-label">
            <b>Número de robos a casa habitación:</b>{" "}
            {hoverInfo.object.properties["robo_casa"]}
          </span>
          <span className="tooltip-label">
            <b>Casos de violencia familiar:</b>{" "}
            {hoverInfo.object.properties["violencia_familiar"]}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export function DelincuenciaCard() {
  const { color, currentSection, setOutline, sharedProps } = useCardContext();
  const { data: chartData } = useFetch(DELINCUENCIA_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        Entre más crece la mancha urbana, más aumenta la inseguridad: cuando se
        expande un kilómetro, el robo a casa habitación incrementa en un 0.04%.
      </p>
      <p>
        Además, las incidencias delictivas como robos a transeúntes o a
        viviendas, así como la violencia familiar se concentran en regiones
        segregadas. Es claro que estar alejado de actividades económicas aumenta
        la incidencia delictiva, mientras que estar cercano a centros con
        comercio al por menor, la disminuyen.
      </p>
      <ContextTitle color={color}>
        Las ciudades compactas y multifuncionales incentivan una vida pública
        activa, lo que podría disminuir los índices delictivos en la Zona
        Metropolitana de Monterrey.
      </ContextTitle>
      <Chart
        title={`Acumulado ${
          mappingTipoDelitos.find((x) => x.id == sharedProps.activeButton)?.name
        } por 10 mil personas (2017-2020)`}
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
