import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Text,
  Tooltip,
  useMediaQuery,
  Flex,
  Box,
  Button,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Cards from "./Cards";
import { BitmapLayer, DeckGL, GeoJsonLayer, TileLayer } from "deck.gl";
import useWindowDimensions, {
  MANCHA_URBANA_URL,
  SATELLITE_IMAGES_URL,
  POBLACION_SUPERFICIE_CONST_URL,
  useFetch,
} from "../utils/constants";
import { Link } from "react-router-dom";
import { MdDownload, MdPeople, MdMail } from "react-icons/md";
import { BiSolidChevronsDown } from "react-icons/bi";
import { HamburgerIcon } from "@chakra-ui/icons";

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
const minMultiplier = 0.88;
const maxWidth = 1400;
const maxMultiplier = 1;
const mapOpacity = 0.25;

const Map = ({ year }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { width } = useWindowDimensions();
  const { data } = useFetch(MANCHA_URBANA_URL);
  const { data: dataPoblacionSuperficieConst } = useFetch(
    POBLACION_SUPERFICIE_CONST_URL
  );
  const [densidad1990, setDensidad1990] = useState(0);

  const tileLayerURL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const multiplier =
    minMultiplier +
    ((maxMultiplier - minMultiplier) / (maxWidth - minWidth)) *
      (width - minWidth);
  const image = SATELLITE_IMAGES_URL(year || 1990);

  useEffect(() => {
    if (dataPoblacionSuperficieConst) {
      const densidad =
        dataPoblacionSuperficieConst[0].population /
        (dataPoblacionSuperficieConst[0].mts_built / 1000000);
      setDensidad1990(densidad);
    }
  }, [dataPoblacionSuperficieConst]);

  function calculoDensidadReducida(year) {
    const index = (year - 1990) / 5;
    const densidad2 =
      dataPoblacionSuperficieConst[index].population /
      (dataPoblacionSuperficieConst[index].mts_built / 1000000);
    const porcentajeReducido =
      ((densidad1990 - densidad2) / densidad1990).toFixed(2) * 100;
    return porcentajeReducido;
  }

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
            .then((blob) => createImageBitmap(blob))
            .then((imageBitmap) => {
              let canvas = document.createElement("canvas");
              canvas.width = imageBitmap.width;
              canvas.height = imageBitmap.height;
              let ctx = canvas.getContext("2d");
              ctx.drawImage(imageBitmap, 0, 0);
              let imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );
              let data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                data[i] *= mapOpacity; // Red
                data[i + 1] *= mapOpacity; // Green
                data[i + 2] *= mapOpacity; // Blue
              }
              ctx.putImageData(imageData, 0, 0);
              return createImageBitmap(canvas);
            });
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
          +d.properties.year === 1990
            ? [200, 200, 200, 80]
            : [106, 46, 171, 120]
        }
        stroked={true}
      />

      <div style={yearStyle}>
        <div style={{ height: "100%" }}>{/* Div vacío */}</div>

        <div style={{ height: "100%" }}>
          {year && dataPoblacionSuperficieConst ? (
            <>
              {dataPoblacionSuperficieConst ? (
                <>
                  <Text
                    fontSize={isMobile ? "8px" : "min(2.4dvh, 1.2dvw)"}
                    color="white"
                  >
                    <b>
                      {`${(
                        dataPoblacionSuperficieConst[0].population / 1000000
                      ).toFixed(1)} millones de personas`}
                    </b>
                  </Text>
                  <Text
                    fontSize={isMobile ? "8px" : "min(2.4dvh, 1.2dvw)"}
                    color="white"
                  >
                    <b>
                      {`${(
                        dataPoblacionSuperficieConst[0].mts_built / 1000000
                      ).toFixed(0)} km`}{" "}
                      <sup>2</sup>
                    </b>
                  </Text>
                </>
              ) : (
                ""
              )}
              <Text
                fontFamily="Poppins"
                fontSize={isMobile ? "25px" : "min(7dvh, 3.5dvw)"}
                color="white"
                mt="1"
                style={{ lineHeight: 1 }}
              >
                <b>1990</b>
              </Text>
            </>
          ) : null}
          {year > 1990 ? (
            <>
              <Text
                fontFamily="Poppins"
                fontSize={isMobile ? "25px" : "min(7dvh, 3.5dvw)"}
                color="#783CB4"
                mb="1"
                style={{
                  lineHeight: 1,
                  WebkitTextStrokeWidth: "0.1px",
                  WebkitTextStrokeColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <b>{year}</b>
              </Text>
              {dataPoblacionSuperficieConst ? (
                <>
                  <Text
                    fontSize={isMobile ? "8px" : "min(2.4dvh, 1.2dvw)"}
                    color="#783CB4"
                    style={{
                      WebkitTextStrokeWidth: "0.1px",
                      WebkitTextStrokeColor: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <b>
                      {`${(
                        dataPoblacionSuperficieConst[(year - 1990) / 5]
                          .mts_built / 1000000
                      ).toFixed(0)} km`}{" "}
                      <sup>2</sup>
                    </b>
                  </Text>
                  <Text
                    fontSize={isMobile ? "8px" : "min(2.4dvh, 1.2dvw)"}
                    color="#783CB4"
                    style={{
                      WebkitTextStrokeWidth: "0.1px",
                      WebkitTextStrokeColor: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    <b>
                      {`${(
                        dataPoblacionSuperficieConst[(year - 1990) / 5]
                          .population / 1000000
                      ).toFixed(1)} millones de personas`}
                    </b>
                  </Text>
                  {/* add drop shadow */}
                  <Text
                    fontSize={isMobile ? "8px" : "min(2.4dvh, 1.2dvw)"}
                    color="#783CB4"
                  >
                    <Icon
                      as={BiSolidChevronsDown}
                      color="red.600"
                      boxSize={isMobile ? "8px" : "min(2dvh, 1dvw)"}
                      mx={isMobile ? "0.5" : "2"}
                    />
                    <b
                      style={{
                        WebkitTextStrokeWidth: "0.1px",
                        WebkitTextStrokeColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {`${calculoDensidadReducida(year)}% menos densidad`}
                    </b>
                  </Text>
                </>
              ) : (
                ""
              )}
            </>
          ) : null}
        </div>

        {year ? (
          <>
            <div style={noteStyle}>
              <Text
                fontSize={isMobile ? "6px" : "xs"}
                style={{ color: "white", alignItems: "end" }}
              >
                *Superficie construida con techo
              </Text>
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
    color: "antiquewhite", // Ajusta el color del texto
    textAlign: "left", // Alinea el texto a la izquierda
    marginLeft: "1rem", // Elimina el margen predeterminado
  };
  const subTitleStyle = {
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
          position="absolute"
          bg="transparent"
          w="100dvw"
          justify="space-between"
          display="flex"
          h="10dvh"
          p={2}
        >
          {/* Logos */}
          <Flex
            w={isMobile ? "calc(100dvw - 40px)" : "70%"}
            style={{ display: "flex", alignItems: "center" }}
          >
            {["SIUM.png", "femsa.png", "tec.png", "fundacion_femsa.png"].map(
              (imagen, index) => (
                <img
                  key={index}
                  className="headerImage"
                  src={`/${imagen}`}
                  alt="SIUM"
                  style={{
                    padding: "5px",
                    height: "10dvh",
                    width: "25%",
                    maxWidth: isMobile ? "100%" : "200px",
                    objectFit: "contain",
                  }}
                />
              )
            )}
          </Flex>

          {/* Botones */}
          <Flex w={isMobile ? "40px" : "25%"} justify="end" align="center">
            {isMobile ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  size="sm"
                  colorScheme="whiteAlpha"
                />
                <MenuList>
                  <MenuItem as="a" href="/acerca#objetivo" minH="50px">
                    Objetivo
                  </MenuItem>
                  <MenuItem as="a" href="/acerca#equipo" minH="50px">
                    Equipo
                  </MenuItem>
                  <MenuItem as="a" href="/descargas" minH="50px">
                    Descargas
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as="a"
                  href="/acerca#objetivo"
                  variant="text"
                  color="white"
                  fontSize="min(2.4dvh, 1.2dvw)"
                >
                  Objetivo
                </Button>
                <Button
                  as="a"
                  href="/acerca#equipo"
                  variant="text"
                  color="white"
                  fontSize="min(2.4dvh, 1.2dvw)"
                >
                  Equipo
                </Button>
                <Button
                  as="a"
                  href="/descargas"
                  variant="text"
                  color="white"
                  fontSize="min(2.4dvh, 1.2dvw)"
                >
                  Descargas
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        <div>
          <Map year={!isInitial ? year : undefined} />
          <div style={{ display: "grid" }}>
            <div style={containerStyle}>
              <div>
                <Heading
                  style={titleStyle}
                  fontWeight="500"
                  fontSize={isMobile ? "12dvw" : "min(26dvh, 13dvw)"}
                >
                  CIUDAD FINITA
                </Heading>
                <Text
                  style={subTitleStyle}
                  fontSize={isMobile ? "4dvw" : "min(6dvh, 3dvw)"}
                  color="aliceblue"
                  m="0"
                >
                  Expansión urbana en la
                </Text>
                <Text
                  style={subTitleStyle}
                  fontSize={isMobile ? "4dvw" : "min(6dvh, 3dvw)"}
                  color="aliceblue"
                  m="0"
                >
                  Zona Metropolitana de
                </Text>
                <Text
                  style={subTitleStyle}
                  fontSize={isMobile ? "4dvw" : "min(6dvh, 3dvw)"}
                  color="orange.500"
                  m="0"
                >
                  <b>Monterrey</b>
                </Text>
              </div>
            </div>
            <div ref={containerRef}>
              <div style={textStyle}>
                <Heading
                  color="orange.500"
                  fontSize={isMobile ? "lg" : "min(3.4dvh, 1.7dvw)"}
                >
                  Los recursos de la metrópolis son limitados
                </Heading>
                <br></br>
                <Text
                  color="gray.100"
                  fontSize={isMobile ? "xs" : "min(3dvh, 1.5dvw)"}
                >
                  En las últimas tres décadas, la mancha urbana de Monterrey ha
                  experimentado un <b>crecimiento exponencial, triplicándose</b>{" "}
                  en tamaño. Este desarrollo, si bien evidencia el dinamismo de
                  la ciudad, también conlleva riesgos ambientales, económicos y
                  sociales. Los recursos urbanos y ambientales, que son
                  esenciales para el bienestar de la comunidad,{" "}
                  <b>son finitos</b> y deben manejarse con responsabilidad.
                </Text>
              </div>
              <div style={textStyle}>
                <Heading
                  color="orange.500"
                  fontSize={isMobile ? "lg" : "min(3.4dvh, 1.7dvw)"}
                >
                  Crecimiento sin planeación
                </Heading>
                <br></br>
                <Text
                  color="gray.100"
                  fontSize={isMobile ? "xs" : "min(3dvh, 1.5dvw)"}
                >
                  <b>La 'mancha urbana'</b> se refiere a la expansión continua
                  de la ciudad en términos de construcción y desarrollo. En este
                  contexto, es crucial destacar que esta expansión no
                  planificada y descontrolada requiere una{" "}
                  <b>reconsideración urgente.</b>
                </Text>
              </div>
              <div style={textStyle}>
                <Heading
                  color="orange.500"
                  fontSize={isMobile ? "lg" : "min(3.4dvh, 1.7dvw)"}
                >
                  Visibilización, propuestas y acción colectiva
                </Heading>
                <br></br>
                <Text
                  color="gray.100"
                  fontSize={isMobile ? "xs" : "min(3dvh, 1.5dvw)"}
                >
                  La <b>finitud de los recursos</b> urbanos, ambientales y la
                  expansión <b>aparentemente 'infinita'</b> de la ciudad, nos
                  hace plantearnos diversas preguntas fundamentales sobre la
                  sostenibilidad y la gestión responsable de nuestro entorno.
                  Enfrentar estos desafíos requiere un{" "}
                  <b>enfoque reflexivo y acciones concertadas</b> para
                  garantizar un futuro sostenible para la comunidad y el entorno
                  en la Zona Metropolitana de Monterrey.
                </Text>
              </div>
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
            label="Enviar comentario"
            hasArrow
            padding="0.5rem"
            bg="gray.700"
            fontSize="xs"
            borderRadius="md"
            placement="right"
          >
            <a href="https://forms.office.com/r/HtvBBujdAe">
              <IconButton
                size="sm"
                isRound={true}
                icon={<MdMail />}
                variant="solid"
                style={{ marginBottom: "5px" }}
                colorScheme="blackAlpha"
              />
            </a>
          </Tooltip>
        </div>
        <Cards />
      </div>
    </div>
  );
};

export default Home;
