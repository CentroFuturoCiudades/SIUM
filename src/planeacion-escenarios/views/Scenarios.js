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
            <div className="content-row" style={{marginTop:'2rem', gap:'2rem'}}>
                <div style={{width:'70%', backgroundColor:'#716c6c'}}>

                </div>
                <div className="content-col" style={{justifyContent:'flex-end'}}>
                    <p>
                        Las ciudades enfrentan problemas
                        estructurales que son, en parte,
                        producto de modelos de planeación
                        inadecuados (ONU-Habitat 2016).
                    </p>
                    <p>
                        La planeación tradicional abunda en
                        diagnósticos, pero carece de
                        estrategias e instrumentos eficaces que
                        coloquen al ciudadano en el centro, y no
                        aprovecha las herramientas
                        computacionales disponibles.
                    </p>
                    <p>
                        Falta incorporar la incertidumbre en los
                        planes: ¿qué pasaría si cambian las
                        condiciones sociales, económicas o
                        ambientales?
                    </p>
                </div>
            </div>
        </section>
    )
};

export default Scenarios;