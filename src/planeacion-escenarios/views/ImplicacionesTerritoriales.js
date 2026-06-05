import { territoriosMTY } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/react";

const ImplicacionesTerritoriales = () => {
    const [isMobile] = useMediaQuery("(max-width: 768px)");

    return (
        <div className="content zones">
            
            <div className="content-row">
                <div className='content-col' style={{flex: isMobile ? 'unset' : '0 0 75%'}}>
                    <h2 className="section_title section_title" style={{lineHeight:1}}> 
                        IMPLICACIONES<br />
                        SOCIO TERRITORIALES
                    </h2>
                    <img src="/pxe_images/TerritoriosMTY.png" style={{ maxWidth: '100%', maxHeight:'70vh', objectFit:'contain', display:'block', margin:'0 auto'}}/>
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