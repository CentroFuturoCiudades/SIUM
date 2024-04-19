import {
  Box,
  Button,
  Icon,
  IconButton,
  Spacer,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";

import "./index.css";
import { sectionsInfo } from "../../utils/constants";
import { MdDownload, MdPeople, MdMail } from "react-icons/md";
import { Link } from "react-router-dom";
import { VscTriangleLeft } from "react-icons/vsc";

export const Sidebar = ({ section, setSection }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  function goToSection(url) {
    const el = document.getElementById(url);
    if (el) {
      setSection(url);
      el.scrollIntoView();
    }
  }
  return (
    <Box className="sidebar" bgColor="blackAlpha.400">
      <div className="sidebarContainer">
        <Link to="/">
          <Button
            className="sidebarItem"
            variant="solid"
            colorScheme="blackAlpha"
            bgColor="blackAlpha.400"
            style={{ height: isMobile ? "40px" : "min(7dvh, 3dvw)" }}
          >
            <Icon
              as={VscTriangleLeft}
              color="white"
              style={{
                height: "min(3dvh, 1dvw)",
                width: "min(3dvh, 1dvw)",
              }}
            />
          </Button>
        </Link>
        {Object.keys(sectionsInfo).map((k) => (
          <Tooltip
            key={k}
            label={sectionsInfo[k].title}
            hasArrow
            padding="0.5rem"
            bg="gray.700"
            fontSize="md"
            borderRadius="md"
            placement="right"
          >
            <Button
              key={k}
              className="sidebarItem"
              variant="solid"
              colorScheme={sectionsInfo[k].color}
              bgColor={`${sectionsInfo[k].color}.400`}
              isActive={section === k}
              onClick={() => goToSection(k)}
              style={{ height: isMobile ? "40px" : "min(7dvh, 3dvw)" }}
            >
              <Icon
                as={sectionsInfo[k].icon}
                color="white"
                style={{
                  height: "min(4dvh, 1.5dvw)",
                  width: "min(4dvh, 1.5dvw)",
                }}
              />
            </Button>
          </Tooltip>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <Tooltip
        label="Enviar comentario"
        hasArrow
        padding="0.5rem"
        bg="gray.700"
        fontSize="md"
        borderRadius="md"
        placement="right"
      >
        <a href="https://forms.office.com/r/HtvBBujdAe">
          <IconButton
            isRound={true}
            icon={
              <MdMail
                style={{ width: "min(2dvh, 1dvw)", height: "min(2dvh, 1dvw)" }}
              />
            }
            variant="solid"
            colorScheme="blackAlpha"
            style={{
              minWidth: "min(6dvh, 2dvw)",
              height: "min(6dvh, 2dvw)",
              margin: "0.2rem",
            }}
          />
        </a>
      </Tooltip>
      <Tooltip
        label="Acerca del Equipo"
        hasArrow
        padding="0.5rem"
        bg="gray.700"
        fontSize="md"
        borderRadius="md"
        placement="right"
      >
        <Link to="/acerca">
          <IconButton
            isRound={true}
            icon={
              <MdPeople
                style={{ width: "min(2dvh, 1dvw)", height: "min(2dvh, 1dvw)" }}
              />
            }
            variant="solid"
            colorScheme="blackAlpha"
            style={{
              minWidth: "min(6dvh, 2dvw)",
              height: "min(6dvh, 2dvw)",
              margin: "0.2rem",
            }}
          />
        </Link>
      </Tooltip>
      <Tooltip
        label="Descarga de Datos"
        hasArrow
        padding="0.5rem"
        bg="gray.700"
        fontSize="md"
        borderRadius="md"
        placement="right"
      >
        <Link to="/descargas">
          <IconButton
            isRound={true}
            icon={
              <MdDownload
                style={{ width: "min(2dvh, 1dvw)", height: "min(2dvh, 1dvw)" }}
              />
            }
            variant="solid"
            colorScheme="blackAlpha"
            style={{
              minWidth: "min(6dvh, 2dvw)",
              height: "min(6dvh, 2dvw)",
              margin: "0.2rem",
            }}
          />
        </Link>
      </Tooltip>
    </Box>
  );
};

export const BarMobile = ({ section, setSection }) => {
  function goToSection(url) {
    setSection(url);
  }
  return (
    <Box className="sidebarMobile" bgColor="blackAlpha.400">
      <div className="sidebarContainerMobile">
        <Link to="/">
          <Button
            className="sidebarItem"
            variant="solid"
            colorScheme="blackAlpha"
            bgColor="blackAlpha.400"
            style={{ height: "40px" }}
          >
            <Icon
              as={VscTriangleLeft}
              color="white"
              style={{
                height: "10px",
                width: "10px"
              }}
            />
          </Button>
        </Link>
        {Object.keys(sectionsInfo).map((k) => (
          <Button
            key={k}
            className="sidebarItem"
            size="md"
            variant="solid"
            colorScheme={sectionsInfo[k].color}
            bgColor={`${sectionsInfo[k].color}.300`}
            isActive={section === k}
            onClick={() => goToSection(k)}
            style={{ padding: "0.8rem" }}
          >
            <Icon as={sectionsInfo[k].icon} boxSize={5} color="white" />
          </Button>
        ))}
        <div style={{ marginLeft: "20px" }}></div>
        <Tooltip
          label="Enviar comentario"
          hasArrow
          padding="0.5rem"
          bg="gray.700"
          fontSize="md"
          borderRadius="md"
          placement="right"
        >
          <a href="https://forms.office.com/r/HtvBBujdAe" style={{ margin: "auto" }}>
            <IconButton
              size="sm"
              isRound={true}
              icon={<MdMail />}
              variant="solid"
              style={{ marginRight: "5px" }}
              colorScheme="blackAlpha"
            />
          </a>
        </Tooltip>
        <Tooltip
          label="Acerca del Equipo"
          hasArrow
          padding="0.5rem"
          bg="gray.700"
          fontSize="md"
          borderRadius="md"
          placement="right"
        >
          <Link to="/acerca" style={{ margin: "auto" }}>
            <IconButton
              size="sm"
              isRound={true}
              icon={<MdPeople />}
              variant="solid"
              style={{ marginRight: "5px" }}
              colorScheme="blackAlpha"
            />
          </Link>
        </Tooltip>
        <Tooltip
          label="Descarga de Datos"
          hasArrow
          padding="0.5rem"
          bg="gray.700"
          fontSize="md"
          borderRadius="md"
          placement="right"
        >
          <Link to="/descargas" style={{ margin: "auto" }}>
            <IconButton
              size="sm"
              isRound={true}
              icon={<MdDownload />}
              variant="solid"
              style={{ marginRight: "5px" }}
              colorScheme="blackAlpha"
            />
          </Link>
        </Tooltip>
      </div>
    </Box>
  );
};
