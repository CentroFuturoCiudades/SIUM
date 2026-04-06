import { scenariosGrid } from "../constants/constants"
const ScenariosGrid = () => {
    return (
        <div className="four-grid">
            {Object.entries(scenariosGrid).map(([scenario, data]) => (
                <div className='four-grid__square' style={{ backgroundImage: `url(${data.image})`}} key={scenario}>
                        <h3 className="section_title" style={{margin:0, lineHeight: 'normal'}}>{data.title}</h3>
                        <div className="content-row">
                            <p style={{color:'#1ea39b'}}>NUEVO DESARROLLO {data.nuevo_desarrollo}%</p>
                            <p style={{color:'#8b6cc5'}}>REDESARROLLO {data.redesarrollo}%</p>
                        </div>
                </div>
            ))}
        </div>
    )
}

export default ScenariosGrid;