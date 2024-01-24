import { Box, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "./index.css";
import { Link } from "react-router-dom";

export const Header = ({ section, color, title }) => (
  <Box bgColor={`${color}.500`} className="headerContainer">
    <Link to="/">
      <img
        className="headerImage"
        src="https://tec-expansion-urbana-p.s3.amazonaws.com/general/Oficial.png"
        alt="Tec de Monterrey"
      />
    </Link>
    <Box className="titleContainer" bgColor={`${color}.500`}>
      <Heading
        className="title"
        color={`${color}.600`}
        borderColor={`${color}.500`}
        fontSize={{ md: "0.9rem", lg: "1.1rem", sm: "0.6rem" }}
      >
        <motion.div
          key={section}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
        >
          {title}
        </motion.div>
      </Heading>
    </Box>
  </Box>
);

export const HeaderMobile = ({ color, title, open, setOpen }) => {
  return (
    <Box className="titleContainerMobile" bgColor={`${color}.500`}>
      <Heading
        className="titleMobile"
        color="white"
        bg={`${color}.500`}
        borderColor={`${color}.500`}
        fontSize="0.7rem"
        onClick={() => setOpen(!open)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
        >
          {title}
        </motion.div>
      </Heading>
    </Box>
  );
};
