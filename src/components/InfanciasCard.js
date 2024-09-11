import { useCallback, useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  PARQUES_URL,
  POB05_CHART_URL,
  POB05_URL,
  SERVICIOS_URL,
  cleanedGeoData,
  colorInterpolate,
  fetchGeo,
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
import { debounce } from "lodash";

//const INFANCIAS_QUANTILES = [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.2, 0.3, 0.4];
const INFANCIAS_QUANTILES = [0.05, 0.1, 0.15, 0.2, 0.4];

export const InfanciasControls = () => {
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [startColor] = useToken("colors", [`${color}.200`]);
  const endColor = "#6a2eab";
  //const INFANCIA_COLORS = generateGradientColors(startColor, endColor, 8);
  const INFANCIA_COLORS = generateQuantileColors("#fcfce3", endColor, 4);
  const [viewState, setViewState] = useState(
    SPECIAL_INFANCIAS_STATE,
    undefined,
    isMobile
  ); //para que empiece en el punto que dijo nelida
  const [dataPob, setDataPob] = useState();
  const [dataParques, setDataParques] = useState();
  const [dataServ, setDataServ] = useState();
  const [brushingRadius, setBrushingRadius] = useState(1000); //radio esta en metros
  const [circlePayload, setCirclePayload] = useState();
  const [hoverCenter, setHoverCenter] = useState(null);

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
      case "guarderia":
        return "marker-guarderia";
      case "preescolar":
        return "marker-preescolar";
      case "salud":
        return "marker-salud";
    }
  }

  //se llama cada vez que se mueve el circulo
  const handleInfanciasHover = async (coordinates) => {
    if (!coordinates) {
      setCirclePayload(null);
      return;
    }
    console.log(hoverCenter);
    const [longCenter, latCenter] = [coordinates[0], coordinates[1]];
    const bbox = [longCenter - radiusInDegrees, latCenter - radiusInDegrees, longCenter + radiusInDegrees, latCenter + radiusInDegrees];

    const services = await fetchGeo(SERVICIOS_URL, bbox);
    setDataServ(services);

    //filter de servicios dentro del circulo
    const enclosedDataServices = services.features.filter((feature) => {
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

    const population = await fetchGeo(POB05_URL, bbox);
    setDataPob(population);
    //filter de manzanas pob05 dentro del circulo
    const filteredDataPob05 = population.features.filter((feature) => {
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

    const parks = await fetchGeo(PARQUES_URL, bbox);
    setDataParques(parks);
    const filteredDataParques = parks.features.filter((feature) => {
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
  };

  const debouncedInfanciasHover = useCallback(
    debounce(handleInfanciasHover, 100),
    []
  );

  useEffect(() => {
    debouncedInfanciasHover(hoverCenter);
  }, [hoverCenter]);

  const showData = !!dataPob && !!dataParques && !!dataServ;
  console.log("showData", showData);

  return (
    <>
      <CustomMap
        viewState={viewState}
        setViewState={setViewState}
        onHover={(info, event) => {
          if (info.coordinate) {
            const [longCenter, latCenter] = [
              info.coordinate[0],
              info.coordinate[1],
            ];
            setHoverCenter([longCenter, latCenter]);
          } else {
            setHoverCenter(null);
          }
        }}
        onDragStart={() => setHoverCenter(null)}
      >
        <GeoJsonLayer
          id="infancias2_layer" //aqui me falta arreglar el degradado de colores correcto y quitar el delineado de bordes
          data={showData ? cleanedGeoData(dataPob.features, "ratio_pob05") : []}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["ratio_pob05"],
              //[0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.2, 0.3, 0.4],
              INFANCIAS_QUANTILES,
              INFANCIA_COLORS,
              1
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={3}
          brushingEnabled={true}
          visible={!!circlePayload}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        <GeoJsonLayer
          id="parques_layer"
          data={showData ? cleanedGeoData(dataParques.features, "area") : []}
          getFillColor={[150, 200, 112]}
          getLineColor={[80, 120, 20]}
          getLineWidth={5}
          brushingEnabled={true}
          visible={!!circlePayload}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />

        <GeoJsonLayer
          id="comercios_layer"
          //data={cleanedGeoData(dataServ.features, "codigo_act")}
          data={showData ? dataServ.features.filter(
            (d) => d.properties.sector === "comercio al por menor"
          ) : []}
          getLineColor={[246, 145, 0]}
          getLineWidth={20}
          brushingEnabled={true}
          visible={!!circlePayload}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        <IconLayer
          id="servicios_tachas"
          data={showData ? dataServ.features.filter(
            (d) =>
              d.properties.sector === "guarderia" ||
              d.properties.sector === "preescolar" ||
              d.properties.sector === "salud"
          ) : []}
          iconAtlas="https://sium.blob.core.windows.net/sium/images/icon-atlas2.png"
          iconMapping="https://sium.blob.core.windows.net/sium/images/icon-atlas2.json"
          getIcon={(d) => getIconByCodigoAct(d.properties.sector)}
          getPosition={(d) => d.geometry.coordinates}
          sizeUnits={"meters"}
          sizeScale={100}
          sizeMinPixels={6}
          brushingEnabled={true}
          visible={!!circlePayload}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />

        <PopupButton
          videoId="ROtsJ6c4dIo"
          title="Sindy González Tijerina"
          subtitle="Fundación FEMSA, Inversión Social en Primera Infancia."
          text="Importancia de la integración de una perspectiva de la primera infrancia en la planeación."
          additionalContent={{
            videoId: "awKx7yDA6k8",
            title: "Luis Ávila",
            subtitle: "Cómo vamos NL.",
            text: "La importancia de accesibilidad a espacio público.",
          }}
        />
        {hoverCenter && (
          <ScatterplotLayer
            id="circle-layer"
            data={[{ position: hoverCenter, size: 1000 }]}
            pickable={true}
            stroked={true}
            filled={true}
            lineWidthMinPixels={1}
            getPosition={hoverCenter}
            getRadius={1100}
            getFillColor={[0, 0, 0, 20]} // Circle color
            getLineWidth={80}
            getLineColor={[80, 80, 80]} // Border color
          />
        )}
      </CustomMap>
      <CustomLegend
        color={color}
        title={"Porcentaje de la población total entre 0 a 5 años"}
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
        <LegendItem color={"rgb(150, 200, 112)"} label="Parques" />
        <LegendItem color={"#8b0b0b"} label="Guardería" />
        <LegendItem color={"#1f562f"} label="Preescolar" />
        <LegendItem color={"#e95481"} label="Equipamiento de Salud" />
        <LegendItem color={"#f69100"} label="Comercio al por menor" />
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
        Las familias jóvenes con bebés, niñas y niños menores de 5 años han
        migrado hacia las periferias; en donde existe una cobertura reducida de
        servicios de proximidad: educativos, de salud, comerciales y espacios
        públicos. En contraste, en las zonas centrales en donde hay una mayor
        oferta de servicios, la población infantil es menor.
      </p>
      <p>
        Este desbalance se ilustra en los equipamientos de salud (consultorios y
        hospitales generales). En un municipio central como Monterrey con un 7%
        de población infantil, la proporción de equipamientos es 1 por cada 42
        infancias. Por el contrario en la periferia, El Carmen con un 14% de la
        población infantil, cuenta con 1 equipamiento cada 2,468 niños. Esto
        obliga a las familias a desplazarse largas distancias para recibir
        atención médica, lo que implica mayores costos y esfuerzo.
      </p>
      <ContextTitle color={color}>
        UNICEF indica que los derechos de las infancias deben garantizarse a
        través de servicios de salud, nutrición, aprendizaje, protección y
        seguridad.
      </ContextTitle>
      <Chart
        title="Porcentaje de población entre 0 a 5 años"
        data={chartData}
        domain={[0.04, 0.15]}
        column="ratio_pob05"
        columnKey="NOM_MUN"
        formatter={(d) => `${d.toLocaleString("en-US", { style: "percent" })}`}
      />
    </>
  );
}
