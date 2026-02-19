const ScenarioIntro = ({ title, subtitle1, subtitle2, intro, viabilidad }) => {
    return (
        <div className="content scenario" style={title == "Escenario A" ? {backgroundColor:'#e9eff4', paddingRight:0} : {paddingRight:0}}>
            <h2 className="section_title">{title}</h2>
            
            <div className="content-row scenario-grid">
                <div 
                    className='content-col'
                    style={{gap:'2rem'}}
                >
                    <div>
                        <h3 className="section_subtitle">{subtitle1}</h3>
                        <h3 className="section_subtitle-italic">{subtitle2}</h3>
                    </div>
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