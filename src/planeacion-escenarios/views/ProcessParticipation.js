import { steps, tools } from '../utils/constants';
import { useMediaQuery } from "@chakra-ui/react";

const ProcessParticipation = () => {
    const [isMobile] = useMediaQuery("(max-width: 800px)");


  return (
    <div className="process content content--beige">
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
        <div className='content-col' style={{
          flex: isMobile ? 'unset' : '0 0 50%', 
          justifyContent: isMobile ? 'flex-start':'space-between'
          }}
        >
          {steps.map((step, index) => (
            <div key={index}>
              <div style={{
                backgroundColor:step.color, 
                borderRadius:6,
                padding: 'min(1vh, 1vw) min(2vh, 2vw)',
                marginBottom: 'min(0.8vh, 2vw)'
              }}>
                <h3 style={{textAlign:'left'}}>{step.title}</h3>
              </div>
              
              <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'1rem'}}>
                <span className='step__number'>{index + 1}</span>
                <p style={{margin:0}}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/*HERRAMIENTAS*/}
        <div className='herramientas' style={{flex: isMobile ? '1': '0 0 40%'}}>
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
    </div>
  );
};

export default ProcessParticipation;