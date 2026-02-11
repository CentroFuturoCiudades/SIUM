const ScenariosGrid1 = () => {
    const info_grid1 = [
        {
            title: 'Escenario 1',
            colorClass: 'grid1__item--green',
        },
        {
            title: 'Escenario 2',
            colorClass: 'grid1__item--pink',
        },
        {
            title: 'Escenario 3',
            colorClass: 'grid1__item--purple',
        },
        {
            title: 'Escenario 4',
            colorClass: 'grid1__item--blue',
        },
    ]
    return (
       <section className="grid1">
        {info_grid1.map((item, index) => (
            <div key={index} className={`grid1__item ${item.colorClass}`}>
                <h3>{item.title}</h3>
            </div>
        ))}
      </section>
    );
}

export default ScenariosGrid1;