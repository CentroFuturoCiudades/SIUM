import { useEffect } from "react";
import { ResponseTitle, ContextTitle } from "./Card";
import { useCardContext } from "../views/Body";
import { DELINCUENCIA_LAYER } from "../utils/constants";

export function DelincuenciaCard({ color, isCurrentSection }) {
  const { setLayers } = useCardContext();
  useEffect(() => {
    if (isCurrentSection) {
      setLayers([DELINCUENCIA_LAYER]);
    }
  }, [isCurrentSection, setLayers]);

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
    </>
  );
}
