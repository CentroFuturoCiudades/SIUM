
const ScenarioGrid2 = () => {
    const scenarios_headers = ['','Escenario 1', 'Escenario 2', 'Escenario 3', 'Escenario 4'];

    const grid2_data = [
        {
            //scenario: 'Escenario 1',
            metric: 'forma urbana',
            escenario1: 'forma urbana para el escenario 1',
            escenario2: 'forma urbana para el escenario 2',
            escenario3: 'forma urbana para el escenario 3',
            escenario4: 'forma urbana para el escenario 4',
        },
        {
            //scenario: 'Escenario 2',
            metric: 'economía',
            escenario1: 'economía para el escenario 1',
            escenario2: 'economía para el escenario 2',
            escenario3: 'economía para el escenario 3',
            escenario4: 'economía para el escenario 4',
        },
        {
            //scenario: 'Escenario 3',
            metric: 'infraestructura',
            escenario1: 'infraestructura para el escenario 1',
            escenario2: 'infraestructura para el escenario 2',
            escenario3: 'infraestructura para el escenario 3',
            escenario4: 'infraestructura para el escenario 4',
        },
        {
            //scenario: 'Escenario 4',
            metric: 'gobernanza',
            escenario1: 'gobernanza para el escenario 1',
            escenario2: 'gobernanza para el escenario 2',
            escenario3: 'gobernanza para el escenario 3',
            escenario4: 'gobernanza para el escenario 4',
        }
    ];

    return (
        <section className="grid2">
            {scenarios_headers.map((header, index) => (
                <div key={index} className={`grid2__header`}>
                    <h3>{header}</h3>
                </div>
            ))}
            {grid2_data.map((row) => (
                <>
                    <div className={`grid2__header`}>
                        <span>{row.metric}</span>
                    </div>
                    <div className={`grid1__item grid1__item--purple`}>
                        <span>{row.escenario1}</span>
                    </div>
                    <div className={`grid1__item grid1__item--green `}>
                        <span>{row.escenario2}</span>
                    </div>
                    <div className={`grid1__item grid1__item--pink`}>
                        <span>{row.escenario3}</span>
                    </div>
                    <div className={`grid1__item grid1__item--blue`}>
                        <span>{row.escenario4}</span>
                    </div>
                </>
            ))}
        </section>
    );

}

export default ScenarioGrid2;