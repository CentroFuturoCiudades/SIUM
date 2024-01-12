import { useLayoutEffect, useRef, useState } from "react";

const Tooltip = ({ hoverInfo, children }) => {
  const tooltipRef = useRef(null);
  const [positionStyle, setPositionStyle] = useState({ opacity: 0 });

  useLayoutEffect(() => {
    if (tooltipRef.current && hoverInfo) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;

      setPositionStyle({
        left: `calc(${hoverInfo.x}px - ${tooltipWidth / 2}px)`,
        top: `calc(${hoverInfo.y}px - ${tooltipHeight}px - 10px)`,
        opacity: 1,
        transition: "opacity 0.2s, transform 0.2s",
      });
    } else {
      setPositionStyle({ opacity: 0 });
    }
  }, [hoverInfo]);

  return (
    <div
      ref={tooltipRef}
      className="tooltip-container"
      style={{
        position: "absolute",
        zIndex: 1,
        pointerEvents: "none",
        transform: "translateY(-10px)",
        ...positionStyle,
      }}
    >
      {children}
    </div>
  );
};

export default Tooltip;