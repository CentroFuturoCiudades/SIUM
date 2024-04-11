import { Box, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "./index.css";
import { Link } from "react-router-dom";

export const Header = ({ section, color, title }) => (
  <Box bgColor={`${color}.500`} className="headerContainer">
    <Link
      as={"div"}
      to="/"
      style={{
        display: "flex",
        justifyContent: "space-around",
        height: "8dvh",
        width: "100%",
      }}
    >
      <img
        className="headerImage"
        src="SIUM.png"
        alt="SIUM"
        style={{
          padding: "5px",
          maxWidth: "33%",
          maxHeight: "100%",
          height: "auto",
          width: "auto",
          objectFit: "contain",
        }}
      />
      <img
        className="headerImage"
        src="tec.png"
        alt="Tec de Monterrey"
        style={{
          padding: "5px",
          maxWidth: "33%",
          maxHeight: "100%",
          height: "auto",
          width: "auto",
          objectFit: "contain",
        }}
      />
      <img
        className="headerImage"
        src="femsa.png"
        alt="FEMSA"
        style={{
          padding: "5px",
          maxWidth: "33%",
          maxHeight: "100%",
          height: "auto",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </Link>
    <Box className="titleContainer" bgColor={`${color}.500`}>
      <Heading
        className="title"
        color={`${color}.500`}
        borderColor={`${color}.500`}
        style={{ fontSize: "min(2.4dvh, 1.2dvw)" }}
      >
        <motion.div
          key={section}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.7 },
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
    <Heading
      className="titleMobile"
      color="white"
      bg={`${color}.500`}
      borderColor={`${color}.500`}
      fontSize="0.8rem"
      onClick={setOpen}
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
  );
};
