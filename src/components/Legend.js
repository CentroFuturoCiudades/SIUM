export const Legend = ({ title, legendItems }) => {
  if (legendItems.length === 0) {
    return null;
  }
  return (
    <div className="legend-container">
      <b style={{ fontSize: "0.8rem" }}>{title}</b>
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          />
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
