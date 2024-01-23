import { useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { COSTOS_URL, cleanedGeoData, colorInterpolate, useFetch } from "../utils/constants";
import { CustomMap, INITIAL_STATE } from "./CustomMap";
import { GeoJsonLayer } from "deck.gl";
import { BrushingExtension } from "@deck.gl/extensions";
import Loading from "./Loading";

const COSTOS_COLORS = [
  "rgb(255, 0, 0)",
  "rgb(255, 50, 50)",
  "rgb(255, 150, 150)",
  "rgb(255, 200, 200)",
  "rgb(250, 200, 250)",
  "rgb(150, 150, 255)",
  "rgb(50, 50, 255)",
  "rgb(0, 0, 255)",
];

export const CostosControls = () => {
  const [viewState, setViewState] = useState(INITIAL_STATE);
  const { data } = useFetch(COSTOS_URL);
  const [brushingRadius, setBrushingRadius] = useState(5000);

  const handleRadioChange = (event) => {
    switch (event.target.value) {
      case "transporte_privado":
        setBrushingRadius(5000);
        break;
      case "transporte_publico":
        setBrushingRadius(2000);
        break;
      case "caminando":
        setBrushingRadius(500);
        break;
      default:
        setBrushingRadius(5000);
        break;
    }
  };

  if (!data) return <Loading />;

  return (
    <>
      <CustomMap viewState={viewState} setViewState={setViewState}>
        <GeoJsonLayer
          id="costos_layer"
          data={cleanedGeoData(data.features, "num_crimen")}
          getFillColor={(d) =>
            colorInterpolate(
              d.properties["num_crimen"],
              [0, 20, 50, 100, 200, 300, 520],
              COSTOS_COLORS,
              1
            )
          }
          getLineColor={[118, 124, 130]}
          getLineWidth={5}
          brushingEnabled={true}
          brushingRadius={brushingRadius}
          extensions={[new BrushingExtension()]}
        />
      </CustomMap>
      <form style={{ position: "absolute", top: "10px", left: "10px" }}>
        <input
          type="radio"
          id="transporte_privado"
          name="distancias"
          value="transporte_privado"
          onChange={handleRadioChange}
        />
        <label htmlFor="transporte_privado"> Transporte privado </label>
        <br />

        <input
          type="radio"
          id="transporte_publico"
          name="distancias"
          value="transporte_publico"
          onChange={handleRadioChange}
        />
        <label htmlFor="transporte_publico"> Transporte público </label>
        <br />

        <input
          type="radio"
          id="caminando"
          name="distancias"
          value="caminando"
          onChange={handleRadioChange}
        />
        <label htmlFor="caminando"> Caminando </label>
      </form>
    </>
  );
};

export function CostosCard({ color }) {
  return (
    <>
      <ResponseTitle color={color}>
        Hay que llevar servicios públicos más lejos
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
    </>
  );
}
