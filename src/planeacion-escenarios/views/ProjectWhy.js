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

      <div className='content-col' style={{width: '30%', alignSelf: 'flex-end', gap: '1rem'}}>
        <h2 className="section_title section_title--white">
          ¿POR QUÉ ESTE<br />PROYECTO?
        </h2>
        <div style={{marginTop:'1rem'}}>
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

        <p>
          Hay una gran incertidumbre sobre el futuro:
          <br />
          <span>¿Hacia dónde y cómo crecerá el tejido urbano en las próximas décadas?</span><br/>
          <span>¿Qué tan severos serán los efectos del cambio climático en la región?</span><br/>
          <span>¿Cuánto financiamiento habrá disponible para mantener y expandir la infraestructura?</span><br/>
        </p>
      </div>
    </section>
  );
};

export default ProjectWhy;