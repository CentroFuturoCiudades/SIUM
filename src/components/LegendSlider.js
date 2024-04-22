import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tooltip,
  Tr,
  useMediaQuery,
  Text,
  SliderMark,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";

export const LegendSlider = ({ title, children }) => {
  return (
    <Box
      borderRadius="md"
      borderColor="purple.100"
      borderWidth="0.08rem"
      className="legend-container"
      right="1.5dvh !important"
      left="auto !important"
      top="1.5dvh !important"
      bottom="auto !important"
      maxH="25%"
      style={{
        width: "min-content",
        overflowY: "scroll",
        borderRadius: "0.5dvh",
        zIndex: "100",
      }}
    >
      <div>
        <Heading color="gray.700" fontSize="min(1.8dvh, 0.9dvw)" my="1dvh">
          {title}
        </Heading>
        <TableContainer>
          <Table size="sm" variant="unstyled">
            <Tbody>{children}</Tbody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export const LegendSliderItem = ({ layerId, opacity, onOpacityChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const handleSliderChange = (val) => {
    onOpacityChange(layerId, val);
  };

  return (
    <Tr key={layerId}>
      <Td py="0.5dvh">
        <Text textAlign="left" fontSize="min(1.6dvh, 0.8dvw)">
          {layerId}
        </Text>
        <Slider
          colorScheme="purple"
          my="0.5dvh"
          aria-label={`slider-${layerId}`}
          defaultValue={opacity ?? 100}
          min={10}
          max={100}
          step={10}
          onChange={handleSliderChange}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg="purple.300"
            color="white"
            placement="bottom"
            isOpen={showTooltip}
            label={`${opacity ?? 100}%`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
      </Td>
      <Td>
        <Checkbox colorScheme="purple"></Checkbox>
      </Td>
    </Tr>
  );
};
