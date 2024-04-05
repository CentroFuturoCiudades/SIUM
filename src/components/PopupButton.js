import React from 'react';
import { useDisclosure, useMediaQuery } from '@chakra-ui/react';
import '../index.css'; 
import { useCardContext } from '../views/Problematica';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';


// Componente de modal para dispositivos móviles
const MobileModal = ({ isOpen, onClose, color, title, subtitle, text, videoId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInRight'>
      <ModalOverlay />
      <ModalContent 
        bg="white"
        color={`${color}.500`} 
        borderColor={`${color}.500`}
        borderWidth="3px" 
        m="5px" // Añadir un margen de 5px en todos los lados
        maxW="calc(100% - 10px)" // Ancho máximo igual al 100% menos el margen
        h="calc(100% - 10px)" // Altura igual al 100% menos el margen
        overflowY="auto" // Permitir el desplazamiento vertical si el contenido es demasiado largo
      >
        <ModalHeader className="modal-header" style={{ fontSize: '1.5em' }}>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6} style={{ fontSize: '1.3em' }}> 
          <h3 className="subtitle">{subtitle}</h3>
          <p className="description" mb={3} style={{ fontSize: '0.9em' }}>{text}</p>
          <div className="video-container" style={{ margin: '10px 0' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              frameBorder="0"
              allowFullScreen
              style={{ width: '100%', minHeight: '300px' }} // Ajustar tamaño del video según necesites
            ></iframe>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};



const PopupButton = ({ videoId, title, subtitle, text }) => {
  const { color } = useCardContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <>
      <Button size="sm" className="button-popup" onClick={onOpen} colorScheme={color}>
        Video
      </Button>

      {isMobile ? (
        <MobileModal
          isOpen={isOpen}
          onClose={onClose}
          color={color}
          title={title}
          subtitle={subtitle}
          text={text}
          videoId={videoId}
        />
      ) : (

      <Modal isOpen={isOpen} onClose={onClose}  motionPreset='slideInRight'>
        <ModalOverlay />
        <ModalContent 
          bg="white"
          color={`${color}.500`} // Modificar color del texto
          borderColor={`${color}.500`} // Color del borde
          borderWidth="3px" // Ancho del borde
          maxW={{ base: "calc(60vw - 40px)", md: "calc(60vw - 60px)" }}
          maxH={{ base: "calc(100vh - 40px)", md: "calc(100vh - 60px)" }}
          m={4}
          mr={7}
          mt={{ base: "4%", md: "4%" }}
          ml="auto"
          overflowY="auto">
            <ModalHeader className="modal-header" style={{ fontSize: '1.5em' }}>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6} style={{ fontSize: '1.3em' }}> 
              <h3 className="subtitle">{subtitle}</h3>
              <p className="description" mb={3} style={{ fontSize: '0.9em' }}>{text}</p>
              <div className="video-container" style={{ margin: '10px 0' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </ModalBody>
        </ModalContent>
      </Modal>
      )}
    </>
  );
};

export default PopupButton;
