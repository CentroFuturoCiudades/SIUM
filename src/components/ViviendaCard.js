import { useEffect, useState } from "react";
import { useCardContext } from "../views/Body";
import {
  SubcentersSpan,
  PeripherySpan,
  ResponseTitle,
  ContextTitle,
} from "./Card";
import { VIVIENDA_LAYER, separateLegendItems } from "../utils/constants";
import { Legend } from "./Legend";
import { Chart } from "./Chart";
import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { TimeComponent } from "./TimeComponent";


const marks = [
  { value: 1990, label: "1990" },
  { value: 1995, label: "1995" },
  { value: 2000, label: "2000" },
  { value: 2005, label: "2005" },
  { value: 2010, label: "2010" },
  { value: 2015, label: "2015" },
  { value: 2020, label: "2020" },
];

export const ViviendaControls = ({time,
  togglePlay,
  isPlaying,
  handleSliderChange,
}) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    // Carga los datos GeoJSON y actualiza las leyendas
    fetch(
      "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        const valuesPrecio = data.features.map(
          (feat) => feat.properties["IM_PRECIO_VENTA"]
        );
        setLegendItems(
          separateLegendItems(valuesPrecio, 4, "blue", "red", (x) =>
            x.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })
          )
        );
      })
      .catch((error) =>
        console.error("Error fetching the geojson data: ", error)
      );
  }, []);

  //return <Legend title="Precio de Venta" legendItems={legendItems} />;
  return (
    <>
    <div>
      <Legend title="Precio de Venta" legendItems={legendItems} />
    </div>
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: 0,
          width: "100%",
          padding: "0 20px",
        }}
      >
        <Box
          bgColor="orange.100"
          borderRadius="16px"
          borderWidth={1}
          borderColor="orange.200"
          style={{ display: "flex", width: "100%" }}
        >
          <IconButton
            colorScheme="orange"
            isRound={true}
            onClick={togglePlay}
            size="xs"
            icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
          />
          <Slider
            aria-label="slider-ex-1"
            id="slider"
            defaultValue={1990}
            min={1990}
            step={1}
            max={2023}
            value={time}
            onChange={(value) => handleSliderChange(value)}
            mr="4"
            ml="3"
          >
            {marks.map(({ value, label }) => (
              <SliderMark
                key={value}
                value={value}
                textAlign="center"
                mt="5"
                ml="-3"
                fontSize="xs"
              >
                {label}
              </SliderMark>
            ))}
            <SliderTrack bg="orange.200">
              <SliderFilledTrack bg="orange.500" />
            </SliderTrack>
            <SliderThumb boxSize={3} bgColor="orange.600" />
          </Slider>
        </Box>
      </div>
    </>
  );
};

/*export const cleanedGeoData = (data, column, time, reversed = false) => {
  const toNormalize = addNormalized(
    data.map((x) => x.properties),
    column
  );
  return data
    .filter((feature) => feature[column] !== 0  && feature.properties.time==time)
    .map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          normalized: reversed
            ? 1 - toNormalize(feature.properties)
            : toNormalize(feature.properties),
        },
      };
    });
};*/

export function colorInterpolate(normalizedValue, startColor, endColor, opacity = 1) {
  const interpolator = interpolateRgb(startColor, endColor);
  const resultColor = rgb(interpolator(normalizedValue));

  return [
    resultColor.r,
    resultColor.g,
    resultColor.b,
    normalizedValue * opacity * 255,
  ];
}

