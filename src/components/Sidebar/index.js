import { Box, Button, Icon, Tooltip } from "@chakra-ui/react";
import { MdHome, MdDirectionsCar, MdOutlineAttachMoney } from "react-icons/md";
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { GiInjustice, GiRobber } from "react-icons/gi";
import { FaPeopleArrows } from "react-icons/fa";

import "./index.css";

export const sectionsInfo = {
  "expansion-urbana": {
    title: "¿Hacia dónde crecemos?",
    color: "brown",
    icon: FaPeopleArrows,
  },
  empleo: {
    title: "¿En dónde trabajamos?",
    color: "brown2",
    icon: HiMiniBuildingOffice,
  },
  transporte: {
    title: "¿Cómo nos movemos?",
    color: "orange",
    icon: MdDirectionsCar,
  },
  vivienda: {
    title: "¿Por qué nos expandimos?",
    color: "yellow",
    icon: MdHome,
  },
  segregacion: { title: "¿Qué nos segrega?", color: "sage", icon: GiInjustice },
  delincuencia: {
    title: "¿Qué causa inseguridad?",
    color: "green",
    icon: GiRobber,
  },
  costos: {
    title: "¿Cuánto cuesta expandirnos?",
    color: "teal",
    icon: MdOutlineAttachMoney,
  },
};

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
              bgColor={`${sectionsInfo[k].color}.300`}
              isActive={section === k}
              onClick={() => goToSection(k)}
            >
              <Icon as={sectionsInfo[k].icon} boxSize={7} color="white" />
            </Button>
          </Tooltip>
        ))}
      </div>
    </Box>
  );
};
