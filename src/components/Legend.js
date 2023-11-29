import { LEGEND_ITEMS } from "../utils/constants";
import { ExpansionUrbanaControls } from "./ExpansionUrbanaCard";

export const Legend = ({ legendItems }) => {
    return (
      <div className="legend">
        {legendItems.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <div className="legend-label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };