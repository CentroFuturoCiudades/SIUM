import { implicaciones_categories, scenariosTitles } from "../constants/constants";

const ImplicacionesGlobales = () => {
    const scenarios = ['inicial', 'red', 'contenida', 'archipelago'];
    return (
        <div className="content" style={{overflowX:'auto'}}>
            <h2 className="section_title section_title" style={{lineHeight:1}}> 
                IMPLICACIONES GLOBALES<br />
                DIFERENCIA DE 2020 A 2040
            </h2>

            <div className="implicaciones">
              {scenarios.map((scenario, scenarioIndex) => (
                <div className='implicaciones__cell' key={scenario} style={{
                  gridColumn: scenarioIndex + 2,
                  gridRow: 1,
                  color: 'black',
                  borderTop: '1px solid black',
                }}>
                  {scenariosTitles[scenario]}
                </div>
              ))}

                  {implicaciones_categories.map((category, index) => (
                    <>
                      <div className="content-row implicaciones__category" style={{
                        gridColumn: 1,
                        gridRow: index + 2,
                      }}>
                        <h3>{category.category}</h3>
                        <span style={{fontSize:'1.5rem'}}>{category.icon}</span>
                      </div>

                      {scenarios.map((scenario, scenarioIndex) => (
                        <div className="implicaciones__cell" key={scenario} style={{
                          gridColumn: scenarioIndex + 2,
                          gridRow: index + 2,
                          backgroundColor: category.scenarios[scenario].color,
                          borderBottom: index === implicaciones_categories.length - 1 ? '1px solid black' : 'none',
                        }}>
                          {category.scenarios[scenario].value}
                        </div>
                      ))}

                      <div style={{
                        gridColumn: 6,
                        gridRow: index + 2,
                        justifyContent:'flex-start',
                        color: 'black',
                        border: 'none',
                      }}>
                        {category.units}
                      </div>
                    </>
                  ))}
            </div>
        </div>
    )
}

export default ImplicacionesGlobales;