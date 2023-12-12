import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Body";
import { DELINCUENCIA_LAYER, separateLegendItems, transformSomeData } from "../utils/constants";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { TimeComponent, SliderHTML } from "./TimeComponent";
import { colorInterpolate, addNormalized } from "../utils/constants";

const marks = [
  { value: 2017, label: "2017" },
  { value: 2018, label: "2018" },
  { value: 2019, label: "2019" },
  { value: 2020, label: "2020" },
];

export const DelincuenciaControls = ({time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const values = data.features.map(
          (feat) => feat.properties["num_crimen"]
        );
        setLegendItems(
          separateLegendItems(values, 4, "blue", "red")
        );
      })
      .catch((error) =>
        console.error("Error fetching the delincuencia data: ", error)
      );
  }, []);

    return (
      <SliderHTML
        time={time}
        min={2017}
        max={2020}
        step={1}
        title={"Crimenes"}
        togglePlay={togglePlay}
        isPlaying={isPlaying}
        handleSliderChange={handleSliderChange}
        marks={marks}
        legendItems={legendItems}
      />
    );
};


export function DelincuenciaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps } = useCardContext();
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]); //datos filtrados
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponent(2017, 2020, 1);

  //los datos que se leen para los charts
  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/crimen_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          const newData = data.filter(
            (x) => x.year === 2020 && x.TIPO_INCIDENCIA === "VIOLENCIA FAMILIAR"
          );
          setChartData(newData);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);

  /*useEffect(() => {
    if (isCurrentSection) {
      setLayers([DELINCUENCIA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);*/

  useEffect(() => {
    if (isCurrentSection) {
      console.log("Se llamaron a los datos de crimen")
      fetch("https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/crimen-hex.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  const transformDataCrimen = (data, selectedYear, column, reversed = false) => {
    if (!data || !data.features || !Array.isArray(data.features)) {
      return [];
    }

    const toNormalize = addNormalized(
      data.features.map((x) => x.properties),
      column
    );
  
    const filteredData = data.features
      .filter((feature) => feature[column] !== 0 && feature.properties.year === selectedYear)
      .map((feature) => {
        const coordinates = feature.geometry.coordinates[0]; // Obtener las coordenadas del primer anillo del polígono
        return {
          ...feature,
          properties: {
            ...feature.properties,
            normalized: reversed
              ? 1 - toNormalize(feature.properties)
              : toNormalize(feature.properties),
          },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates], // Conservar solo el primer anillo
          },
        };
      });
  
    return filteredData
  };


  useEffect(() => {
    //para la animacion
    if (isCurrentSection && originalData) {

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });

      const crimenLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_crimen_layer",
          data: transformDataCrimen(originalData, time, "num_crimen"),
          //data: transformSomeData2(originalData, time, "num_crimen", "year"),
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
          getLineWidth: 10,
        },
      };

      setLayers([crimenLayer]);
    }
  }, [
    isCurrentSection,
    originalData,
    setLayers,
    setControlsProps,
    isPlaying,
    time,
    animationTime,
  ]);

  return (
    <>
      <ResponseTitle color={color}>
        Porque la segregación aumenta la delincuencia.
      </ResponseTitle>
      <p>
        Incidencias delictivas como el robos en calles o a viviendas, así como
        violencia familiar se concentran en regiones segregadas.
      </p>
      <p>
        Estar alejado de actividades económicas como el comercio al por mayor
        aumentan la incidencia delictiva, mientras que estar cercano a centros
        con comercio al por menor la disminuyen.
      </p>
      <br />
      <br />
      <ContextTitle color={color}>
        La malas condiciones de vida en zonas marginadas contribuyen a la falta
        de oportunidades y a la delincuencia.
      </ContextTitle>
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="num_crimen"
        columnKey="NOMGEO"
        formatter={(d) => `${d.toLocaleString("en-US")} crimen`}
      />
    </>
  );
}
