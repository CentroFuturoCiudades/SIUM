import { useMediaQuery } from "@chakra-ui/react";

const Intro = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <div className='content content--dark-green'>

      <div className="section-number">
        01
      </div>
      <div className='section-number section-number--outline'>
        01
      </div>

      <h2 className="section_title section_title--white"> 
        ¿QUÉ ES 
        {isMobile && <br/>} LA PLANEACIÓN<br />
        POR ESCENARIOS?
      </h2>

      <div className='content-row'>
        <div className='content-col' style={{
          flex: isMobile ? 'unset' : '0 0 30%'
        }}>
          <div>
            <p>
              Explora futuros plausibles sin pretender predecirlos,
              contrastando alternativas para identificar, evaluar
              riesgos y diseñar estrategias adaptativas, contrastándolas
              a través de un análisis cuantitativo.
            </p>
            <p>
              Utiliza un enfoque estratégico a través de la
              implementación de métodos cuantitativos y cualitativos
              para orientar estrategias sustentadas en contextos
              de incertidumbre urbana, económica y medioambiental.
            </p>
          </div>

          <div>
            <u>NO ES</u>
            <p>
              Un sustituto de los programas de ordenamiento normativos
              ya que no define usos de suelo o proyectos.
            </p>
            <p>
              Una técnica de proyección con la que se anticipe una sola
              visión objetiva del futuro, ya que no define una única
              trayectoria evolutiva.
            </p>
          </div>
        </div>
        
        <div style={{
          display:'flex', 
          flex: isMobile ? 'unset' : '1', 
          alignItems:'center'
        }}>
          <img src={'/pxe_images/table01.png'} style={{maxWidth: '100%', height:'auto', objectFit:'contain', display:'block'}}/>
        </div> 
      </div>
    </div>
  );
};

export default Intro;