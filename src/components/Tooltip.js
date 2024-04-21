// import { useLayoutEffect, useRef, useState } from "react";
// import { useMediaQuery, Tooltip as ChakraTooltip } from "@chakra-ui/react"; // Importa useMediaQuery de Chakra UI

// const Tooltip = ({ hoverInfo, children }) => {
//   const tooltipRef = useRef(null);
//   const [positionStyle, setPositionStyle] = useState({ opacity: 0 });
//   const [isMobile] = useMediaQuery("(max-width: 800px)"); // Detecta si es un dispositivo móvil

//   useLayoutEffect(() => {
//     if (tooltipRef.current && hoverInfo) {
//       const tooltipWidth = tooltipRef.current.offsetWidth;
//       const tooltipHeight = tooltipRef.current.offsetHeight;
//       let positionY;

//       if (isMobile) {
//         // Si es un dispositivo móvil, muestra el tooltip en la parte superior
//         positionY = "10px"; // Puedes ajustar la distancia superior según tus necesidades
//       } else {
//         // Si no es un dispositivo móvil, muestra el tooltip cerca del cursor
//         positionY = `calc(${hoverInfo.y}px - ${tooltipHeight}px - 10px)`;
//       }

//       const leftPosition = isMobile ? "10%" : `calc(${hoverInfo.x}px - ${tooltipWidth / 2}px)`;

//       setPositionStyle({
//         left: leftPosition,
//         // left: `calc(${hoverInfo.x}px - ${tooltipWidth / 2}px)`,
//         top: positionY,
//         opacity: 1,
//         transition: "opacity 0.2s, transform 0.2s",
//       });
//     } else {
//       setPositionStyle({ opacity: 0 });
//     }
//   }, [hoverInfo, isMobile]);

//   return (
//     <div
//       ref={tooltipRef}
//       className={`tooltip-container${isMobile ? "-mobile" : ""}`} // Usa el nuevo estilo en la versión móvil
//       style={{
//         position: "absolute",
//         zIndex: 1,
//         pointerEvents: "none",
//         transform: "translateY(-10px)",
//         ...positionStyle,
//       }}
//     >
//       {children}
//     </div>
//   );
// };

// export default Tooltip;

import { useLayoutEffect, useRef, useState } from "react";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { useCardContext } from "../views/Problematica";

const Tooltip = ({ hoverInfo, children }) => {
  const { color } = useCardContext();
  const tooltipRef = useRef(null);
  const [positionStyle, setPositionStyle] = useState({ opacity: 0 });
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  useLayoutEffect(() => {
    if (tooltipRef.current && hoverInfo) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      let positionY, positionX;

      if (isMobile) {
        // Si es móvil muestra el tooltip en la parte inferior derecha
        positionY = `calc(100% - ${tooltipHeight}px - 55px)`; // Ajusta la distancia desde la parte superior de la pantalla
        positionX = `calc(100% - ${tooltipWidth}px - 10px)`; // Ajusta la distancia desde el lado derecho de la pantalla
      } else {
        // Si no es móvil muestra el tooltip sobre del cursor
        positionY = `calc(${hoverInfo.y}px - ${tooltipHeight}px - 10px)`;
        positionX = `calc(${hoverInfo.x}px - ${tooltipWidth / 2}px)`;
      }

      setPositionStyle({
        left: positionX,
        top: positionY,
        opacity: 1,
        transition: "opacity 0.2s, transform 0.2s",
      });
    } else {
      setPositionStyle({ opacity: 0 });
    }
  }, [hoverInfo, isMobile]);

  return (
    <Box
      ref={tooltipRef}
      className={`tooltip-container${isMobile ? "-mobile" : ""}`}
      borderColor={`${color}.300`}
      borderWidth={1}
      style={{
        position: "absolute",
        zIndex: 1,
        pointerEvents: "none",
        transform: isMobile ? "translate(-50%, -10px)" : "translateY(-10px)",
        fontSize: isMobile ? "10px" : "0.8rem",
        width: isMobile ? "50dvw" : "auto",
        ...positionStyle,
      }}
    >
      {children}
    </Box>
  );
};

export default Tooltip;
