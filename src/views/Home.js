import React, { useEffect, useRef, useState } from "react";
import { Text, useMediaQuery } from "@chakra-ui/react";
import Cards from "./Cards";
import { BitmapLayer, DeckGL, GeoJsonLayer, TileLayer } from "deck.gl";
import useWindowDimensions, {
  colorInterpolate,
  useFetch,
} from "../utils/constants";

const bounding = [-120, 15, -80, 40];
const boundingBox = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [bounding[0], bounding[1]],
        [bounding[2], bounding[1]],
        [bounding[2], bounding[3]],
        [bounding[0], bounding[3]],
        [bounding[0], bounding[1]],
      ],
    ],
  },
};
const CONTROLLER = {
  scrollZoom: false,
  touchZoom: true,
  keyboard: { moveSpeed: false },
  dragMode: "pan",
};

const minWidth = 400;
const minMultiplier = 0.9;
const maxWidth = 1400;
const maxMultiplier = 1;

const Map = ({ year }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { width } = useWindowDimensions();
  const { data } = useFetch(
    "https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/datos/mancha_urbana.geojson"
  );
  const tileLayerURL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const multiplier =
    minMultiplier +
    ((maxMultiplier - minMultiplier) / (maxWidth - minWidth)) *
      (width - minWidth);
  const image = `https://tec-expansion-urbana-p.s3.amazonaws.com/problematica/images/expansion_${year}.jpeg`;

  const initialViewState = {
    latitude: 25.68,
    longitude: isMobile ? -100.3 : -100.486419,
    zoom: (year ? 9.6 : 9.2) * multiplier,
    pitch: 10,
    bearing: 0,
    transitionDuration: 800,
  };

  const imageStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100dvw",
    height: "100dvh",
    position: "sticky",
    overflow: "hidden",
    right: "0",
    float: "right",
    zIndex: -1,
    boxShadow: "5px 10px 10px 0px rgba(0,0,0,0.3)",
  };
  const yearStyle = {
    display: "flex",
    marginRight: "20px",
    justifyContent: "end",
    alignItems: "center",
    height: "100%",
    textAlign: "end",
    color: "rgb(40, 140, 140)",
  };

  return (
    <DeckGL
      initialViewState={{ ...initialViewState, pitch: year ? 0 : 10 }}
      controller={CONTROLLER}
      style={{ width: "100%", height: "100%", ...imageStyle }}
    >
      <TileLayer
        id="satellite-imagery-layer"
        data={tileLayerURL}
        minZoom={0}
        maxZoom={12}
        tileSize={256}
        getTileData={(props) => {
          // Construct the URL for each tile
          const url = tileLayerURL
            .replace("{x}", props.index.x)
            .replace("{y}", props.index.y)
            .replace("{z}", props.index.z);
          return fetch(url)
            .then((response) => response.blob())
            .then((blob) => createImageBitmap(blob));
        }}
        renderSubLayers={(props) => {
          const {
            bbox: { west, south, east, north },
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
          });
        }}
      />
      <BitmapLayer
        id="bitmap-layer"
        bounds={[-100.8, 25.312, -99.773, 25.961]}
        image={image}
      />
      <GeoJsonLayer
        id="mask-layer"
        data={boundingBox}
        pickable={true}
        stroked={false}
        filled={true}
        lineWidthMinPixels={2}
        getFillColor={[0, 0, 0.1, 200]}
      />
      <GeoJsonLayer
        id="mancha-urbana-layer"
        data={
          data
            ? data.features
                .filter((x) => +x.properties.year <= year)
                .sort((a, b) => +b.properties.year - +a.properties.year)
            : []
        }
        getFillColor={(d) =>
          +d.properties.year === 1990 ? [200, 200, 200] : [40, 140, 140]
        }
        stroked={true}
        opacity={0.2}
      />
      <Text
        style={yearStyle}
        fontFamily={"Poppins"}
        fontSize={isMobile ? "2xl" : "5xl"}
      >
        <b>{year}</b>
      </Text>
    </DeckGL>
  );
};

