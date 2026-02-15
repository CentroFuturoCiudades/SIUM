const ScenarioIntro = ({ title, intro, viabilidad }) => {
    return (
        <div className="content scenario" style={title == "Incercial" ? {backgroundColor:'#adb8cf'} : {}}>
            <h2 className="section_title">ESCENARIO</h2>
            
            <div className="content-row scenario-grid">
                <div 
                    className='content-col'
                    style={{gap:'2rem'}}
                >
                    <h3 className="section_subtitle">{title}</h3>
                    <h4 style={{marginTop:'2rem', width:'70%'}}>{intro}</h4>
                    <div className="content-row" style={{gap:'1rem'}}>
                        <h4>VIABILIDAD POLÍTICA</h4>
                        <div className="dots-row">
                            {[...Array(5)].map((_, i) => (
                                <span className={`dot ${i < viabilidad ? 'dot--filled' : ''}`} key={i}></span>
                            ))}
                        </div>
                    </div>
                </div>


                <div style={{width: '100%', height: '100%', backgroundColor:'#dd81ac'}}>
                </div>
            </div>
        </div>
    )
}

export default ScenarioIntro;