import { implicaciones_categories, scenariosTitles } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/react";

const ImplicacionesGlobales = () => {
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const scenarios = ['inicial', 'red', 'contenida', 'archipelago'];

    return (
        <div className="content" style={{overflowX:'auto'}}>
            <h2 className="section_title section_title" style={{lineHeight:1}}> 
                IMPLICACIONES GLOBALES<br />
                DIFERENCIA DE 2020 A 2040
            </h2>

            <div className="implicaciones">
              {scenarios.map((scenario, scenarioIndex) => (
                <div className='implicaciones__cell' key={scenarioIndex} style={{
                  gridColumn: scenarioIndex + 2,
                  gridRow: 1,
                  color: 'black',
                  borderTop: '1px solid black',
                }}>
                  <p style={{textAlign:'center'}}>{scenariosTitles[scenario]}</p>
                </div>
              ))}

                  {implicaciones_categories.map((category, index) => (
                    <>
                      <div className="implicaciones__category" style={{
                        display:'flex',
                        flexDirection:'row',
                        gridColumn: 1,
                        gridRow: index + 2,
                        alignItems:'center',
                        justifyContent: isMobile ? 'space-between' :'',
                      }}>
                        <p style={{margin: 0}}>{category.category}</p>
                        <span style={{fontSize:'min(3vh, 4vw)'}}>{category.icon}</span>
                      </div>

                      {scenarios.map((scenario, scenarioIndex) => (
                        <div className="implicaciones__cell" key={scenario} style={{
                          gridColumn: scenarioIndex + 2,
                          gridRow: index + 2,
                          backgroundColor: category.scenarios[scenario].color,
                          borderBottom: index === implicaciones_categories.length - 1 ? '1px solid black' : 'none',
                        }}>
                          <p style={{margin: 0}}>{category.scenarios[scenario].value}</p>
                        </div>
                      ))}

                      <div style={{
                        gridColumn: 6,
                        gridRow: index + 2,
                        justifyContent:'flex-start',
                        color: 'black',
                        border: 'none',
                      }}>
                        <p style={{margin: 0}}>{category.units}</p>
                      </div>
                    </>
                  ))}
            </div>
        </div>
    )
}

export default ImplicacionesGlobales;