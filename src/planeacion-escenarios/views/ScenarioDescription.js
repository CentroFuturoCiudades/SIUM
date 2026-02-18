const ScenarioDescription = ({ subtitle1, col1, col2, col3, ventajas, tensiones, image }) => {
    return (
        <div className="content scenario" style={subtitle1 == "Metrópolis Inercial" ? {backgroundColor:'#adb8cf'} : {}}>
            <div 
                className='content-row scenario-grid scenario-grid--desc'
                style={{boxSizing:'border-box', height:'100%'}}
            >
                <div className="content-col" style={{height:'100%'}}>
                    <h2 className="section_subtitle section_subtitle--medium-italic">{subtitle1}</h2>
                    <div className="three-columns" style={{marginTop:'1rem'}}>
                        <div>{col1}</div>
                        <div>{col2}</div>
                        <div>{col3}</div>
                    </div>
                </div>

                <div className="content-col" style={{display:'grid', gridTemplateRows:'1fr 1fr', gap:'1rem', padding:'10px', boxSizing:'border-box', height:'100%'}}>
                    <div className={`extraInfo ${subtitle1 == "Metrópolis Inercial" ? 'extraInfo--inercial' : ''}`}>
                        <h6 style={{color:'green'}}>Ventajas</h6>
                        {ventajas}
                    </div>
                    <div className={`extraInfo ${subtitle1 == "Metrópolis Inercial" ? 'extraInfo--inercial' : ''}`}>
                        <h6 style={{color:'red'}}>Tensiones</h6>
                        {tensiones}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ScenarioDescription;