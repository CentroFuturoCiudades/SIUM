import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  SEGREGACION_CHART_URL,
  SEGREGATION_URL,
  ASENTAMIENTOSINF_URL,
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  separateLegendItems,
  useFetch,
  filterIcons,
  sectionsInfo,
} from "../utils/constants";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { GeoJsonLayer } from "deck.gl";
import Tooltip from "./Tooltip";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import Loading from "./Loading";
import ButtonControls from "./ButtonControls";
import { Slider, useToken } from "@chakra-ui/react";
import * as d3 from "d3";
import { IconLayer } from "deck.gl";
import { Checkbox, Heading } from "@chakra-ui/react";

const legendMapping = {
  income_pc: {
    title: "Ingreso mensual per capita en 2020",
    formatter: d3.format("$,.0f"),
    quantiles: [4000, 7000, 10000, 13000, 18000, 25000, 35000, 50000, 74000],
  },
  local_centralization_q_1_k_100: {
    title: "Primer quintil segregación",
    formatter: d3.format(".2"),
    quantiles: [-0.18, -0.12, -0.08, -0.04, 0, 0.02, 0.04, 0.06, 0.08],
  },
  local_centralization_q_5_k_100: {
    title: "Quinto quintil segregación",
    formatter: d3.format(".2"),
    quantiles: [-0.18, -0.12, -0.08, -0.04, 0, 0.02, 0.04, 0.06, 0.08],
  },
};

export const SegregacionControls = () => {
  const { color } = useCardContext();
  const [startColor] = useToken("colors", [`${color}.600`]);
  const endColor = "#1A57FF";
  const SEGREGACION_COLORS = generateGradientColors(startColor, endColor, 8);
  const { data } = useFetch(SEGREGATION_URL);
  const { data: data_asentamientos } = useFetch(ASENTAMIENTOSINF_URL);
  const [legendItems, setLegendItems] = useState([]);
  const [hoverInfo, setHoverInfo] = useState();
  const [activeButton, setActiveButton] = useState("income_pc");
  const [showAsentamientos, setShowAsentamientos] = useState(true);

  useEffect(() => {
    setLegendItems(
      separateLegendItems(
        legendMapping[activeButton].quantiles,
        SEGREGACION_COLORS
      )
    );
  }, [activeButton]);

  //console.log("asentamientos ifn", data_asentamientos)
  const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
  };

  const handleCheckboxChange = () => {
    setShowAsentamientos(!showAsentamientos);
  };

  if (!data || !data_asentamientos) return <Loading color={color} />;
  //console.log("asentamientos ifn", data_asentamientos.features)

  return (
    <>
      
      <CustomMap viewState={INITIAL_STATE}>
        <GeoJsonLayer
          id="segregacion_layer"
          data={cleanedGeoData(data.features, activeButton)}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties[activeButton],
              legendMapping[activeButton].quantiles,
              SEGREGACION_COLORS,
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
        
        {showAsentamientos && (
        <IconLayer
          id="asentamientos_layer"
          data={data_asentamientos.features}
          iconAtlas="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png"
          iconMapping="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json"
          getIcon={d => 'marker'}
          getPosition={d => d.geometry.coordinates}
          sizeUnits={'meters'}
          sizeScale={1000}
          sizeMinPixels={6}
        /> 
        )}
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
        formatter={legendMapping[activeButton].formatter}
      />
      <Checkbox 
        onChange={handleCheckboxChange} 
        isChecked={showAsentamientos}
        className="checkbox"
        width="210px"
      >
        <Heading size="xs" color="gray.700">
          Asentamientos autoproducidos
        </Heading>
      </Checkbox>
      {/** ERROR: Por alguna razon el zoom no funciona bien si no tiene un slider */}
      <Slider />
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
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(SEGREGACION_CHART_URL, []);

  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        Al expandirnos en estos niveles es innevitable que ciertos grupos
        poblacionales queden alejados de las áreas con oportunidades y
        servicios.
      </p>
      <p>
        La expansión provoca que zonas con mayores ingresos queden rodeadas de
        zonas de menor ingreso, ya que los costos del suelo son más bajos, como
        sucede en Céntrika y Loma Larga, y en Estanzuela Fomerrey y los límites
        de la colonia Independencia con Loma Larga.
      </p>
      <p>
        Integrar las zonas marginadas e informales por medio de transporte
        colectivo, disminuirá la segregación económica que la expansión provoca.
        Similarmente, se deben de generar políticas de vivienda asequible menos
        desconectadas de las zonas funcionales de la ciudad.
      </p>
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
