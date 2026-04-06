import { useMediaQuery } from "@chakra-ui/react";
const ProjectWhy = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return (
    <section className='why content content--light-green'>
        <div className='section-number section-number--left'>
          02
        </div>
        <div className='section-number section-number--outline section-number--left'>
          02
        </div>

      
        <div className="content-row">
          {!isMobile && (
            <div className="map-legend" style={{backgroundImage:'url("/pxe_images/map_mty.png")'}}>
              <div>
                <img src={'/pxe_images/legend.png'} />
                <>
                  <p style={{fontWeight:'bold'}}>¿HACIA DÓNDE NOS EXPANDIMOS?</p>
                  <p>
                    El <span>35%</span> del territorio construido
                    pierde población.
                  </p>
                </>
              </div>
            </div>
          )}

          <div className='content-col' style={{gap:0, flex: '0 0 25%'}}>
            <h2 className="section_title section_title--white">
              ¿POR QUÉ ESTE<br />PROYECTO?
            </h2>
            <div className="content-col" style={{gap:'1rem'}}>
              <div>
                <p>
                  Las ciudades enfrentan problemas estructurales que son, en parte,
                  producto de modelos de planeación inadecuados (ONU-Habitat 2016).
                </p>
                <p>
                  La planeación tradicional abunda en diagnósticos, pero carece de
                  estrategias e instrumentos eficaces que coloquen al ciudadano en el
                  centro, y no aprovecha las herramientas computacionales disponibles.
                </p>
                <p>
                  Falta incorporar la incertidumbre en los planes:
                  <br />
                  ¿qué pasaría si cambian las condiciones sociales, económicas o
                  ambientales?
                </p>
              </div>

              <div>
                <p>Hay una gran incertidumbre sobre el futuro:</p>
                <p>¿Hacia dónde y cómo crecerá el tejido urbano en las próximas décadas?</p>
                <p>¿Qué tan severos serán los efectos del cambio climático en la región?</p>
                <p>¿Cuánto financiamiento habrá disponible para mantener y expandir la infraestructura?</p>
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="map-legend" >
              <img src={'/pxe_images/map_mty.png'} style={{width:'100%', height:'auto', objectFit:'contain', display:'block'}}/>
              <img src={'/pxe_images/legend.png'} style={{width:'100%', height:'100%'}}/>
              <div>
                <p style={{fontWeight:'bold'}}>¿HACIA DÓNDE NOS EXPANDIMOS?</p>
                <p>
                  El <span>35%</span> del territorio construido
                  pierde población.
                </p>
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default ProjectWhy;