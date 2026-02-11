const ScenarioCase = ({ title, subtitle, col1, col2, image }) => {
    return (
        <div className="content ">
            <h2 className="section_title">{title}</h2>
            <h3 className="section_subtitle">{subtitle}</h3>
            <div 
                className='content-row three-columns'
                style={{marginTop:'2rem'}}
            >
                <div>{col1}</div>
                <div>{col2}</div>
                <img 
                    src={image} 
                    alt={subtitle} 
                    // style={{
                    //     width: '100%',
                    //     objectFit: 'contain',
                    //     marginLeft: 0
                    // }} 
                />
            </div>
        </div>
    )
}

export default ScenarioCase;