const ScenarioIntro = ({ title, subtitle1, subtitle2, intro, viabilidad }) => {
    return (

        <div className="content scenario" style={title == "Escenario A" ? {backgroundColor:'#e9eff4', paddingRight:0 /* paddingLeft:0, height:'100dvh', border:'1px solid red'*/ } : {paddingRight:0}}>

            {title == "Escenario A" && (
                <>
                <h2 className="section_title section_title--big">ESCENARIOS EXPLORATIVOS</h2>
                <div className="section-number">
                    04
                </div>
                <div className='section-number section-number--outline'>
                    04
                </div>
                </>
            )}
            
            
            {/* <h2 className="section_title">{title}</h2> */}
            <h2 className="section_subtitle">{subtitle1}</h2>

            
            <div className="content-row scenario-grid">
                <div 
                    className='content-col'
                    style={{gap:'4rem'}}
                >
                    <div>
                        {/* <h3 className="section_subtitle">{subtitle1}</h3> */}
                        <h3 className="section_subtitle-italic">{subtitle2}</h3>
                    </div>
                    <h4 style={{ width:'90%'}}>{intro}</h4>
                    <div className="content-row" style={{gap:'1rem'}}>
                        <h4>VIABILIDAD POLÍTICA</h4>
                        <div className="dots-row">
                            {[...Array(5)].map((_, i) => (
                                <span className={`dot ${i < viabilidad ? 'dot--filled' : ''}`} key={i}></span>
                            ))}
                        </div>
                    </div>
                </div>


                <div style={{width: '100%', height: 'min(74dvh, 41.6dvw)', backgroundColor:'#6297b8', alignSelf:'center'}}>
                </div>
            </div>
        </div>
    )
}

export default ScenarioIntro;