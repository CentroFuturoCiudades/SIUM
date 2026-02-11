
import { FaCarSide } from 'react-icons/fa';
import { TfiMoney } from 'react-icons/tfi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { GiModernCity } from 'react-icons/gi';

export const steps = [
    {
        title: 'ESTRUCTURACIÓN INICIAL DEL PROYECTO',
        description: 'Recopilación de información, documentos antecedentes, selección de herramientas de modelación.',
        colorClass: 'step__item--blue',
    },
    {
        title: 'INTEGRACIÓN DE COMPONENTES Y PROCESOS PARTICIPATIVOS',
        description: 'Definición de catalizadores de cambio, componentes necesarios para el desarrollo de modelos y criterios de evaluación, talleres con stakeholders.',
        colorClass: 'step__item--yellow',
    }, 
    {
        title: 'DESARROLLO DE ESCENARIOS',
        description: 'Construcción de escenarios: tendencial y escenarios exploratorios con base en los resultados de procesos participativos.',
        colorClass: 'step__item--red',
    },
    {
        title: 'ESTRATEGIAS DE IMPLEMENTACIÓN',
        description: 'Identificación y evaluación de proyectos y estrategias actuales, diseño de estrategias de implementación.',
        colorClass: 'step__item--green',
    },
];

export const tools = [
{
    name: 'Community Viz',
    description: 'Simulador de impactos derivados de cambios en la localización de servicios, empleo y vivienda.',
    icon: <HiOutlineBuildingOffice2 />,
},
{
    name: 'Modelo de Transporte',
    description: 'Simulador de impactos derivados de cambios en la localización de servicios, empleo y vivienda.',
    icon: <FaCarSide />,
},
{
    name: 'Modelo Fiscal',
    description: 'Herramienta de simulación para optimizar la asignación de recursos y evaluación de condicionantes fiscales.',
    icon: <TfiMoney />,
},
{
    name: '(Re) Imagina Urbano',
    description: 'Plataforma web para reestimación dinámica de impactos en la accesibilidad, debido a nuevo equipamiento.',
    icon: <GiModernCity />,
},
]

