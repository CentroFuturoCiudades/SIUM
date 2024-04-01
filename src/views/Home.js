import React, { useEffect, useRef, useState } from "react";
import { IconButton, Text, Tooltip, useMediaQuery, Flex, Box, Button } from "@chakra-ui/react";
import Cards from "./Cards";
import { BitmapLayer, DeckGL, GeoJsonLayer, TileLayer } from "deck.gl";
import useWindowDimensions, {
  MANCHA_URBANA_URL,
  SATELLITE_IMAGES_URL,
  POBLACION_SUPERFICIE_CONST_URL,
  useFetch,
} from "../utils/constants";
import { Link } from "react-router-dom";
import { MdDownload, MdPeople } from "react-icons/md";
//import logoFemsa from 'http://localhost:3000/SIUM/tec.png';

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

// const IMAGE_BOUNDS = [-102.1, 25.031, -99.487, 26.435];
const IMAGE_BOUNDS = [-102.105, 25.04, -99.485, 26.423];

const minWidth = 400;
const minMultiplier = 0.88;
const maxWidth = 1400;
const maxMultiplier = 1;

const Map = ({ year }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { width } = useWindowDimensions();
  const { data } = useFetch(MANCHA_URBANA_URL);
  const { data: dataPoblacionSuperficieConst } = useFetch(POBLACION_SUPERFICIE_CONST_URL);

  const tileLayerURL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const multiplier =
    minMultiplier +
    ((maxMultiplier - minMultiplier) / (maxWidth - minWidth)) *
    (width - minWidth);
  const image = SATELLITE_IMAGES_URL(year || 1990);



  const initialViewState = {
    latitude: 25.68,
    longitude: isMobile ? -100.32 : -100.52,
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
    padding: "1dvw",
    justifyContent: "end",
    height: "100%",
    textAlign: "end",
    flexDirection: "column",
  };


  const noteStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
    margin: "1dvw",
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
      <BitmapLayer id="bitmap-layer" bounds={IMAGE_BOUNDS} image={image} />
      <GeoJsonLayer
        id="mask-layer"
        data={boundingBox}
        pickable={true}
        stroked={false}
        filled={true}
        lineWidthMinPixels={2}
        getFillColor={[0, 0, 0, 160]}
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
          +d.properties.year === 1990 ? [200, 200, 200, 60] : [106, 46, 171, 160]
        }
        stroked={true}
      />

      <div style={yearStyle}>
        <div style={{ height: "100%" }}>
          {/* Div vacío */}
        </div>

        <div style={{ height: "100%" }}>
          {year && dataPoblacionSuperficieConst ? (
            <>
              {dataPoblacionSuperficieConst ? (
                <>
                  <Text style={{ color: "white", fontSize: "1.5dvw" }}>
                    <b>
                      {`${(dataPoblacionSuperficieConst[0].population / 1000000).toFixed(1)} millones de personas`}
                    </b>
                  </Text>
                  <Text style={{ color: "white", fontSize: "1.5dvw" }}>
                    <b>
                      {`${(dataPoblacionSuperficieConst[0].mts_built / 1000000).toFixed(0)} km`} <sup>2</sup>
                    </b>
                  </Text>
                </>
              ) : ""}
              <br />
              <Text
                style={{ color: "white", lineHeight: 0.5 }}
                fontFamily="Poppins"
                fontSize="3.5dvw"
              >
                <b>1990</b>
              </Text>
            </>
          ) : null}
          {year > 1990 ? (
            <>
              <Text
                fontFamily="Poppins"
                fontSize="3.5dvw"
                style={{ color: "#783CB4", filter: 'drop-shadow(2px 2px 2px white)' }}
              >
                <b>{year}</b>
              </Text>
              {dataPoblacionSuperficieConst ? (
                <>
                  <Text style={{ color: "#783CB4", fontSize: "1.5dvw", filter: 'drop-shadow(1px 1px 1px white)' }}>
                    <b>
                      {`${(dataPoblacionSuperficieConst[(year - 1990) / 5].mts_built / 1000000).toFixed(0)} km`} <sup>2</sup>
                    </b>
                  </Text>
                  <Text style={{ color: "#783CB4", fontSize: "1.5dvw", filter: 'drop-shadow(1px 1px 1px white)' }}>
                    <b>
                      {`${(dataPoblacionSuperficieConst[(year - 1990) / 5].population / 1000000).toFixed(1)} millones de personas`}
                    </b>
                  </Text>
                </>
              ) : ""}
            </>
          ) : null}
        </div>

        {year ? (
          <>
            <div style={noteStyle}>
              <Text style={{ color: "white", alignItems: "end" }}>*Superficie construida con techo</Text>
            </div>
          </>
        ) : null}
      </div>

    </DeckGL>
  );
};

