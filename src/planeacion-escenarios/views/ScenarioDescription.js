const ScenarioDescription = ({ subtitle1, col1, col2, col3, ventajas, tensiones, image }) => {
    return (
        <div className="content scenario" style={subtitle1 == "Metrópolis Inercial" ? {backgroundColor:'#e9eff4'} : {}}>
            <div 
                className='content-row scenario-grid scenario-grid--desc'
            >
                <div className="content-col">
                    <h2 className="section_subtitle section_subtitle--medium-italic">{subtitle1}</h2>
                    <div className="three-columns">
                        <div>{col1}</div>
                        <div>{col2}</div>
                        <div>{col3}</div>
                    </div>
                </div>

                <div className='pros-cons'>
                    <div className={`pros ${subtitle1 == "Metrópolis Inercial" ? "pros--inercial" : ""}`}>
                        <h6 style={{color:'green'}}>Ventajas</h6>
                        {ventajas}
                    </div>
                    <div className={`cons ${subtitle1 == "Metrópolis Inercial" ? "cons--inercial" : ""}`}>
                        <h6 style={{color:'red'}}>Tensiones</h6>
                        {tensiones}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScenarioDescription;