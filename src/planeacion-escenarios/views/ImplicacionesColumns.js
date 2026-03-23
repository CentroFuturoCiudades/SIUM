import { implicaciones_globales, implicaciones_categories } from "../constants/constants";

const ImplicacionesColumns = () => {
    const scenarios = ['inicial', 'red', 'contenida', 'archipelago'];
    return (
        <div className="content">
            <h2 className="section_title section_title" style={{lineHeight:1}}> 
                IMPLICACIONES GLOBALES<br />
                DIFERENCIA DE 2020 A 2040
            </h2>

            <div className="implicaciones">
                {scenarios.map((scenario) => (
                    <div key={scenario} className="implicaciones-col">
                        {implicaciones_categories.map((category) => {
                            const data = category.scenarios[scenario];
                            return (
                                <div key={category.category} className="cell" style={{ background: data.color }}>
                                    {data.value}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImplicacionesColumns;