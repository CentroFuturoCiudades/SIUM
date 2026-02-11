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

      <div className='content-row' style={{gap:'2rem', marginTop:'2rem'}}>
        {/*STEPS COLORES*/}
        <div className='content-col' style={{maxWidth:'50%', justifyContent:'space-between'}}>
          {steps.map((step, index) => (
            <div key={index} style={{display:'flex', flexDirection:'column', padding:0}}>
              <div className={`step__item ${step.colorClass}`}>
                <h3>{step.title}</h3>
              </div>
              
              <div className='step__description' style={{margin:0}}>
                <span className='step__number'>{index + 1}</span>
                <p style={{margin:0}}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/*HERRAMIENTAS*/}
        <div className='herramientas'>
          <h3 className='herramientas__title'>HERRAMIENTAS DE MODELACIÓN</h3>
          <div className='toolCards'>
            {tools.map((tool) => (
              <div key={tool.name} className='toolCards__card'>
                <h4>{tool.name}</h4>
                {tool.icon}
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