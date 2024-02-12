import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import _ from "lodash";
import { useCardContext } from "../views/Problematica";

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
  const { color } = useCardContext();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
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
        bgColor={`${color}.100`}
        borderRadius="16px"
        borderWidth={1}
        borderColor={`${color}.200`}
        style={{ display: "flex", width: "100%" }}
      >
        <IconButton
          colorScheme={color}
          textColor="white"
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
              style={{
                textWrap: "nowrap",
                fontSize: isMobile ? "1.6dvw" : "1dvw",
                transform: "translateX(-50%)",
                color: "#464646",
              }}
            >
              {label}
            </SliderMark>
          ))}
          <SliderTrack bg={`${color}.200`}>
            <SliderFilledTrack bg={`${color}.500`} />
          </SliderTrack>
          <SliderThumb boxSize={3} bgColor={`${color}.600`} />
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
