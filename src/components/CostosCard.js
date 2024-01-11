import { useEffect, useState } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { COSTOS_LAYER } from "../utils/constants";
import { useCardContext } from "../views/Body";

export function CostosCard({ color, isCurrentSection }) {

  const [brushingRadius, setBrushingRadius] = useState(5000);

  const handleRadioChange = (event) => {
    switch (event.target.value) {
      case 'transporte_privado':
        setBrushingRadius(5000);
        break;
      case 'transporte_publico':
        setBrushingRadius(2000);
        break;
      case 'caminando':
        setBrushingRadius(500);
        break;
      default:
        setBrushingRadius(5000);
        break;
    }
  };

  const { setLayers } = useCardContext();

  useEffect(() => {
    if (isCurrentSection) {
      COSTOS_LAYER.props.brushingRadius = brushingRadius; // Update brushing radius in the layer
      setLayers([COSTOS_LAYER]);
    }
  }, [isCurrentSection, setLayers, brushingRadius]);




  return (
    <>
      <ResponseTitle color={color}>
        Porque hay que llevar servicios públicos cada vez más lejos.
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

      <form>
        <input
          type="radio"
          id="transporte_privado"
          name="distancias"
          value="transporte_privado"
          onChange={handleRadioChange}
        />
        <label htmlFor="transporte_privado"> Transporte privado </label><br />

        <input
          type="radio"
          id="transporte_publico"
          name="distancias"
          value="transporte_publico"
          onChange={handleRadioChange}
        />
        <label htmlFor="transporte_publico"> Transporte público </label><br />

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
}
