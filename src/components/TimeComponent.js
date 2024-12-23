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
        bottom: isMobile ? "60px" : "min(6dvh, 4dvw)",
        left: 0,
        width: "100%",
        padding: "0 20px",
      }}
    >
      <Box
        bgColor={`${color}.100`}
        borderWidth={1}
        borderColor={`${color}.200`}
        style={{ display: "flex", width: "100%" }}
        borderRadius={isMobile ? "25px" : "min(3dvh, 2dvw)"}
      >
        <IconButton
          minW={isMobile ? "25px" : "min(3dvh, 2dvw)"}
          minH={isMobile ? "25px" : "min(3dvh, 2dvw)"}
          maxW={isMobile ? "25px" : "min(3dvh, 2dvw)"}
          maxH={isMobile ? "25px" : "min(3dvh, 2dvw)"}
          fontSize={isMobile ? "12px" : "min(1.8dvh, 0.9dvw)"}
          colorScheme={color}
          textColor="white"
          isRound={true}
          onClick={togglePlay}
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
              mt={isMobile ? "5" : "min(2.5dvh, 1.7dvw)"}
              style={{
                textWrap: "nowrap",
                fontSize: isMobile ? "8px" : "min(1.8dvh, 0.9dvw)",
                transform:
                  i == 0
                    ? "translateX(0%)"
                    : i == marks.length - 1
                    ? "translateX(-90%)"
                    : "translateX(-50%)",
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
  initialTime = undefined,
  initialValue = false
) {
  const [time, setTime] = useState(initialTime || startTime);
  const [isPlaying, setIsPlaying] = useState(initialValue);
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
