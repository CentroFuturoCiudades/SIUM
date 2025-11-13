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
import { MdPlayArrow } from "react-icons/md";

const PopupButton = ({
  videoId,
  title,
  subtitle,
  text,
  onClick,
  additionalContent,
}) => {
  const { color } = useCardContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <>
      <Button
        borderColor={`${color}.500`}
        borderWidth={isMobile ? "0.12rem" : "min(0.2dvh, 0.4dvw)"}
        borderRadius={isMobile ? "5px" : "min(0.8dvh, 1.6dvw)"}
        bgColor={`${color}.400`}
        w={isMobile ? "60px" : "10%"}
        h={isMobile ? "40px" : "5dvh"}
        fontSize={isMobile ? "14px" : "min(1.2dvw, 2.4dvh)"}
        right={isMobile ? "10px" : "1.5dvw"}
        top={isMobile ? "10px" : "1.5dvh"}
        textColor="white"
        className="button-popup"
        onClick={() => {
          if (onClick) onClick();
          onOpen();
        }}
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
          mr={isMobile ? "10px" : "1.5dvw"}
          ml={isMobile ? "10px" : "auto"}
          mt={isMobile ? "100px" : "8dvh"}
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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen
                style={{ height: "100%", width: "100%" }}
              ></iframe>
            </div>

            {/* Contenido adicional */}
            {additionalContent && (
              <>
                <div style={{ marginTop: "28px" }}>
                  {" "}
                  {/* Espaciado entre secciones */}
                  <ModalHeader p="0" marginBottom="10px">
                    {additionalContent.title}
                  </ModalHeader>
                  <h3 style={{ marginBottom: "4px" }}>
                    {additionalContent.subtitle}
                  </h3>
                  <p style={{ marginBottom: "10px" }}>
                    {additionalContent.text}
                  </p>
                  <div className="video-container">
                    <iframe
                      src={`https://www.youtube.com/embed/${additionalContent.videoId}?rel=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerpolicy="strict-origin-when-cross-origin" 
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const VideoCenter = ({ color, videoId, title, subtitle, text }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <>
      <Button
        variant="solid"
        px="2dvw"
        py="15px"
        height="auto"
        width="auto"
        fontSize={isMobile ? "sm" : "min(2dvw, 2dvh)"}
        textColor="white"
        onClick={onOpen}
        colorScheme={color}
        style={{ transform: "translateY(-50%)" }}
        leftIcon={<MdPlayArrow />}
      >
        Ver Video
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInTop"
      >
        <ModalOverlay />
        <ModalContent
          bg="white"
          color={`${color}.700`}
          borderColor={`${color}.700`}
          borderWidth="0.15dvh"
          maxW={isMobile ? "calc(100% - 20px)" : "50dvw"}
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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen
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