export const scenarios_cases = [
    {
        title: 'ESCENARIO TENDENCIAL',
        subtitle: 'Más de lo mismo',
        col1: (
            <div className="content-col">
                <p>
                    En 2040, Monterrey sigue creciendo,
                    pero sin dirección. La expansión urbana
                    continúa empujada por el mercado
                    inmobiliario y la industria dispersa,
                    mientras la infraestructura y los
                    servicios públicos se rezagan. El
                    transporte público es inviable, el
                    automóvil domina, el tráfico es
                    permanente y los tiempos de traslado
                    son cada vez más largos. Las sequías y
                    los cortes de agua y energía se han
                    normalizado.
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    El centro metropolitano perdió
                    dinamismo y la periferia se multiplicó
                    sin orden. Cada municipio desarrolla su
                    propia “centralidad”, sin conexión entre
                    ellas. El resultado es una metrópoli de
                    enclaves desconectados, con altos
                    costos logísticos, servicios colapsados
                    y desigualdades crecientes.
                </p>
                <p>
                    El modelo económico se mantiene
                    estable, pero sin innovación ni
                    bienestar: Monterrey es una ciudad
                    agotada por su propio crecimiento,
                    atrapada en la inercia de un desarrollo
                    que ya no genera prosperidad.
                </p>
            </div>
        ),
        image: '/pxe_images/EscenarioTendencial.png'
    }, 
    {
        title: 'ESCENARIO POSIBLE 1',
        subtitle: 'Red de centralidades conectadas',
        col1: (
            <div className="content-col">
                <p>
                    En 2040, la ZMM se organiza en una
                    red de centralidades industriales,
                    habitacionales y de servicios
                    distribuidas dentro del mismo perímetro
                    actual. La expansión territorial se
                    desacelera y el crecimiento se
                    concentra en nodos conectados por
                    corredores de transporte y
                    equipamientos que estructuran el
                    territorio metropolitano. Las zonas
                    centrales se densifican y se renuevan,
                    mientras nuevas centralidades
                    industriales y mixtas surgen
                    principalmente hacia el norte y oriente.
                </p>
                <p>
                    La economía se distribuye entre estas
                    centralidades, con actividades
                    especializadas y oportunidades más
                    cercanas a la vivienda. Algunas zonas
                    adquieren mayor dinamismo y
                    capacidad para atraer empresas e
                    inversión, mientras otras quedan
                    rezagadas dentro de la nueva
                    estructura urbana.
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    El agua y la energía se convierten en
                    factores clave para definir dónde se
                    concentra la inversión y qué centralidades
                    alcanzan mayores niveles de consolidación,
                    lo que provoca que el poniente desacelere
                    su desarrollo debido a limitaciones hídricas
                    y de infraestructura. La movilidad
                    metropolitana funciona mediante
                    corredores de alta capacidad, transporte
                    público y corredores verdes que conectan
                    los nodos principales, reduciendo la
                    necesidad de desplazamientos largos.
                </p>
                <p>
                    La coordinación metropolitana es fuerte y
                    técnica: un ente rector regula suelo,
                    servicios y movilidad bajo criterios
                    comunes. Aunque la corresponsabilidad
                    ciudadana sigue siendo acotada, crece en
                    torno al cuidado del agua, la energía y el
                    espacio público. Esta reorganización
                    genera beneficios desiguales entre
                    municipios, según su rol dentro de la red de
                    centralidades, municipios y estado ceden
                    atribuciones a un IMEPLAN. Este escenario
                    requeriría inversiones mayores a los
                    recursos disponibles.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario1.png'
    },
    {
        title: 'ESCENARIO POSIBLE 2',
        subtitle: 'Redes de centralidades conectadas',
        col1: (
            <div className="content-col">
                <p>
                    En 2040, la ZMM sigue creciendo, pero
                    de manera más ordenada y
                    concentrada hacia el norte y oriente.
                    Estas zonas reciben nuevos desarrollos
                    habitacionales vinculados a polos
                    industriales y logísticos que definen el
                    patrón urbano. Los centros mantienen
                    su importancia administrativa y de
                    servicios, pero su transformación
                    avanza de forma más gradual.
                </p>
                <p>
                    La economía gira en torno a núcleos
                    productivos que generan empleo y
                    dinamismo. En torno a ellos se
                    desarrollan zonas con servicios básicos
                    y conexiones directas a los centros de
                    trabajo. Las zonas centrales dependen
                    más de la inversión privada para
                    regenerarse, generando diferencias
                    marcadas entre territorios. La
                    infraestructura se planea con criterios
                    de eficiencia económica. Las zonas en
                    expansión reciben inversiones
                    específicas en agua, drenaje, energía y
                    movilidad
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    El agua se gestiona de manera local, el
                    drenaje se adapta al crecimiento y la
                    energía se distribuye según la demanda
                    industrial. El sistema de transporte
                    combina ampliaciones viales con
                    corredores de transporte público que
                    conectan áreas residenciales con zonas
                    industriales, generando mejoras en
                    algunos territorios y mayor presión en
                    otros. En la periferia, la concentración de
                    eindustria y logística incrementa el
                    consumo de recursos y deteriora la
                    calidad del aire.
                </p>
                <p>
                    La gobernanza responde a una
                    coordinación funcional entre estado,
                    municipios y sector privado, aunque sin
                    una visión metropolitana clara. Un ente
                    técnico regula uso de suelo y factibilidad
                    hídrica, mientras la participación
                    ciudadana es reducida. Los municipios
                    más cercanos a los polos productivos se
                    benefician, mientras otros mantienen
                    roles principalmente habitacionales. Este
                    escenario no requiere grandes
                    inversiones públicas.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario2.png'
    },
    {
        title: 'ESCENARIO POSIBLE 3',
        subtitle: 'Red de centralidades conectadas',
        col1:(
            <div className="content-col">
                <p>
                    En 2040, la ZMM contiene su
                    expansión y concentra su desarrollo
                    dentro de un núcleo metropolitano más
                    compacto en 9 municipios. La
                    regeneración urbana, la densificación y
                    la modernización de barrios centrales
                    se vuelven las principales líneas de
                    transformación, impactando los precios
                    del suelo, mientras las periferias
                    pierden protagonismo en el crecimiento
                    metropolitano.
                </p>
                <p>
                    La economía se orienta hacia servicios
                    avanzados, innovación y actividades
                    creativas integradas a zonas densas y
                    renovadas. La industria ligera opera en
                    corredores modernizados y la industria
                    pesada se desplaza fuera del núcleo
                    urbano. Esta concentración impulsa el
                    dinamismo del centro, reduce los
                    desplazamientos y fortalece la vida
                    barrial, aunque también genera nuevas
                    tensiones sociales por el aumento del
                    precio del suelo y la vivienda.
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    La infraestructura hídrica, energética y de
                    movilidad se actualiza para soportar
                    mayores densidades. Corredores de
                    transporte público, micromovilidad
                    eléctrica, como scooters, y algunas redes
                    peatonales conectan las principales
                    centralidades del núcleo compacto,
                    reduciendo el uso del auto y mejorando la
                    calidad del aire.
                </p>
                <p>
                    La gobernanza es técnica, coordinada y
                    con un ente metropolitano que regula suelo,
                    servicios y movilidad bajo criterios
                    comunes. Los municipios centrales ganan
                    capacidad fiscal y relevancia, mientras las
                    periferias pierden dinamismo, generando
                    tensiones derivadas del aumento en los
                    costos locales, y a la preocupación de
                    municipios excluidos y desarrolladores con
                    reservas de tierra en la periferia. La
                    participación ciudadana sigue siendo
                    acotada, pero adopta un rol más activo en
                    espacios consultivos representados por
                    expertos. El modelo es costoso fiscalmente
                    y requiere fuerte inversión privada.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario3.png'
    },
    {
        title: 'ESCENARIO POSIBLE 4',
        subtitle: 'Red de centralidades conectadas',
        col1: (
            <div className="content-col">
                <p>
                    En 2040, la ZMM evoluciona hacia un
                    modelo donde cada municipio define su
                    propio rumbo. No existe una visión
                    metropolitana integrada; la forma
                    urbana resulta de estrategias locales
                    que producen una ciudad diversa:
                    algunos municipios se densifican y
                    regeneran, mientras otros se expanden
                    moderadamente según su vocación.
                </p>
                <p>
                    La economía se distribuye según las
                    capacidades de cada territorio. Algunos
                    municipios construyen polos de
                    servicios o innovación, mientras otros
                    refuerzan actividades industriales o
                    logísticas. La competencia por
                    inversiones acentúa desigualdades y
                    genera trayectorias muy distintas entre
                    municipios.
                </p>
                <p>
                    La infraestructura hídrica, energética y
                    de movilidad presenta resultados muy
                    variados.
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    Algunos territorios adoptan soluciones
                    locales eficientes, mientras otros
                    enfrentan rezagos o presiones derivadas
                    del crecimiento. La movilidad sigue
                    dominada por el automóvil, aunque varios
                    municipios desarrollan sistemas internos
                    diseñados según sus necesidades
                    locales y sin integración metropolitana.
                </p>
                <p>
                    La gobernanza es local. Cada municipio
                    establece sus propias reglas, incentivos y
                    alianzas para atraer inversión, empleo y
                    población, compitiendo por recursos y
                    proyectos estratégicos. La coordinación
                    intermunicipal se limita a mesas técnicas
                    y acuerdos específicos. La participación
                    ciudadana adopta formas distintas según
                    la capacidad local, generando una
                    metrópoli heterogénea y con resultados
                    desiguales, sin mecanismos claros de
                    compensación. Fiscalmente es viable y el
                    gasto estatal se orienta a proyectos
                    municipales.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario4.png'
    }
]

export const teamMembersCFC = [
    {
        name: 'Roberto Ponce',
        role: 'Líder del proyecto',
    },
    {
        name: 'Carlos Orozco',
        role: 'Project Manager del proyecto',
    },
    {
        name: 'Fabian Lozano',
        role: 'Asesor equipo de modelación',
    },
    {
        name: 'Natalia Cadavid',
        role: 'Equipo de modelación',
    },
    {
        name: 'Uriel Salazar',
        role: 'Equipo de modelación',
    },
    {
        name: 'Gonzalo Peraza',
        role: 'Equipo de modelación',
    },
    {
        name: 'Sofía Vignetta',
        role: 'Procesos participativos',
    },
    {
        name: 'Alan Romero',
        role: 'Diseñador Web',
    },
]

export const teamMembersCNL = ['Juan Alejandro García', 'Alicia Landín'];
export const comiteAsesor = ['Armando Estrada', 'Ana Fernanda Hierro', 'José Antonio Torre', 'Heather Hannon', 'Giovanni Pérez', 'Matt Nookeser', 'Uri Avin'];