const Home = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const [isInitial, setIsInitial] = useState(true);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const year = currentImageIndex * 5 + 1990;
  const numberOfImages = 7;

  useEffect(() => {
    const handleScroll = () => {
      const normalized =
        (window.document.body.scrollTop - containerRef.current.offsetTop) /
        (containerRef.current.scrollHeight - containerRef.current.offsetTop);
      setIsInitial(normalized < -0.3);
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
    height: "100dvh",
    width: "100dvw",
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    borderRadius: "0px 0px 0px 50px",
    flexDirection: "column", // Para colocar los textos uno debajo del otro
    overflowX: "hidden",
  };

  const titleStyle = {
    fontSize: "13dvw", // Ajusta el tamaño del texto según tus preferencias
    color: "antiquewhite", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "1rem", // Elimina el margen predeterminado
    fontWeight: 900,
  };
  const subTitleStyle = {
    fontSize: "3dvw", // Ajusta el tamaño del texto según tus preferencias
    lineHeight: "1.1",
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "2rem", // Elimina el margen predeterminado
  };
  const textStyle = {
    width: isMobile ? "60%" : "calc(40% - 60px)",
    margin: isMobile ? "200px 10px 0 10px" : "200px 40px 0 40px",
    paddingBottom: "100px",
    lineHeight: isMobile ? "1.5" : "1.4",
  };

  return (
    <div>
      <div
        style={{
          height: isMobile ? "100%" : "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0",
          //overflowX: "hidden"
          //position:"fixed",
          //overflowY: "auto"
        }}
      >
        <Flex
          align="center"
          p={2}
          position="absolute"
          bg="transparent"
          w="100%"
          justify="space-between"
          display="flex"
        //overflowX= "hidden"
        >
          {/* Logos */}
          <Flex w="20%" style={{ display: "flex", alignItems: "center" }}>
            {["SIUM.png", "tec.png", "femsa.png"].map((imagen, index) => (
              <img
                key={index}
                className="headerImage"
                src={`/SIUM/${imagen}`}
                alt="SIUM"
                style={{
                  padding: "5px",
                  height: "auto",
                  width: "auto",
                  //maxWidth: "200px",
                  // maxWidth: isMobile ? "100%" : "200px",
                  maxHeight: isMobile ? "100%" : "50px",
                  objectFit: "contain",
                }}
              />
            ))}
          </Flex>

          {/* Botones */}
          <Flex w="20%" justify="space-around" align="center" style={{ marginRight: "10px" }}>
            <Link to="/objetivo">
              <Button variant="text" color="white" style={{ fontSize: "1.5dvw" }}>
                Objetivo
              </Button>
            </Link>
            <Link to="/equipo">
              <Button variant="text" color="white" style={{ fontSize: "1.5dvw" }}>
                Equipo
              </Button>
            </Link>
          </Flex>
        </Flex>

        <div>
          <Map year={!isInitial ? year : undefined} />
          <div style={{ display: "grid" }}>
            <div style={containerStyle}>
              <div>
                <h1 style={titleStyle}>CIUDAD FINITA</h1>
                <Text style={subTitleStyle} color="aliceblue" m="0">
                  Expansión urbana en la
                </Text>
                <Text style={subTitleStyle} color="aliceblue" m="0">
                  Zona Metropolitana de
                </Text>
                <Text style={subTitleStyle} color="orange.500" m="0">
                  <b>Monterrey</b>
                </Text>
              </div>
            </div>
            <div ref={containerRef}>
              <Text
                color="gray.100"
                fontSize={isMobile ? "sm" : "1.5dvw"}
                style={textStyle}
              >
                <b><u>Los recursos de la metropolis son limitados</u></b><br></br>
                En las últimas tres décadas, la mancha urbana de Monterrey ha
                experimentado un <b>crecimiento exponencial, triplicándose</b> en tamaño.
                Este desarrollo, si bien evidencia el dinamismo de la ciudad,
                también conlleva riesgos ambientales, económicos y sociales. Los
                recursos urbanos y ambientales, que son esenciales para el
                bienestar de la comunidad, <b>son finitos</b> y deben manejarse con
                responsabilidad.
              </Text>
              <Text
                color="gray.100"
                fontSize={isMobile ? "sm" : "1.5dvw"}
                style={textStyle}
              >
                <b><u>Crecimiento sin planeación</u></b><br></br>
                <b>La 'mancha urbana'</b> se refiere a la expansión continua de la
                ciudad en términos de construcción y desarrollo. En este contexto,
                es crucial destacar que esta expansión no planificada y
                descontrolada requiere una <b>reconsideración urgente.</b>
              </Text>
              <Text
                color="gray.100"
                fontSize={isMobile ? "sm" : "1.5dvw"}
                style={textStyle}
              >
                <b><u>Visibilización, propuestas y acción colectiva</u></b><br></br>
                La <b>finitud de los recursos</b> urbanos, ambientales y la
                expansión <b>aparentemente 'infinita'</b> de la ciudad, nos hace
                plantearnos diversas preguntas fundamentales sobre la
                sostenibilidad y la gestión responsable de nuestro entorno.
                Enfrentar estos desafíos requiere un <b>enfoque reflexivo y acciones
                concertadas</b> para garantizar un futuro sostenible para la comunidad
                y el entorno en la Zona Metropolitana de Monterrey.
              </Text>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            margin: "10px",
            display: "grid",
          }}
        >
          <Tooltip
            label="Acerca del Equipo"
            hasArrow
            padding="0.5rem"
            bg="gray.700"
            fontSize="xs"
            borderRadius="md"
            placement="right"
          >
            <Link to="/equipo">
              <IconButton
                size="sm"
                isRound={true}
                icon={<MdPeople />}
                variant="solid"
                style={{ marginBottom: "5px" }}
                colorScheme="blackAlpha"
              />
            </Link>
          </Tooltip>
          <Tooltip
            label="Descarga de Datos"
            hasArrow
            padding="0.5rem"
            bg="gray.700"
            fontSize="xs"
            borderRadius="md"
            placement="right"
          >
            <Link to="/descargas">
              <IconButton
                size="sm"
                isRound={true}
                icon={<MdDownload />}
                variant="solid"
                style={{ marginBottom: "5px" }}
                colorScheme="blackAlpha"
              />
            </Link>
          </Tooltip>
        </div>
        <Cards />

      </div>
    </div>
  );
};

export default Home;
