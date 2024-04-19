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
} from "@chakra-ui/react";
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
  } from '@chakra-ui/react'

export const LegendSlider = ({ title, color, description, children, note="" }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");


//   if (isMobile) {
//     return (
//       <CustomLegendMobile
//         title={title}
//         color={color}
//         description={description}
//         children={children}
//       />
//     );
//   }
  return (
    <Box
      borderRadius="md"
      borderColor={`${color}.200`}
      borderWidth="0.08rem"
      className="legend-container"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "5px",
          marginTop: "5px",
        }}
      >
        <Tooltip label={description} placement="top" hasArrow gutter={12}>
          <Heading color="gray.700" fontSize="0.9dvw">
            <InfoIcon
              boxSize={2.5}
              color="gray.400"
              style={{ cursor: "pointer" }}
              mr="1"
            />
            {title}
          </Heading>
        </Tooltip>
      </div>
      <TableContainer>
        <Table variant="unstyled">
          <Tbody>{children}</Tbody>
        </Table>
      </TableContainer>
      <b><p style={{fontSize:"0.6dvw"}}>
        {note}
        </p></b>
    </Box>
  );
};

export const LegendSliderItem = ({ layerId, opacity, onChange }) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const handleSliderChange = (val) => {
    onChange(layerId, val);
  };
  
  return (
    <Tr key={layerId} style={{ width: '35dvw', height: '10dvh' }}>
      <Td style={{ width: '10dvw' }}>
        <p style={{ textAlign: 'center' }}>{layerId}</p>
        <Slider
          aria-label={`slider-${layerId}`}
          defaultValue={opacity ?? 100} // Use provided opacity or default to 100
          min={1}
          max={100}
          onChange={handleSliderChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </Td>
    </Tr>
  );
};
