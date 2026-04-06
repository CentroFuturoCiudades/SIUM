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

      <h2 className='section_title section_title--white'>
        PROCESO Y<br />
        PARTICIPACIÓN
      </h2>
      
      <div className='content-row'>
        {/* PASOS DEL PROCESO */}
        <div className='content-col' style={{flex:'0 0 50%'}}>
          {steps.map((step, index) => (
            <div key={index}>
              <div className={`step__item`} style={{backgroundColor:step.color}}>
                <h3 style={{textAlign:'left'}}>{step.title}</h3>
              </div>
              
              <div className='step__description'>
                <span className='step__number'>{index + 1}</span>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/*HERRAMIENTAS*/}
        <div className='herramientas content-col' style={{flex:'0 0 40%'}}>
          <h3>HERRAMIENTAS DE MODELACIÓN</h3>
          <div className='toolCards'>
            {tools.map((tool) => (
              <div key={tool.name} className='toolCards__card'>
                <h3>{tool.name}</h3>
                <div className='toolCards__img'>
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