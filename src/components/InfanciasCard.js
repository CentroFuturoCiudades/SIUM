import { useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  POB05_URL,
  SERVICIOS_URL,
  cleanedGeoData,
  colorInterpolate,
  countServicesLegendNOREP,
  generateGradientColors,
  useFetch,
} from "../utils/constants";
import { LegendCustom } from "./LegendCustom";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, SPECIAL_INFANCIAS_STATE } from "./CustomMap";
import { BrushingExtension } from "@deck.gl/extensions";

import Loading from "./Loading";

const startColor = "#998f5d";
const endColor = "#1A57FF";
const INFANCIA_COLORS = generateGradientColors(startColor, endColor, 8);

const SERVICIOS_COLORS = [
  "green", //rojo para comercio
  "cyan", //azul para salud
  "yellow", //amarillo para guarderia
  "orange", //verde para preescolar
];

export const InfanciasControls = () => {
  const { color } = useCardContext();
  const [viewState, setViewState] = useState(SPECIAL_INFANCIAS_STATE); //para que empiece en el punto que dijo nelida
  const { data: dataPob } = useFetch(POB05_URL);
  const { data: dataServ } = useFetch(SERVICIOS_URL);
  const [brushingRadius, setBrushingRadius] = useState(1000); //radio esta en metros

  const [circleServicesLegend, setCircleServicesLegend] = useState([]);
  const [circlePobRatioLegend, setCirclePobRatioLegend] = useState([]);

  /*useEffect(() => {
    if (!dataPob || !dataServ) return;
    
    const valuesPob05 = dataPob.features.map(
      (feat) => feat.properties["ratio_pob05"]
    );
    const valuesServicios = dataServ.features.map(
        (feat) => feat.properties["sector"]
      );
    
  }, [dataPob, dataServ]);*/

  const radiusInDegrees = (brushingRadius / 40075000) * 360; //formula para convertir metros a grados (con la circunferencia de la Tierra 40,075,000 mts)
  //console.log("radius in degrees",radiusInDegrees); ////0.008983156581409857 (si brushingRadius=1000)

  ///CALCULAR SERVICIOS DENTRO DEL CIRCULO CON DISTANCIA EUCLIDEANA
  function EuclideanDistance(x1, y1, x2, y2) {
    //distancia euclidiana normal (0.14 ej) x1 y1 es del centro x2 y2 de otro puntp
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  //se llama cada vez que se mueve el circulo
  const handleInfanciasHover = (info) => {
    if (info.coordinate) {
      //coordenadas del centro del circulo
      const [longCenter, latCenter] = [info.coordinate[0], info.coordinate[1]];
      //console.log("coor", [longCenter, latCenter])

      //constantes para la parte de servicios
      const sectorCounts = {};
      const sectorColors = {
        "comercio al por menor": SERVICIOS_COLORS[0],
        salud: SERVICIOS_COLORS[1],
        guarderia: SERVICIOS_COLORS[2],
        preescolar: SERVICIOS_COLORS[3],
      };

      //constantes para la parte de manzanas con pob05
      let totalRatioPob05 = null;
      let totPobAdulto = null;
      let totPobInf = null;

      //filter de servicios dentro del circulo
      const enclosedDataServices = dataServ.features.filter((feature) => {
        //por cada feature se sacan sus coordenadas de [longitud, latitud]
        const coordinates = feature.geometry.coordinates;
        const [featureLong, featureLat] = coordinates;

        const sector = feature.properties.sector;

        const distance = EuclideanDistance(
          longCenter,
          latCenter,
          featureLong,
          featureLat
        ); //distancia euclidiana en grados

        //return distance <= radiusInDegrees;
        if (distance <= radiusInDegrees) {
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
          return feature;
        }
      });

      //filter de manzanas pob05 dentro del circulo
      const enclosedDataPob05 = dataPob.features.filter((feature) => {
        const centerBlockLong = feature.properties.longitud;
        const centerBlockLat = feature.properties.latitud;

        const distance = EuclideanDistance(
          longCenter,
          latCenter,
          centerBlockLong,
          centerBlockLat
        ); //distancia euclidiana en grados
        //return distance <= radiusInDegrees && feature.properties.ratio_pob05 != 0.0;
        //if(distance <= radiusInDegrees && feature.properties.ratio_pob05 != 0.0)
        if (distance <= radiusInDegrees) {
          totalRatioPob05 += feature.properties.ratio_pob05;

          totPobAdulto += feature.properties.POBTOT;
          totPobInf += feature.properties.pob05;
          return feature;
        }
      });
      //console.log("Datos dentro del rango para servicios con DIST EUC:", enclosedDataServices);
      //console.log("sections", sectorCounts)
      //setCircleServicesLegend(countServicesLegend(enclosedDataServices,SERVICIOS_COLORS));
      setCircleServicesLegend(
        countServicesLegendNOREP(
          enclosedDataServices,
          sectorCounts,
          sectorColors
        )
      );

      //setCirclePobRatioLegend(totalRatioPob05)
      //console.log("van a ser", totPobInf, "/", totPobAdulto)
      const promedioInf = (totPobInf / totPobAdulto) * 100;
      setCirclePobRatioLegend(Math.round(promedioInf * 100) / 100);
      //console.log("las manzanas con pob de 0-5 dentro del circulo son", enclosedDataPob05)
      //console.log("y el tot ratio de pob05 años en el circulo es", totalRatioPob05)
    }
  };

  if (!dataPob || !dataServ) return <Loading color={color} />;

  return (
    <>
      <CustomMap
        viewState={viewState}
        setViewState={setViewState}
        infanciasHover={handleInfanciasHover}
      >
        <GeoJsonLayer
          id="infancias2_layer"
          data={cleanedGeoData(dataPob.features, "ratio_pob05")}
          getFillColor={(d) =>
            d.properties["ratio_pob05"] === 0.0
              ? [0, 0, 0, 0] // Si ratio_pob05 es 0.0, establece el color como transparente
              : colorInterpolate(
                  d.properties["ratio_pob05"],
                  [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.2, 0.3, 0.4],
                  INFANCIA_COLORS,
                  1
                )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />

        <GeoJsonLayer
          id="servicios2_layer"
          data={cleanedGeoData(dataServ.features, "codigo_act")}
          getFillColor={(d) => [255, 0, 0, 255]}
          getLineColor={(d) =>
            colorInterpolate(
              d.properties["codigo_act"],
              //["comercio al por menor", "preescolar", "salud", "guarderia"],
              [460000, 611000, 621000, 624000],
              SERVICIOS_COLORS,
              1
            )
          }
          getLineWidth={30}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
      </CustomMap>

      <LegendCustom
        title="Población 0-5 años"
        info1={circlePobRatioLegend}
        color={"color"}
        title2="Servicios"
        legendItems={circleServicesLegend}
      />
    </>
  );
};

export function InfanciasCard() {
  const { color } = useCardContext();
  return (
    <>
      <ResponseTitle color={color}>
        Principalmente en el centro, aunque hay nuevas centralidades.
      </ResponseTitle>
      <p>
        Las familias jóvenes con primeras infancias (0-5 años de edad) han
        migrado hacia las periferias, en donde existe una cobertura reducida o
        nula de servicios de proximidad: educativos, de salud y comercial. En
        contraste, en las zonas centrales en donde hay una mayor oferta de
        servicios, la población infantil es menor.
      </p>
      <p>
        Si sumamos a este desequilibrio, condiciones de asentamientos
        autoproducidos como en el polígono de la Iniciativa Campana-Altamira,
        los rezagos de acceso a servicios son más evidentes. Por esto es clave
        promover políticas que permitan una ciudad conectada, accesible y de
        proximidad.
      </p>
      <ContextTitle color={color}>
        De acuerdo con el Marco para el Cuidado Cariñoso y Sensible, liderado
        por UNICEF, las necesidades de las primeras infancias se deben
        garantizar a través de servicios de salud, nutrición óptima,
        oportunidades para el aprendizaje, protección y seguridad.
      </ContextTitle>
    </>
  );
}
