import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Body";
import { separateLegendItems, filterDataAll } from "../utils/constants";
import { Chart } from "./Chart";
import _ from "lodash";
import { GeoJsonLayer } from "@deck.gl/layers";
import { SliderHTML, TimeComponentClean} from "./TimeComponent";
import { colorInterpolate } from "../utils/constants";
import { Button, ButtonGroup } from '@chakra-ui/react'


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
  const [generalChartData, setGeneralChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  const [activeButton, setActiveButton] = useState('')
  const { time, isPlaying, animationTime, handleSliderChange, togglePlay } = TimeComponentClean(2017, 2020, 1, 3000, false);

  //los datos que se leen para los charts
  useEffect(() => {
    if (isCurrentSection) {
      fetch("SIUM/data/crimen_municipality.json")
        .then((response) => response.json())
        .then((data) => {
          // const newData = data.filter(
          //   (x) => x.year === 2020 && x.TIPO_INCIDENCIA === "VIOLENCIA FAMILIAR"
          // );
          setChartData(data);
          setGeneralChartData(data);
          console.log(data[0].TIPO_INCIDENCIA);
        });
    } else {
      setChartData([]);
    }
  }, [isCurrentSection]);


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

    // Manejar clic en el boton para cambiar la información en base al id del botón
    function handleDataChange(event) {
      
      // Obtener el id del botón presionado
      const buttonId = event.target.id;
      setActiveButton(buttonId);
      // console.log(activeButton);
  
      if(buttonId == 'General'){
        // setOriginalData(generalLayer);
        setChartData(generalChartData);
      } else {
        // let actualLayerData = {...generalLayer};
        let actualChartData = {...generalChartData};
  
        // Filtrar en base al id del botón presionado
        // actualLayerData.features = generalLayer.features.filter((feature) => feature.properties.Transporte == buttonId);
        actualChartData = generalChartData.filter((dato) => dato["TIPO_INCIDENCIA"] == buttonId);
  
        // setOriginalData(actualLayerData);
        setChartData(actualChartData)
      }
    }

  useEffect(() => {
    if (isCurrentSection && originalData) {

      setControlsProps({ time, togglePlay, isPlaying, handleSliderChange });

      const crimenLayer = {
        type: GeoJsonLayer,
        props: {
          id: "seccion_crimen_layer",
          data: filterDataAll(originalData, time, "num_crimen", false, "year"),
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
        <Button
          id="General"
          size="sm"
          variant="outline"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'General' ? 'gainsboro' : 'white',
          }}
        >
          General
        </Button>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          id="VIOLENCIA FAMILIAR"
          size="sm"
          variant="outline"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'VIOLENCIA FAMILIAR' ? 'gainsboro' : 'white',
          }}
        >
          Violencia Familiar
        </Button>
        <Button
          id="ROBO A TRANSEUNTE"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'ROBO A TRANSEUNTE' ? 'gainsboro' : 'white',
          }}
        >
          Robo a Transeúnte
        </Button>
        <Button
          id="ROBO A NEGOCIO"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'ROBO A NEGOCIO' ? 'gainsboro' : 'white',
          }}
        >
          Robo a Negocio
        </Button>
        <Button
          id="ROBO A CASA HABITACION"
          onClick={handleDataChange}
          style={{
            backgroundColor: activeButton === 'ROBO A CASA HABITACION' ? 'gainsboro' : 'white',
          }}
        >
          Robo a Casa Habitación
        </Button>
      </ButtonGroup>
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
