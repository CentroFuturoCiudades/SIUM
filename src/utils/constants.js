export const PERIPHERIES = [
  "Juárez",
  "García",
  "Apodaca",
  "General Escobedo",
  "El Carmen",
  "Santiago",
  "Ciénega de Flores",
  "Salinas Victoria",
  "Pesquería",
  "El Carmen",
  "Cadereyta Jiménez",
  "Hidalgo",
  "General Zuazua",
];

export const SUBCENTERS = [
  "Monterrey",
  "San Pedro Garza García",
  "San Nicolás de los Garza",
  "Guadalupe",
  "Santa Catarina",
];

export const PERIPHERY_LAYER = {
  id: "perfifery-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => PERIPHERIES.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [255, 174, 0, 10],
  getLineColor: [255, 174, 0, 200],
  getLineWidth: 10,
};

export const CENTER_LAYER = {
  id: "center-layer",
  data: "data/Division_Municipal.geojson",
  dataTransform: (d) =>
    d.features.filter((x) => SUBCENTERS.includes(x.properties.NOMGEO)),
  stroked: true,
  filled: true,
  lineWidthScale: 10,
  lineWidthMinPixels: 2,
  getFillColor: [7, 3, 252, 10],
  getLineColor: [7, 3, 252, 200],
  getLineWidth: 10,
};
