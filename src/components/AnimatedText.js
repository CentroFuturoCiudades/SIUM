import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const AnimatedText = ({
  children,
  opacity = 0.5,
  duration = 0.5,
  x = 0,
  y = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const animate = isInView
    ? { opacity: 1, x: 0, y: 0, transition: { duration } }
    : {};
  return (
    <motion.div ref={ref} initial={{ opacity, x, y }} animate={animate}>
      {children}
    </motion.div>
  );
};
