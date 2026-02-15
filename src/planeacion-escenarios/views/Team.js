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

      <h2 className="section_title section_title--white"> 
        EQUIPO
      </h2>

      <div className='content-row' style={{marginTop:'2rem'}}>
        <div className='team_grid'>
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
                <p key={member}>
                  <strong>{member}</strong>
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
          <img src={'/pxe_images/LogoPXE.png'} className="logo-pxe"/>
          <img src={'/pxe_images/Logo-CFC.png'} className="logo-tec" />
        </div>
      </div>
    </section>
  );
};

export default Team;