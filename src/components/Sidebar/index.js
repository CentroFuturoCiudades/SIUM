import { Box, Button, Icon, Tooltip } from "@chakra-ui/react";

import "./index.css";
import { sectionsInfo } from "../../utils/constants";

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
