import { useEffect, useState } from "react";
import { useCardContext } from "../views/Problematica";
import { ResponseTitle, ContextTitle } from "./Card";
import {
  cleanedGeoData,
  colorInterpolate,
  countServicesLegend,
  separateLegendItems,
  useFetch,
} from "../utils/constants";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import { GeoJsonLayer } from "deck.gl";
import { CustomMap, INITIAL_STATE, SPECIAL_INFANCIAS_STATE } from "./CustomMap";
import { BrushingExtension } from "@deck.gl/extensions";

import Loading from "./Loading";

const POB05_URL =
  "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/pob_infancia.geojson";

const SERVICIOS_URL =
    "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/denue_infancia.geojson";

  const POB05_COLORS = [
    "rgb(150, 150, 255)",         //ratio: 0.001 - 0.01
    "rgb(250, 200, 250)",   //ratio: 0.01 - 0.02
    "rgb(255, 200, 200)",   //ratio: 0.1 - 0.03
    "rgb(255, 150, 150)",   //ratio: 0.2 - 0.04
    "rgb(255, 50, 50)",   //ratio: 0.3 - 0.05
    "rgb(255, 0, 0)",     //ratio: 0.4 <

  ];

  const SERVICIOS_COLORS = [
    "rgb(255, 0, 0)",
    "rgb(0, 255, 0)",
    "rgb(0, 0, 255)",
    "rgb(255, 255, 0)",
  ];

export const InfanciasControls = () => {
  const { color } = useCardContext();
  //const [viewState, setViewState] = useState(INITIAL_STATE);
  const [viewState, setViewState] = useState(SPECIAL_INFANCIAS_STATE);  //para que empiece en el punto que dijo nelida
  const { data: dataPob } = useFetch(POB05_URL);
  const { data: dataServ } = useFetch(SERVICIOS_URL);
  const [brushingRadius, setBrushingRadius] = useState(1000); //radio esta en metros

  const [legendItems, setLegendItems] = useState([]);
  const [legendItems2, setLegendItems2] = useState([]);

   const [circleServicesLegend, setCircleServicesLegend] = useState([]);


  useEffect(() => {
    if (!dataPob || !dataServ) return;
    
    const valuesPob05 = dataPob.features.map(
      (feat) => feat.properties["ratio_pob05"]
    );
    const valuesServicios = dataServ.features.map(
        (feat) => feat.properties["sector"]
      );
    //console.log(valuesPob05)
    setLegendItems(
        separateLegendItems(
          valuesPob05,
          [0.001, 0.01, 0.1, 0.2, 0.3, 0.4],
          POB05_COLORS,
        )
      );
      setLegendItems2(
        separateLegendItems(
          valuesServicios,
          [460000, 611000, 621000, 624000],
          //["comercio al por menor", "preescolar", "salud", "guarderia"],
          SERVICIOS_COLORS,
        )
      );
    
  }, [dataPob, dataServ]);

  const radiusInDegrees= ((brushingRadius)/40075000)*360; //formula para convertir metros a grados (con la circunferencia de la Tierra 40,075,000 mts)
  //console.log("radius in degrees",radiusInDegrees); ////0.008983156581409857 (si brushingRadius=1000)


  //se llama cada vez que se mueve el circulo
  const handleInfanciasHover = (info) => {
    if(info.coordinate)
    {
      //coordenadas del centro del circulo 
      const [longCenter, latCenter] = [info.coordinate[0], info.coordinate[1]]
      console.log("coor", [longCenter, latCenter])

      ///CALCULAR SERVICIOS DENTRO DEL CIRCULO CON DISTANCIA EUCLIDEANA
      function EuclideanDistance (x1, y1, x2, y2)   //distancia euclidiana normal (0.14 ej) x1 y1 es del centro x2 y2 de otro puntp
      {
        const deltaX = x2 - x1; 
        const deltaY = y2 - y1; 
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
      }

      const enclosedDataServices = dataServ.features.filter((feature) => {
        //por cada feature se sacan sus coordenadas de [longitud, latitud]
        const coordinates = feature.geometry.coordinates;
        const [featureLong, featureLat] = coordinates;

        const distance = EuclideanDistance(longCenter, latCenter, featureLong, featureLat);   //distancia euclidiana en grados

        return distance <= radiusInDegrees;
        
      })
      console.log("Datos dentro del rango para servicios con DIST EUC:", enclosedDataServices);
      setCircleServicesLegend(countServicesLegend(enclosedDataServices,SERVICIOS_COLORS));

    }
  }
  

  if (!dataPob || !dataServ) return <Loading color={color} />;  

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState} infanciasHover={handleInfanciasHover}>
        <GeoJsonLayer
          id="infancias2_layer"
          data={cleanedGeoData(dataPob.features, "ratio_pob05")}
          getFillColor={(d) =>
            d.properties["ratio_pob05"] === 0.0
              ? [0,0,0,0]  // Si ratio_pob05 es 0.0, establece el color como transparente
              : colorInterpolate(
                  d.properties["ratio_pob05"],
                  [0.001, 0.01, 0.1, 0.2, 0.3, 0.4],
                  POB05_COLORS,
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
          /*getFillColor={(d) =>
            [255, 0 ,0,255]
          }*/
          getLineColor={(d) =>
            colorInterpolate(
              d.properties["codigo_act"],
              //["comercio al por menor", "preescolar", "salud", "guarderia"],
              [460000, 611000, 621000, 624000],
              SERVICIOS_COLORS,
              1
            )
          }
          //getLineColor={[255, 0, 0]}
          getLineWidth={30}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
        
      </CustomMap>
      <Legend
        title="Servicios"
        //legendItems={legendItems2}
        legendItems={circleServicesLegend}
        color={"color"}
      />
    </>
  );
}

export function InfanciasCard() {
    const { color, setOutline } = useCardContext();
    //const { data: chartData } = useFetch(EMPLEO_CHART_URL, []);
  
    return (
      <>
        <ResponseTitle color={color}>
          Principalmente en el centro, aunque hay nuevas centralidades.
        </ResponseTitle>
        <p>
          La migración de las familias jóvenes hacia la periferia provoca una
          disminución de la población en centros y subcentros urbanos, generando
          un aumento en los desplazamientos hacia los lugares de empleo.
        </p>
        <p>
          Aunque{" "}
          <b>
            la mayoría de los empleos continúan concentrándose en el centro, a
            unos diez kilómetros alrededor de la Macroplaza
          </b>
          , también han surgido nuevas centralidades. En 2010, el 53% de los
          empleos se concentraba en esta zona, cifra que disminuyó al 47% para el
          año 2020. Destaca que los{" "}
          <b>
            ritmos de crecimiento de los centros de empleo son menores en
            comparación con la migración residencial hacia la periferia urbana.
          </b>
        </p>
        <p>
          Durante el periodo de 1990 a 2020, la población de la Zona Metropolitana
          de Monterrey se duplicó, mientras que la expansión de la mancha urbana
          creció a un ritmo de 2.8 veces,{" "}
          <b>
            incrementando el tiempo de traslado a diferentes servicios y
            equipamientos.
          </b>
        </p>
        <ContextTitle color={color}>
          Incrementar la atracción de personas a centros y subcentros urbanos para
          una mejor accesibilidad a empleos.
        </ContextTitle>
  
        
      </>
    );
  }
  