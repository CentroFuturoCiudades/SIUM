import React, { useState } from 'react';
import '../index.css'; 
import { useCardContext } from '../views/Problematica';
import { Button, Box } from '@chakra-ui/react';

const PopupButton = ({ videoId, title, subtitle, text }) => {
  const { color } = useCardContext();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="button-popup"
        colorScheme={color}
        onClick={() => setShowPopup(!showPopup)}
      >
        Video
      </Button>

      {showPopup && (
        <Box className="popup" bgColor={`${color}.400`}>
          <div className="popup-header">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <p>{text}</p>
          </div>
          <div className="video-container">
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          {/* Puedes agregar un botón de cierre si lo necesitas */}
        </Box>
      )}
    </>
  );
};

export default PopupButton;






// import React, { useState } from 'react';
// import '../index.css'; 

// const PopupButton = ({ videoId, title, subtitle, description, color }) => {
//   const [showPopup, setShowPopup] = useState(false);

//   // Añadimos estilos en línea para el color del texto
//   const textStyle = {
//     color: color, // Text color same as the card
//   };

//   return (
//     <>
//       <button
//         className="button-popup" style={{ backgroundColor: color }}
//         onClick={() => setShowPopup(!showPopup)}
//       >
//         Video
//       </button>

//       {showPopup && (
//         <div className="popup" style={{ backgroundColor: '#FFF' }}> {/* Cambia a un fondo blanco para el popup */}
//           <div className="popup-header" style={textStyle}>
//             <span className="popup-title">{title}</span>
//             <span className="popup-subtitle">{subtitle}</span>
//             <button className="popup-close" onClick={() => setShowPopup(false)}>X</button>
//           </div>
//           <div className="popup-body">
//             <p className="popup-description" style={textStyle}>{description}</p>
//             <iframe 
//               width="100%" 
//               height="315" 
//               src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
//               frameBorder="0" 
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PopupButton;