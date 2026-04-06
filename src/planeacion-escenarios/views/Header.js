const Header = () => {
  return (
    <header className="content content--dark-green header" style={{padding: 'clamp(2rem, 3vw, 4rem)'}}>
      {/* Fondo satelital */}
      <img className="img__background" src={'/pxe_images/FondoMTY.png'}/>

      {/* Texto izquierdo */}
      <div className="content-col" >
        <div style={{padding:'1rem'}}>
            <h2 className="header">ZMM 2040</h2>
            <h2 className="header header--bold">Futuros Posibles</h2>
        </div>

        <div className='content-row'>
          <img src={'/pxe_images/Logo-CFC.png'} className="logoCFC"/>

          <h2 className='section_subtitle' style={{textAlign:'right'}}>
            Este proyecto es fondeado por <br/> 
            <span className="section_subtitle--bold">Capital para el Bien Común A.C.</span>
          </h2>
        </div>

      </div>
      
      <img src={'/pxe_images/LogoPXEgrande.png'} className="logoPXE"/>

    </header>
  );
};

export default Header;