export const addNormalized = (data, column) => {
  const min = Math.min(...data.map((x) => x[column]));
  const max = Math.max(...data.map((x) => x[column]));

  return (x) => (x[column] - min) / (max - min);
};
//***************************************************************** */
export function ViviendaCard({ color, isCurrentSection }) {
  const { setLayers, setOutline, setControlsProps} = useCardContext();
  const [chartData, setChartData] = useState([]);
  //const [time, setTime] = useState(1990); //el tiempo que filtra los datos
  //const [isPlaying, setIsPlaying] = useState(false); //var de estado para manejar el play de la animacion
  //const [animationTime, setAnimationTime] = useState(1990); //tiempo cambiante de la animacion
  const [originalData, setOriginalData] = useState([]); //datos filtrados
  const [legendItems, setLegendItems] = useState([]);
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponent(1990, 2023, 15);




  useEffect(() => { //esto lee para las bar charts
    if (isCurrentSection) {
      fetch("SIUM/data/vivienda_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          const newData = data.filter((x) => x.year === 2019);
          setChartData(newData);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);


  useEffect(() => {
    if (isCurrentSection) {
      console.log("Se llamaron a los datos de vivienda")
      fetch("SIUM/data/vivienda-hex.geojson")
        .then((response) => response.json())
        .then((data) => setOriginalData(data))
        .catch((error) => console.error("Error cargando el GeoJSON:", error));
    } else {
      setOriginalData(null);
    }
  }, [isCurrentSection]);

  /*useEffect(() => { //pone la vivienda layer
    if (isCurrentSection) {
      setLayers([VIVIENDA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);*/

  const transformDataForHexagons = (data, selectedYear, column, reversed = false) => {
    if (!data || !data.features || !Array.isArray(data.features)) {
      return [];
    }

    const toNormalize = addNormalized(
      data.features.map((x) => x.properties),
      column
    );
  
    const filteredData = data.features
      .filter((feature) => feature[column] !== 0 && feature.properties.time === selectedYear)
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


  //---------algo nuevo que quiero intentar con los arcos-------------------


  const cleanedGeoData = (data, column, time, reversed = false) => {
    const toNormalize = addNormalized(
      data.map((x) => x.properties),
      column
    );
    return data
      .filter((feature) => feature[column] !== 0  && feature.properties.time==time)
      .map((feature) => {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            normalized: reversed
              ? 1 - toNormalize(feature.properties)
              : toNormalize(feature.properties),
          },
        };
      });
  };
  

  useEffect(() => {
    //para la animacion
    if (isCurrentSection && originalData) {
      /*const togglePlay = () => {
        setIsPlaying(!isPlaying);
        setAnimationTime(time); //inicia la animación desde la posición actual del slider
      };
      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });*/

      //const { togglePlay, handleSliderChange, setIsPlaying, setAnimationTime } = TimeComponent(1990, 1990, 2023, 15);

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });
      

      //const año  = 2019;
      const viviendaLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_vivienda_layer",
          //data: "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/vivienda-hex.geojson",
          //data: originalData,
          data: transformDataForHexagons(originalData, time, "IM_PRECIO_VENTA", true),
          //dataTransform: (d) => cleanedGeoData(d.features, "IM_PRECIO_VENTA", time, true), //si pongo que se filtre por time en el dataTransform lo hace peroo no se refreshea, es el problema que tenia al mero principio
          getFillColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 1),
          getLineColor: (d) =>
            colorInterpolate(d.properties.normalized, "blue", "red", 0.5),
          getLineWidth: 10,
        },
      };

      setLayers([viviendaLayer]);
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

  /*useEffect(() => {
    let animationFrame;

    const animate = () => {
      //setTime((prevTime) => (prevTime + 2) % 2023);
      //setTime((prevTime) => (prevTime + 1) % (2023) + 1990);
      setTime((prevTime) => (prevTime + 15) % (2023 - 1990) + 1990);
      console.log(time);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    } else {
      cancelAnimationFrame(animationFrame);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const handleSliderChange = (newTime) => {
    console.log("New Time:", newTime); //checar que valor tiene el slider
    setTime(newTime); //actualiza el estado de 'time' con el nuevo valor
    setAnimationTime(newTime);
  };*/

  return (
    <>
      <ResponseTitle color={color}>
        La vivienda es más asequible en las periferias.
      </ResponseTitle>
      <p>
        En <b>1990</b> había vivienda asequible en los{" "}
        <SubcentersSpan setOutline={setOutline} />, como Santa Catarina,
        Cumbres, San Nicolás y Guadalupe. <b>Actualmente</b> la vivienda barata
        se encuentra en la <PeripherySpan setOutline={setOutline} /> como
        García, Juárez, Pesquería, Zuazua y Cadereyta.
      </p>
      <p>
        De 1990 a 2020 el costo de la vivienda asequible aumentó en un{" "}
        <b>50%</b> y la vivienda en general en más del <b>300%</b>. El{" "}
        <b>45%</b> de viviendas han sido financiadas con crédito{" "}
        <b>INFONAVIT</b> de los cuales el <b>87%</b> se encuentran en la{" "}
        <PeripherySpan setOutline={setOutline} />.
      </p>
      <p>
        El 50% de las solicitudes para el crédito tienen ingresos inferiores a
        $12,614. Considerando que el 60% de hogares viven con menos de $12,800,
        los costos de comprar casa y automóvil son, en la mayoría de los casos,
        incosteables.
      </p>
      <br />
      <br />
      {/* <ContextTitle color={color}>
        Aunque los costos de la vivienda son menores en las periferias, otros
        costos se elevan, aumentando la desigualdad.
      </ContextTitle> */}
      <Chart
        data={chartData}
        setOutline={setOutline}
        column="IM_PRECIO_VENTA"
        columnKey="NOMGEO"
        formatter={(d) => `$${d.toLocaleString("en-US")}`}
      />
    </>
  );
}
