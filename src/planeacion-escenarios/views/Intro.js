
const Intro = () => {
  return (
    <section className=' content content--dark-green'>

      <div className="section-number">
        01
      </div>
      <div className='section-number section-number--outline'>
        01
      </div>

      <h2 className="section_title section_title--white"> 
        ¿QUÉ ES LA PLANEACIÓN<br />
        POR ESCENARIOS?
      </h2>

      <div className='content-row' style={{marginTop:'2rem', gap:'5rem'}}>
        <div className='content-col' style={{ gap:'2rem', maxWidth:'21%'}}>
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
        
        <div style={{width:'min(88dvh, 50dvw)', alignSelf:'flex-end', backgroundColor:'#716c6c', height:'90%'}}>
         <img src={'/pxe_images/intro-table-01.png'} style={{height:'100%'}}/>
        </div>
      </div>
    </section>
  );
};

export default Intro;