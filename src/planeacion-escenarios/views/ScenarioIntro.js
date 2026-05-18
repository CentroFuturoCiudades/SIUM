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
            
            <h2 className="section_title" style={{margin:0, fontFamily: 'Neue Montreal Medium, sans-serif'}}>
                <span className="section_title">{title}. </span>
                {subtitle1}
            </h2>
            <h2 className="section_title section_title--light-italic">{subtitle2}</h2>

            <div className="content-row">
                <div className='scenario-intro content-col' style={{flex:'0 0 40%', gap:'min(2vh, 2.5vw)', justifyContent:'center'}}>
                    <p>{intro}</p>
                    <div style={{gap:'1rem', display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <p>VIABILIDAD POLÍTICA</p>
                        <div style={{
                            display:'inline-flex',
                            gap: 'min(0.98vh, 1.5vw)'
                        }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{
                                    width: 'min(3vh, 4vw)',
                                    height: 'min(3vh, 4vw)',
                                    borderRadius: '50%',
                                    border: '2px solid #000000',
                                    backgroundColor: i < viabilidad ? '#000000' : 'transparent',
                                }}></span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <img src={image} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}}/>
                </div>
            </div>
        </div>
    )
}

export default ScenarioIntro;