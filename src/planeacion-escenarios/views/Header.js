const Header = () => {
  return (
    <header className="content content--dark-green header">
      {/* Fondo satelital */}
      <img className="img__background" src={'/pxe_images/FondoMTY.png'}/>

      {/* Texto izquierdo */}
      <div className="content-col" style={{zIndex:'2', justifyContent: 'space-between'}}>
        <div style={{padding:'1rem'}}>
            <span className="header__subtitle">ZMM 2040</span>
            <h1 className="header__title">Futuros Posibles</h1>
        </div>
        <img src={'/pxe_images/Logo-CFC.png'} className="logo-tec"/>
      </div>
      
      <img src={'/pxe_images/LogoPXEGrande.png'} className="logoPXE"/>

    </header>
  );
};

export default Header;