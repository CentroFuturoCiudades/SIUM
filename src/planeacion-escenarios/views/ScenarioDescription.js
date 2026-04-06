const ScenarioDescription = ({ subtitle1, col1, col2, col3, ventajas, tensiones, image }) => {
    return (
        <div className="content scenario" style={subtitle1 == "Metrópolis Inercial" ? {backgroundColor:'#e9eff4'} : {}}>
            <div className='content-row'>
                <div className="scenario-description content-col">
                    <h2 className="section_title section_title--medium-italic">{subtitle1}</h2>
                    <div className="three-columns">
                        {col1}
                        {col2}
                        {col3}
                    </div>
                </div>

                <div className='pros-cons content-col'>
                    <div className="box" style={subtitle1 == 'Metrópolis Inercial' ? {backgroundColor:'#fafafa'}: {}}>
                        <h6 style={{color:'green'}}>Ventajas</h6>
                        {ventajas}
                    </div>
                    <div className="box" style={subtitle1 == 'Metrópolis Inercial' ? {backgroundColor:'#fafafa'}: {}}>
                        <h6 style={{color:'red'}}>Tensiones</h6>
                        {tensiones}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScenarioDescription;