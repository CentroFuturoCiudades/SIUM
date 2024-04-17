import React from "react";
import { useDisclosure, useMediaQuery } from "@chakra-ui/react";
import "../index.css";
import { useCardContext } from "../views/Problematica";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const PopupButton = ({ videoId, title, subtitle, text }) => {
  const { color } = useCardContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <>
      <Button
        borderColor={`${color}.500`}
        bgColor={`${color}.400`}
        px="8"
        textColor="white"
        className="button-popup"
        onClick={onOpen}
        colorScheme={color}
      >
        Video
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
        <ModalOverlay />
        <ModalContent
          bg="white"
          color={`${color}.500`} // Modificar color del texto
          borderColor={`${color}.600`} // Color del borde
          borderWidth="1.5px" // Ancho del borde
          maxW={isMobile ? "calc(100% - 10px)" : "calc(60vw - 60px)"}
          maxH={isMobile ? "calc(100% - 10px)" : "calc(100dvh - 120px)"}
          mr={isMobile ? "10px" : "10px"}
          ml={isMobile ? "10px" : "auto"}
          mt={isMobile ? "100px" : "60px"}
          overflowY="auto"
        >
          <ModalHeader
            className="modal-header"
            fontSize={isMobile ? "20px" : "min(3dvh, 6dvw)"}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <h3
              className="subtitle"
              style={{ fontSize: isMobile ? "12px" : "min(2dvh, 4dvw)" }}
            >
              {subtitle}
            </h3>
            <p
              className="description"
              mb={3}
              style={{ fontSize: isMobile ? "10px" : "min(1.6dvh, 3.2dvw)" }}
            >
              {text}
            </p>
            <div className="video-container" style={{ margin: "10px 0 0 0" }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                frameBorder="0"
                allowFullScreen
                style={{ height: "100%", width: "100%" }}
              ></iframe>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PopupButton;
