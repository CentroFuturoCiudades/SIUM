//import './ProjectWhy.scss';
//import MapMty from '../../assets/map-mty-02.png';

const ProjectWhy = () => {
  return (
    <section className=' why content content--light-green'>
        <div className='section-number section-number--left'>
          02
        </div>
        <div className='section-number section-number--outline section-number--left'>
          02
        </div>
      <div className="content-row">

        <div className="leyenda">
          <div style={{ width:'30%', height:'40%', marginBottom:'1rem'}}>
            <img src={'/pxe_images/legend.png'} style={{width:'100%', height:'100%'}}/>
          </div>
          <p>¿HACIA DÓNDE NOS EXPANDIMOS?</p>
          <p>
            El <span>35%</span> del territorio construido
            pierde población.
          </p>
        </div>

        <div className='content-col' style={{gap: '2rem'}}>
          <h2 className="section_title section_title--white">
            ¿POR QUÉ ESTE<br />PROYECTO?
          </h2>
          <div className="content-col" style={{width:'90%', gap:'1rem'}}>
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
      </div>
    </section>
  );
};

export default ProjectWhy;