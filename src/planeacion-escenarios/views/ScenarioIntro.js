const ScenarioIntro = ({ title, subtitle1, subtitle2, intro, viabilidad, image }) => {
    return (

        <div className="content scenario" style={title == "A" ? {backgroundColor:'#e9eff4', minHeight:'100dvh'} : {}}>

            {title == "A" && (
                <>
                <h2 className="section_title section_title--big">ESCENARIOS EXPLORATIVOS</h2>
                <div className="section-number section-number--black">
                    04
                </div>
                <div className="section-number section-number--outline section-number--black">
                    04
                </div>
                </>
            )}
            
            
            <h2 className="section_title section_title--medium" style={{margin:0}}>
                <span className="section_title">{title}. </span>
                {subtitle1}
            </h2>
            <h2 className="section_title section_title--light-italic">{subtitle2}</h2>


            
            <div className="content-row">
                <div className='scenario-intro content-col'>
                    <p>{intro}</p>
                    <div style={{gap:0}}>
                        <p>VIABILIDAD POLÍTICA</p>
                        <div className="dots-row">
                            {[...Array(5)].map((_, i) => (
                                <span className={`dot ${i < viabilidad ? 'dot--filled' : ''}`} key={i}></span>
                            ))}
                        </div>
                    </div>
                </div>


                <div className='scenario-img'>
                    <img src={image} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                </div>
            </div>
        </div>
    )
}

export default ScenarioIntro;