const Home = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const year = currentImageIndex > 0 ? currentImageIndex * 5 + 1985 : undefined;
  const numberOfImages = 8;

  useEffect(() => {
    const handleScroll = () => {
      const normalized =
        (window.document.body.scrollTop - containerRef.current.offsetTop) /
        (containerRef.current.scrollHeight - containerRef.current.offsetTop);
      const currentImageIndex = Math.min(
        Math.max(Math.floor(normalized * numberOfImages), 0),
        numberOfImages - 1
      );
      setCurrentImageIndex(currentImageIndex);
    };

    window.document.body.addEventListener("scroll", handleScroll);

    return () =>
      window.document.body.removeEventListener("scroll", handleScroll);
  }, []);

  const adjustStickyPosition = () => {
    if (imageRef.current) {
      const elementHeight = imageRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const topPosition = (windowHeight - elementHeight) / 2;
      imageRef.current.style.top = `${topPosition}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", adjustStickyPosition);
    adjustStickyPosition();

    return () => {
      window.removeEventListener("resize", adjustStickyPosition);
    };
  }, []);

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    borderRadius: "0px 0px 0px 50px",
    background: "#f7f2e4", // Ajusta el color de fondo
    flexDirection: "column", // Para colocar los textos uno debajo del otro
    marginLeft: "10%", // Margen izquierdo para separar del borde
  };

  const titleStyle = {
    fontSize: isMobile ? "8vh" : "20vh", // Ajusta el tamaño del texto según tus preferencias
    color: "#515151", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "1rem", // Elimina el margen predeterminado
  };
  const subTitleStyle = {
    fontSize: isMobile ? "4vh" : "8vh", // Ajusta el tamaño del texto según tus preferencias
    lineHeight: "1.2",
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "2rem", // Elimina el margen predeterminado
  };
  const textStyle = {
    width: isMobile ? "60%" : "calc(40% - 60px)",
    margin: isMobile ? "200px 10px 0 10px" : "200px 40px 0 40px",
    paddingBottom: "100px",
    lineHeight: isMobile ? "1.5" : "1.8",
    textAlign: "justify",
  };

  return (
    <>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Ciudad finita</h1>
        <Text style={subTitleStyle} color="gray" m="0">
          Expansión urbana en la
        </Text>
        <Text style={subTitleStyle} color="gray" m="0">
          Zona Metropolitana de
        </Text>
        <Text style={subTitleStyle} color="orange.500" m="0">
          <b>Monterrey</b>
        </Text>
      </div>
      <div>
        <Map year={year} />
        <div ref={containerRef}>
          <Text
            color="gray.100"
            fontSize={isMobile ? "sm" : "2xl"}
            style={textStyle}
          >
            En las últimas tres décadas, la mancha urbana de Monterrey ha
            experimentado un crecimiento exponencial, triplicándose en tamaño.
            Este desarrollo, si bien evidencia el dinamismo de la ciudad,
            también conlleva riesgos ambientales, económicos y sociales. Los
            recursos urbanos y ambientales, que son esenciales para el bienestar
            de la comunidad, son finitos y deben manejarse con responsabilidad.
          </Text>
          <Text
            color="gray.100"
            fontSize={isMobile ? "sm" : "2xl"}
            style={textStyle}
          >
            <b>La 'mancha urbana'</b> se refiere a la expansión continua de la
            ciudad en términos de construcción y desarrollo. En este contexto,
            es crucial destacar que esta expansión no planificada y
            descontrolada requiere una reconsideración urgente.
          </Text>
          <Text
            color="gray.100"
            fontSize={isMobile ? "sm" : "2xl"}
            style={textStyle}
          >
            <b>La finitud de los recursos</b> urbanos, ambientales y la
            expansión aparentemente 'infinita' de la ciudad, nos hace
            plantearnos diversas preguntas fundamentales sobre la sostenibilidad
            y la gestión responsable de nuestro entorno. Enfrentar estos
            desafíos requiere un enfoque reflexivo y acciones concertadas para
            garantizar un futuro sostenible para la comunidad y el entorno en la
            Zona Metropolitana de Monterrey.
          </Text>
        </div>
      </div>
      <Cards />
    </>
  );
};

export default Home;
