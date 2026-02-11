
const ProcessThemes = () => {
  return (
    <section className="themes content content--beige">

      <div className='content-row two-columns' style={{width:'50%'}}>
        <div>
          <p>
            El proceso participativo para la Zona Metropolitana de
            Monterrey (ZMM) se estructuró en 5 fases, iniciando con
            análisis interno y la selección de 8 catalizadores de
            cambio.
          </p>

          <p>
            El Primer Taller se enfocó en la priorización y evaluación
            de estos Catalizadores de Cambio (CC), contando con una
            participación diversa de representantes de la sociedad
            civil, academia, sector privado y gobierno.
          </p>

          <p>
            A partir de este trabajo, se elaboraron cuatro narrativas
            base de los escenarios que representan trayectorias
            posibles para Monterrey.
          </p>

          <p>
            El Segundo Taller de Planeación tuvo como objetivo la
            co-creación de estos cuatro escenarios exploratorios hacia
            2040, utilizando los resultados del taller 1 como base
            narrativa.
          </p>

          <p>
            La sesión fue esencial para enriquecer los futuros
            exploratorios con datos concretos y localizables, insumos
            indispensables para la siguiente fase de modelado.
          </p>
        </div>
        <div style={{marginRight: '2rem'}}>
          <p>
            La tercera fase se centrará en el Modelado y la Estrategia.
            Se inicia con el Modelado en CommunityViz para generar los
            cuatro “futuros urbanos” al 2040, creando escenarios
            contrastados cuantitativamente.
          </p>

          <p>
            En el Taller 3 se analizarán estos resultados para formular
            estrategias.
          </p>

          <p>
            La cuarta y última fase consiste en la Presentación y
            difusión pública (Expo) de los escenarios y las estrategias
            robustas resultantes a la ciudadanía y a los tomadores de
            decisiones.
          </p>
        </div>
      </div>


      {/* GRID DERECHA */}
        <div className="color-grid">

          <div className="theme theme--water">
            <span className="theme__meta">
              Disponibilidad y confiabilidad<br />
              de las fuentes de abastecimiento<br />
              hídrico
            </span>
            <h3>Agua</h3>
          </div>

          <div className="theme theme--mobility theme--darkText">
            <span className="theme__meta theme__meta--dark">
              Modelo de movilidad articulado<br />
              a la vida urbana
            </span>
            <h3>Movilidad</h3>
          </div>

          <div className="theme theme--management theme--darkText">
            <span className="theme__meta theme__meta--dark">
              Catalizador #2<br />
              Prestación y gestión de los servicios<br />
              de agua y alcantarillado
            </span>
           <h3>Gestión</h3>
          </div>

          <div className="theme theme--energy">
            <span className="theme__meta">
              Catalizador #6<br />
              Modelo de suministro y distribución<br />
              eléctrica
            </span>
            <h3>Energía</h3>
          </div>

          <div className="theme theme--governance">
            <span className="theme__meta">
              Catalizador #3<br />
              Coordinación entre órdenes<br />
              de gobierno e instituciones
            </span>
            <h3>Gobernanza</h3>
          </div>

          <div className="theme theme--finance">
            <span className="theme__meta">
              Catalizador #7<br />
              Régimen fiscal y mercado<br />
              en la gestión local
            </span>
            <h3>Finanzas</h3>
          </div>

          <div className="theme theme--connection">
            <span className="theme__meta">
              Catalizador #4<br />
              Integración territorial<br />
              entre vivienda y empleo
            </span>
            <h3>Conexión</h3>
          </div>

          <div className="theme theme--citizenship">
            <span className="theme__meta">
              Catalizador #8<br />
              Participación y<br />
              corresponsabilidad ciudadana
            </span>
            <h3>Ciudadanía</h3>
          </div>

        </div>
    </section>
  );
};

export default ProcessThemes;