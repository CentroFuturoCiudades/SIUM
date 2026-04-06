import { territoriosMTY } from "../constants/constants";
const ImplicacionesTerritoriales = () => {
    return (
        <div className="content zones">
            
            <div className="content-row">
                <div className='content-col zones_col1'>
                    <h2 className="section_title section_title" style={{lineHeight:1}}> 
                        IMPLICACIONES<br />
                        SOCIO TERRITORIALES
                    </h2>
                    <div style={{display:'flex', flex:1, overflow:'hidden'}}>
                        <img src="/pxe_images/TerritoriosMTY.png" style={{ width: '100%', height:'auto', objectFit:'contain', display:'block'}}/>
                    </div>
                </div>
                <div className="content-col">
                    {Object.entries(territoriosMTY).map(([_, data], idx) => (
                        <div>
                        <span className='group'>
                            <div style={{ backgroundColor: data.color }}/>
                            <h3>Group {idx + 1}</h3>
                        </span>
                        
                        <ul>
                            {data.zones.map((municipio) => (
                                <li key={municipio}>{municipio}</li>
                            ))}
                        </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ImplicacionesTerritoriales;