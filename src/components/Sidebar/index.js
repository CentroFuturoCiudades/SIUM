import {
  Box,
  Button,
  Icon,
  IconButton,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";

import "./index.css";
import { sectionsInfo } from "../../utils/constants";
import { MdDownload, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";
import { VscTriangleLeft } from "react-icons/vsc";

export const Sidebar = ({ section, setSection }) => {
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
        label="Acerca del Equipo"
        hasArrow
        padding="0.5rem"
        bg="gray.700"
        fontSize="md"
        borderRadius="md"
        placement="right"
      >
        <Link to="/equipo">
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
          label="Acerca del Equipo"
          hasArrow
          padding="0.5rem"
          bg="gray.700"
          fontSize="md"
          borderRadius="md"
          placement="right"
        >
          <Link to="/equipo" style={{ margin: "auto" }}>
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
