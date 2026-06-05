import {
  IconButton,
  useMediaQuery,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { scenarios_game } from "../utils/constants";
import { scrollToSection } from "../utils/general";

const Header = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <div className="content content--dark-green header">
      
      {/* Fondo satelital */}
      <img
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
        src={'/pxe_images/FondoMTY.png'}
      />

      {/* Capa de oscurecimiento */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}
      />

      <div className="header__row">
        <div>
            <h2 style={{fontFamily:'Neue Montreal Regular, sans-serif', fontSize:'min(5vh, 6vw)'}}>
              ZMM 2040
              <br />
              <span style={{fontFamily:'Neue Montreal Bold, sans-serif'}}>Futuros Posibles</span>
            </h2>
        </div>
         <Flex justify="end" align="top" >
          {isMobile ? (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
                size="sm"
                colorScheme="whiteAlpha"
              />
              <MenuList style={{color:'black'}}>
                <MenuItem onClick={() => scrollToSection('objetivo')} minH="50px">
                  Objetivo
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('proceso')} minH="50px">
                  Proceso
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('escenario0')} minH="50px">
                  Escenarios
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('implicaciones')} minH="50px">
                  Indicadores
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('team')} minH="50px">
                  Equipo
                </MenuItem>
                <MenuItem as="a" href={scenarios_game} target="_blank" minH="50px">
                  Juego
                </MenuItem>
              </MenuList>
            </Menu>
            ) : (
            <>
              <Button
                onClick={() => scrollToSection('objetivo')}
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                style={{fontWeight:'bold'}}
              >
                Objetivo
              </Button>
              <Button
                onClick={() => scrollToSection('proceso')}
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                fontWeight="bold"
              >
                Proceso
              </Button>
              <Button
                onClick={() => scrollToSection('escenario0')}
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                fontWeight="bold"
              >
                Escenarios
              </Button>
              <Button
                onClick={() => scrollToSection('implicaciones')}
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                fontWeight="bold"
              >
                Indicadores
              </Button>
              <Button
                onClick={() => scrollToSection('team')}
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                fontWeight="bold"
              >
                Equipo
              </Button>
              <Button
                as="a"
                href={scenarios_game}
                target="_blank"
                variant="text"
                color="white"
                fontSize="min(2.8dvh, 1.4dvw)"
                fontWeight="bold"
              >
                Juego
              </Button>
            </>
          )}
        </Flex>

        
      </div>

      <div className="header__row"
        style={{ 
          alignItems: isMobile ? 'flex-end' : 'center', 
        }}>
          <img src={'/pxe_images/Logo-CFC.png'} className="logoCFC"/>
          <h2 className='section_subtitle' style={{textAlign:'right'}}>
            Este proyecto es fondeado por <br/> 
            <span style={{fontFamily:'Neue Montreal Bold, sans-serif'}}>Capital para el Bien Común A.C.</span>
          </h2>
      </div>
      
      <img src={'/pxe_images/LogoPXEgrande.png'} className="logoPXE"/>

    </div>
  );
};

export default Header;