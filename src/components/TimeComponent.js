import { useState, useEffect, useRef } from 'react';

export function TimeComponent (startTime, endTime, step)
{
    const [time, setTime] = useState(startTime);
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationTime, setAnimationTime] = useState(startTime);
    //const animationFrameRef = useRef();

    useEffect(() => {
        let animationFrame;
        const animate = () => {
        //setTime((prevTime) => (prevTime + 2) % 2023);
        //setTime((prevTime) => (prevTime + 1) % (2023) + 1990);
        setTime((prevTime) => (prevTime + step) % (endTime - startTime) + startTime);
        setAnimationTime(time); // Actualizar animationTime con el valor actualizado de time

        console.log(time);
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