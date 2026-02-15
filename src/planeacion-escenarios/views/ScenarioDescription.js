const ScenarioDescription = ({ title, col1, col2, image }) => {
    return (
        <div className="content scenario" style={title == "Incercial" ? {backgroundColor:'#adb8cf'} : {}}>
            <h2 className="section_subtitle">{title}</h2>
            <div 
                className='content-row scenario-grid'
                style={{marginTop:'2rem', boxSizing:'border-box'}}
            >
                <div className="two-columns">
                    <div>{col1}</div>
                    <div>{col2}</div>
                </div>
                <img src={image} />
            </div>
        </div>
    )
}

export default ScenarioDescription;