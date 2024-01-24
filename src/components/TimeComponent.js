import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import _ from "lodash";

export function SliderHTML({
  time,
  min,
  max,
  step,
  defaultValue,
  togglePlay,
  isPlaying,
  handleSliderChange,
  marks,
}) {
  return (
    <div
      style={{
        position: "relative",
        bottom: "60px",
        left: 0,
        width: "100%",
        height: "50px",
        padding: "0 20px",
      }}
    >
      <Box
        bgColor="orange.100"
        borderRadius="16px"
        borderWidth={1}
        borderColor="orange.200"
        style={{ display: "flex", width: "100%" }}
      >
        <IconButton
          colorScheme="orange"
          isRound={true}
          onClick={togglePlay}
          size="xs"
          icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
        />
        <Slider
          aria-label="slider-ex-1"
          id="slider"
          defaultValue={defaultValue || min}
          min={min}
          step={step}
          max={max}
          value={time}
          onChange={(value) => handleSliderChange(value)}
          mr="4"
          ml="3"
        >
          {marks.map(({ value, label }, i) => (
            <SliderMark
              key={value}
              value={value}
              mt="5"
              ml={`-${label.length * 3.5}px`}
              fontSize="xs"
              style={{ textWrap: "nowrap" }}
            >
              {label}
            </SliderMark>
          ))}
          <SliderTrack bg="orange.200">
            <SliderFilledTrack bg="orange.500" />
          </SliderTrack>
          <SliderThumb boxSize={3} bgColor="orange.600" />
        </Slider>
      </Box>
    </div>
  );
}

export function TimeComponentClean(
  startTime,
  endTime,
  step,
  frameInterval = 0,
  animationType,
  initialTime = undefined
) {
  const [time, setTime] = useState(initialTime || startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    let animationFrame;

    const animateFluid = (now) => {
      const deltaTime = now - lastFrameTime.current;
      const stepTime = (step * deltaTime) / frameInterval;
      setTime((prevTime) => {
        const nextTime = prevTime + stepTime;
        return nextTime > endTime
          ? startTime
          : nextTime < startTime
          ? endTime
          : nextTime;
      });
      lastFrameTime.current = now;
      animationFrame = requestAnimationFrame(animateFluid);
    };

    const animateWithFrames = () => {
      setTime((prevTime) => {
        const nextTime = prevTime + step;
        return nextTime > endTime ? startTime : nextTime;
      });
      animationFrame = setTimeout(() => {
        requestAnimationFrame(animateWithFrames);
      }, frameInterval);
    };

    if (isPlaying) {
      if (animationType) {
        animationFrame = requestAnimationFrame(animateFluid);
      } else {
        animateWithFrames();
      }
    } else {
      cancelAnimationFrame(animationFrame);
      clearTimeout(animationFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(animationFrame);
    };
  }, [isPlaying, startTime, endTime, step, frameInterval, animationType]);

  const handleSliderChange = (newTime) => {
    setTime(newTime);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return { time, isPlaying, handleSliderChange, togglePlay };
}
