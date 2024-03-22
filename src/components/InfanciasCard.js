import { useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  PARQUES_URL,
  POB05_CHART_URL,
  POB05_URL,
  SERVICIOS_URL,
  cleanedGeoData,
  colorInterpolate,
  generateGradientColors,
  generateQuantileColors,
  sectionsInfo,
  useFetch,
} from "../utils/constants";
import { LegendCustom } from "./LegendCustom";
import { GeoJsonLayer, ScatterplotLayer } from "deck.gl";
import { CustomMap, SPECIAL_INFANCIAS_STATE } from "./CustomMap";
import { BrushingExtension } from "@deck.gl/extensions";
import _ from "lodash";

import Loading from "./Loading";
import { Chart } from "./Chart";
import { useMediaQuery, useToken } from "@chakra-ui/react";
import { CustomLegend, LegendItem } from "./CustomLegend";
import { Legend } from "recharts";
import { IconLayer } from "deck.gl";
import PopupButton from "./PopupButton";

//const INFANCIAS_QUANTILES = [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.2, 0.3, 0.4];
const INFANCIAS_QUANTILES = [0, 0.1, 0.2, 0.3, 0.4];

export const InfanciasControls = () => {
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const startColor = "#cae5e5";
  const endColor = "#1A57FF";
  //const INFANCIA_COLORS = generateGradientColors(startColor, endColor, 8);
  const INFANCIA_COLORS = generateQuantileColors(startColor, endColor, 4);
  const [viewState, setViewState] = useState(SPECIAL_INFANCIAS_STATE); //para que empiece en el punto que dijo nelida
  const { data: dataPob } = useFetch(POB05_URL);
  const { data: dataParques } = useFetch(PARQUES_URL);
  const { data: dataServ } = useFetch(SERVICIOS_URL);
  const [brushingRadius, setBrushingRadius] = useState(1000); //radio esta en metros
  const [circlePayload, setCirclePayload] = useState();

  const radiusInDegrees = (brushingRadius / 40075000) * 360; //formula para convertir metros a grados (con la circunferencia de la Tierra 40,075,000 mts)
  ///CALCULAR SERVICIOS DENTRO DEL CIRCULO CON DISTANCIA EUCLIDEANA
  function EuclideanDistance(x1, y1, x2, y2) {
    //distancia euclidiana normal (0.14 ej) x1 y1 es del centro x2 y2 de otro puntp
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  function getIconByCodigoAct(sector) {
    switch (sector) {
      case 'guarderia':
        return 'marker-guarderia';
      case 'preescolar':
        return 'marker-preescolar';
      case 'salud':
        return 'marker-salud';
    }
  }

  //se llama cada vez que se mueve el circulo
  const handleInfanciasHover = (info) => {
    if (info.coordinate) {
      const [longCenter, latCenter] = [info.coordinate[0], info.coordinate[1]];

      //filter de servicios dentro del circulo
      const enclosedDataServices = dataServ.features.filter((feature) => {
        const coordinates = feature.geometry.coordinates;
        const [featureLong, featureLat] = coordinates;
        const distance = EuclideanDistance(
          longCenter,
          latCenter,
          featureLong,
          featureLat
        );
        return distance <= radiusInDegrees;
      });

      //filter de manzanas pob05 dentro del circulo
      const filteredDataPob05 = dataPob.features.filter((feature) => {
        const centerBlockLong = feature.properties.longitud;
        const centerBlockLat = feature.properties.latitud;
        const distance = EuclideanDistance(
          longCenter,
          latCenter,
          centerBlockLong,
          centerBlockLat
        );
        return distance <= radiusInDegrees;
      });

      const filteredDataParques = dataParques.features.filter((feature) => {
        const centerBlockLong = feature.properties.longitude;
        const centerBlockLat = feature.properties.latitude;
        const distance = EuclideanDistance(
          longCenter,
          latCenter,
          centerBlockLong,
          centerBlockLat
        );
        return distance <= radiusInDegrees;
      });
      const sumPob = _.sumBy(filteredDataPob05, (f) => f.properties.POBTOT);
      const sumPob05 = _.sumBy(filteredDataPob05, (f) => f.properties.pob05);
      const servicesCount = _.countBy(
        enclosedDataServices,
        (f) => f.properties.sector
      );
      const promedio = (sumPob05 / sumPob) * 100;

      setCirclePayload({
        ...servicesCount,
        pob_ratio: Math.round(promedio * 100) / 100,
        area_parques: _.sumBy(filteredDataParques, (f) => f.properties.area),
      });
    } else {
      setCirclePayload(null);
    }
  };
  if (isMobile)
    return (
      <div>
        Esta sección no se encuentra disponible en móvil por el momento. <br />
        Para ver esta sección, por favor visita la página en una computadora.
      </div>
    );

  if (!dataPob || !dataParques || !dataServ) return <Loading color={color} />;

  return (
    <>
      <CustomMap
        viewState={viewState}
        setViewState={setViewState}
        infanciasHover={handleInfanciasHover}
      >
        <GeoJsonLayer
          id="infancias2_layer" //aqui me falta arreglar el degradado de colores correcto y quitar el delineado de bordes
          data={cleanedGeoData(dataPob.features, "ratio_pob05")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["ratio_pob05"],
              //[0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.2, 0.3, 0.4],
              [0, 0.1, 0.2, 0.3, 0.4],
              INFANCIA_COLORS,
              1
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={0}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        <GeoJsonLayer
          id="parques_layer"
          data={cleanedGeoData(dataParques.features, "area")}
          getFillColor={[145, 186, 165, 255]}
          getLineColor={[145, 186, 165]}
          //getLineWidth={5}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />

        <GeoJsonLayer
          id="comercios_layer"
          //data={cleanedGeoData(dataServ.features, "codigo_act")}
          data={dataServ.features.filter(d => d.properties.sector === "comercio al por menor")}
          getFillColor={"#ff7130"}
          getLineColor={[255, 113, 48]}
          getLineWidth={30}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        <IconLayer
          id="servicios_tachas"
          data={dataServ.features.filter(d => d.properties.sector === "guarderia" || d.properties.sector === "preescolar" || d.properties.sector === "salud")}
          //iconAtlas="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png"
          iconAtlas="https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/images/icon-atlas2.png"
          //iconMapping="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json"
          iconMapping="https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/images/icon-atlas2.json"
          //getIcon={d => 'marker'}
          getIcon={d => getIconByCodigoAct(d.properties.sector)}
          getPosition={d => d.geometry.coordinates}
          sizeUnits={'meters'}
          sizeScale={100}
          sizeMinPixels={6}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        <PopupButton 
          videoId="ROtsJ6c4dIo?si=HAPfOj40Rip_XPPl"
          title="Lorem Ipsum" 
          subtitle="Lorem Ipsum" 
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae lorem dolor. Curabitur eu sodales diam." 
        /> 
      </CustomMap>
      <CustomLegend
        color={color}
        title={"Porcentaje de población entre 0 a 5 años"}
        description={
          <>
            <b>Censo INEGI 2020</b>
            <p>La fuente de información son menores de 5 años.</p>
            <b>Open Street Maps</b>
            <p>
              Equipamiento de salud y educación DENUE 2020. Información de
              parques y espacio público.
            </p>
          </>
        }
      >
        {INFANCIA_COLORS.map((color, index) => (
          <LegendItem
            key={index}
            color={color}
            label={`${(INFANCIAS_QUANTILES[index] * 100).toFixed(0)}% - ${(
              INFANCIAS_QUANTILES[index + 1] * 100
            ).toFixed(0)}%`}
          />
        ))}
        <div style={{ height: "10px" }} />
        <LegendItem color={"#91baa5"} label="Parques" />
        <LegendItem color={"#8b0b0b"} label="Guardería" />
        <LegendItem color={"#1f562f"} label="Preescolar" />
        <LegendItem color={"#e95481"} label="Equipamiento de Salud" />
        <LegendItem color={"#ff7130"} label="Comercio al por menor" />
      </CustomLegend>
      {circlePayload && (
        <LegendCustom
          pob05={circlePayload["pob_ratio"] || 0}
          area={circlePayload["area_parques"] || 0}
          color={color}
          guarderias={circlePayload["guarderia"] || 0}
          preescolares={circlePayload["preescolar"] || 0}
          comercios={circlePayload["comercio al por menor"] || 0}
          salud={circlePayload["salud"] || 0}
        />
      )}
    </>
  );
};

export function InfanciasCard() {
  const { color, currentSection } = useCardContext();
  const { data: chartData } = useFetch(POB05_CHART_URL, []);
  return (
    <>
      <ResponseTitle color={color}>
        {sectionsInfo[currentSection].answer}
      </ResponseTitle>
      <p>
        Las familias jóvenes con primeras infancias, de 0 a 5 años de edad, han
        migrado hacia las periferias, en donde existe una cobertura reducida de
        servicios de proximidad: educativos, de salud y comercial; así como
        falta de espacios públicos. En contraste, en las zonas centrales en
        donde hay una mayor oferta de servicios, la población infantil es menor.
      </p>
      <p>
        Si sumamos a este desequilibrio, condiciones de asentamientos
        autoproducidos como en el polígono de la Iniciativa Campana-Altamira,
        los rezagos de acceso a servicios son más evidentes. Por esto es clave
        promover políticas que permitan una ciudad conectada, accesible y de
        proximidad.
      </p>
      <ContextTitle color={color}>
        De acuerdo con la UNICEF, las necesidades de la primera infancia deben
        garantizarse a través de servicios de salud, nutrición, aprendizaje,
        protección y seguridad.
      </ContextTitle>
      <Chart
        title="Porcentage de población entre 0 a 5 años"
        data={chartData}
        domain={[0.04, 0.15]}
        column="ratio_pob05"
        columnKey="NOM_MUN"
        formatter={(d) => `${d.toLocaleString("en-US", { style: "percent" })}`}
      />
    </>
  );
}
