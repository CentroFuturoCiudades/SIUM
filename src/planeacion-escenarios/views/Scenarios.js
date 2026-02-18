const Scenarios = () => {
    return (
        <section className="content">
            <div className="section-number section-number--black">
                04
            </div>
            <div className="section-number section-number--outline section-number--black">
                04
            </div>
            <h2 className="section_title">ESCENARIOS</h2>
            <h2 className="section_title">Comparativa de Indicadores WIP</h2>
            <div className="content-row" style={{marginTop:'2rem', gap:'2rem'}}>
                <div className="col-grid" style={{width:'70%'}}>
                    <div style={{backgroundColor:'#adb8cf', width:'100%', height:'100%'}}></div>
                    <div style={{backgroundColor:'#adb8cf', width:'100%', height:'100%'}}></div>
                    <div style={{backgroundColor:'#adb8cf', width:'100%', height:'100%'}}></div>
                    <div style={{backgroundColor:'#adb8cf', width:'100%', height:'100%'}}></div>
                </div>
                <div className="content-col" style={{justifyContent:'flex-end'}}>
                    <p>
                        El proyecto explora cuatro escenarios
                        plausibles para la Zona Metropolitana de
                        Monterrey, cada uno construido a partir de
                        distintos catalizadores de cambio en materia
                        de ciudad, movilidad, agua, energía,
                        gobernanza y economía.
                    </p>
                    <p>
                        Estos escenarios no son predicciones. Son
                        configuraciones posibles del territorio que nos
                        permiten comparar trayectorias y comprender
                        sus implicaciones. Cada escenario se evalúa
                        mediante indicadores cuantitativos generados
                        con CommunityViz y un modelo fiscal.
                    </p>
                    <p>
                        Los indicadores muestran cuánto cambia la
                        ciudad, dónde y en qué magnitud: densidad,
                        vivienda, huella urbana, tiempos de traslado,
                        costos de infraestructura, consumo de agua,
                        entre otros. Permiten comparar escenarios, no
                        decidir cuál es mejor.
                    </p>
                </div>
            </div>
        </section>
    )
};

export default Scenarios;