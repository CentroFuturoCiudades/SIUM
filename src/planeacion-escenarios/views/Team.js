import { teamMembersCFC, teamMembersCNL, comiteAsesor } from '../constants/constants';

const Team = () => {
  return (
    <section className="equipo content content--dark-green">
      <div className="section-number">
        05
      </div>
      <div className='section-number section-number--outline'>
        05
      </div>

      <h2 className="section_title section_title--white" style={{marginBottom:0}}> 
        EQUIPO
      </h2>
      <h2 className='section_subtitle'>Este proyecto es fondeado por <span className='section_subtitle section_subtitle--bold'>Capital para el Bien Común A.C.</span></h2>


      <div className='content-row'>
        <div className='content-row' style={{flex:'0 0 50%'}}>
          
          <div className='content-col'>
            <h3>Centro para el Futuro de las Ciudades</h3>
            <div className='content-col' style={{justifyContent:'space-between'}}>
              {teamMembersCFC.map((member) => (
                <p key={member.name}>
                  <strong>{member.name}</strong><br />
                  <span>{member.role}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="content-col" style={{gap:'3rem'}}>
            <div>
              <h3>Consejo Nuevo León</h3>
              {teamMembersCNL.map((member) => (
                <p key={member.name}>
                  <strong>{member.name}</strong><br />
                  <span>{member.role}</span>
                </p>
              ))}
            </div>
            <div>
              <h3>Comité Asesor</h3>
              {comiteAsesor.map((member) => (
                <p key={member}>
                  <strong>{member}</strong>
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className='content-col' style={{alignItems: 'flex-end', justifyContent:'flex-end'}}>
          <img src={'/pxe_images/LogoPXE.png'} className="logoPXE_medium"/>
          <img src={'/pxe_images/Logo-CFC.png'} className="logoCFC" />
        </div>
      </div>
    </section>
  );
};

export default Team;