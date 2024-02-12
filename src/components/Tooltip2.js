import { useLayoutEffect, useRef, useState } from "react";

const Tooltip2 = ({ hoverInfo, children }) => {
  const tooltipRef = useRef(null);
  const [positionStyle, setPositionStyle] = useState({ opacity: 0 });

  useLayoutEffect(() => {
    if (tooltipRef.current && hoverInfo) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
  
      setPositionStyle({
        left: `${hoverInfo.x + 60}px`, 
        top: `${hoverInfo.y - tooltipHeight / 2}px`, 
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
      className="tooltip-container2"
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

export default Tooltip2;