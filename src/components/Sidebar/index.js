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
              size="lg"
              variant="solid"
              colorScheme={sectionsInfo[k].color}
              bgColor={`${sectionsInfo[k].color}.400`}
              isActive={section === k}
              onClick={() => goToSection(k)}
            >
              <Icon as={sectionsInfo[k].icon} boxSize={7} color="white" />
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
        fontSize="md"
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
