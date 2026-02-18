import { steps, tools } from '../constants/constants';

const ProcessParticipation = () => {

  return (
    <section className="process content content--beige">
      <div className="section-number">
        03
      </div>
      <div className='section-number section-number--outline'>
        03
      </div>
      <h2 className='section_title section_title--white'>PROCESO Y<br />PARTICIPACIÓN</h2>

      {/* PASOS DEL PROCESO */}
      <div className='content-row' style={{gap:'2rem', alignItems:'flex-end'}}>
        <div className='content-col'>
          {steps.map((step, index) => (
            <div key={index}>
              <div className={`step__item ${step.colorClass}`}>
                <h3>{step.title}</h3>
              </div>
              
              <div className='step__description'>
                <span className='step__number'>{index + 1}</span>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/*HERRAMIENTAS*/}
        <div className='herramientas'>
          <h3>HERRAMIENTAS DE MODELACIÓN</h3>
          <div className='toolCards'>
            {tools.map((tool) => (
              <div key={tool.name} className='toolCards__card'>
                <h4>{tool.name}</h4>
                <div style={{width:'100%', height:'6rem'}}>
                  <img src={tool.icon} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                </div>
                <p>{tool.description}</p>
              </div>
            )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessParticipation;