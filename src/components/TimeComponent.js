import { useState, useEffect, useRef } from 'react';
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
import { Legend } from "./Legend";

export function SliderHTML({time,
  min,
  max,
  step,
  title = "Default Title",
  togglePlay,
  isPlaying,
  handleSliderChange,
  marks,
  legendItems = [],
})
{
  return (
    <>
    <div>
    <Legend title={title} legendItems={legendItems} />
    </div>
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: 0,
          width: "100%",
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
            defaultValue={min}
            min={min}
            step={step}
            max={max}
            value={time}
            onChange={(value) => handleSliderChange(value)}
            mr="4"
            ml="3"
          >
            {marks.map(({ value, label }) => (
              <SliderMark
                key={value}
                value={value}
                textAlign="center"
                mt="5"
                ml="-3"
                fontSize="xs"
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
    </>
  );
}

export function TimeComponent (startTime, endTime, step)
{
    const [time, setTime] = useState(startTime);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationTime, setAnimationTime] = useState(startTime);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
          setTime((prevTime) => Math.round((prevTime + step) % ((endTime - startTime)) + startTime));
          setAnimationTime(time); // Actualizar animationTime con el valor actualizado de time

          console.log("Time con round", time);
          animationFrame = requestAnimationFrame(animate);

        };

        if (isPlaying) {
        animate();
        } else {
        cancelAnimationFrame(animationFrame);
        }

        return () => cancelAnimationFrame(animationFrame);
      }, [isPlaying, startTime, endTime, step]);
    
      const handleSliderChange = (newTime) => {
        console.log("New Time del nuevo componente:", newTime); //checar que valor tiene el slider
        setTime(newTime);
        setAnimationTime(newTime);
      };
    
      const togglePlay = () => {
        console.log("New Time del Componente:", time); //checar que valor tiene el slider
        setIsPlaying(!isPlaying);
        setAnimationTime(time);
      };

      return { time, isPlaying, animationTime, handleSliderChange, togglePlay };
}


export function TimeComponentNew(startTime, endTime, step, frameInterval) {
  const [time, setTime] = useState(startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(startTime);
  let animationTimeout;

  useEffect(() => {
    const animate = () => {
      setTime((prevTime) => {
        const nextTime = prevTime + step;
        return nextTime > endTime ? startTime : nextTime;
      });

      setAnimationTime(time);
      console.log("Time con lo nuevo que va al reves", time);

      if (isPlaying) {
        animationTimeout = setTimeout(() => {
          requestAnimationFrame(animate);
        }, frameInterval);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [isPlaying, startTime, endTime, step, frameInterval]);

  const handleSliderChange = (newTime) => {
    console.log("New Time del nuevo componente:", newTime);
    setTime(newTime);
    setAnimationTime(newTime);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAnimationTime(time);
  };

  return { time, isPlaying, animationTime, handleSliderChange, togglePlay };
}


export function TimeComponentClean(startTime, endTime, step, frameInterval=0, animationType) {
  const [time, setTime] = useState(startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(startTime);

  useEffect(() => {
    let animationFrame;
    let animationTimeout;
  
    const animateFluid = () => {
      setTime((prevTime) => Math.round((prevTime + step) % ((endTime - startTime)) + startTime));
      setAnimationTime(time);
      animationFrame = requestAnimationFrame(animateFluid);
    };
  
    const animateWithFrames = () => {
      setTime((prevTime) => {
        const nextTime = prevTime + step;
        return nextTime > endTime ? startTime : nextTime;
      });
      setAnimationTime(time);
      animationTimeout = setTimeout(() => {
        requestAnimationFrame(animateWithFrames);
      }, frameInterval);
    };
  
    if (isPlaying) {
      animationType ? animateFluid() : animateWithFrames();
    } else {
      cancelAnimationFrame(animationFrame);
      clearTimeout(animationTimeout);
    }
  
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(animationTimeout);
    };
  }, [isPlaying, startTime, endTime, step, frameInterval, animationType]);
  
  

  const handleSliderChange = (newTime) => {
    console.log("New Time del nuevo componente:", newTime);
    setTime(newTime);
    setAnimationTime(newTime);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAnimationTime(time);
  };

  return { time, isPlaying, animationTime, handleSliderChange, togglePlay };
}