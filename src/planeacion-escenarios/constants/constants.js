
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
        title: 'Incercial',
        intro: 'PARA 2040, LA ZONA METROPOLITANA DE MONTERREY CRECE DE FORMA EXPANSIVA, GUIADA POR UNA AGENDA INMEDIATA Y NO POR UNA VISIÓN INTEGRAL DE LARGO PLAZO. LA EXPANSIÓN SE DIRIGE AL NORTE Y ORIENTE, ARTICULADA EN POLOS INDUSTRIALES Y VIVIENDA DE BAJA Y MEDIA DENSIDAD, CONSOLIDANDO UN MODELO PERIFERICO, SEGMENTADO Y AMBIENTALMENTE PRESIONADO.',
        viabilidad: 4,
        col1: (
            <div className="content-col">
                <p>
                    La ciudad adopta una forma urbana
                    dispersa y organizada en polos productivos
                    desconectados y fragmentados, donde los
                    municipios periféricos absorben la mayor
                    parte del crecimiento mientras los centrales
                    conservan funciones administrativas con
                    procesos de renovación dependientes de
                    la inversión privada. Se transiciona hacia
                    una mayor proximidad relativa entre
                    vivienda y empleo bajo una lógica operativa
                    que reduce tiempos y costos para ciertos
                    sectores; sin embargo, esta proximidad es
                    desigual. En torno a corredores industriales
                    se desarrollan conjuntos habitacionales
                    asociados al empleo y la vivienda social
                    ocurre en centralidades definidas con
                    servicios mínimos, pero en otros territorios
                    se refuerzan dinámicas de ciudad
                    dormitorio y rezagos urbanos sin una
                    política pública compensatoria.
                </p>
                <p>
                    La movilidad se orienta a la expansión
                    productiva priorizando infraestructura vial
                    de gran escala para conectar zonas
                    industriales y logísticas, manteniendo al
                    automóvil como modo dominante mientras
                    el transporte público crece de manera
                    puntual y la movilidad activa permanece en
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    segundo plano. Asimismo, el agua y energía
                    actúan como filtros habilitadores, dirigiendo
                    la expansión hacia territorios con
                    disponibilidad inmediata. La gestión de
                    recursos es reactiva y no contempla la
                    construcción de resiliencia sistémica, lo
                    que permite sostener el crecimiento en el
                    corto plazo pero genera una provisión
                    desigual y crecientes presiones sobre la
                    infraestructura.
                </p>
                <p>
                    Se ejerce una gobernanza pragmática sin
                    rectoría metropolitana basada en acuerdos
                    funcionales, donde no existe un ente rector
                    que articule el uso de suelo ni visión
                    compartida. Este escenario es viable
                    fiscalmente al mantener déficits
                    controlados y evitar inversiones
                    metropolitanas intensivas, dependiendo
                    fuertemente del ciclo económico y la
                    inversión privada. No obstante, la
                    coordinación limitada genera asignaciones
                    ineficientes y las asimetrías fiscales entre
                    municipios se profundizan, consolidando
                    trayectorias divergentes donde la
                    estabilidad de corto plazo no se traduce en
                    transformación estructural ni convergencia
                    territorial en el largo plazo.
                </p>
            </div>
        ),
        image: '/pxe_images/EscenarioTendencial.png'
    }, 
    {
        title: 'Metropolí en Red',
        intro: 'LA CIUDAD SE REORDENA EN UNA RED DE CENTRALIDADES CONECTADAS POR CORREDORES .LA RED SE CONTIENE DENTRO DE LOS 16 MUNICIPIOS COORDINADOS Y ALINEADOS A PRINCIPIOS COMUNES QUE REGULAN EL DESARROLLO, EN FUNCIÓN DE LA DISPONIBILIDAD DE AGUA, ENERGÍA Y FACTIBILIDAD DE LA INFRAESTRUCTURA DE MOVILIDAD Y LOS EQUIPAMIENTOS.',
        viabilidad: 2,
        col1: (
            <div className="content-col">
                <p>
                    La ciudad desacelera su expansión para
                    consolidar una forma urbana de múltiples
                    centralidades y corredores que apuestan
                    a la proximidad, mejorando la distancia
                    relativa entre vivienda y empleo. Los
                    municipios centrales emprenden
                    procesos de revitalización y
                    redensificación con usos mixtos, aunque
                    la inversión es desigual en el territorio;
                    mientras algunos nodos concentran los
                    beneficios, áreas como el norponiente
                    presentan rezagos en infraestructura. Si
                    bien la estructura policéntrica reactiva la
                    vida urbana, el costo del suelo en la zona
                    central afecta la asequibilidad, por lo que
                    el IMEPLAN desarrolla instrumentos para
                    financiar vivienda diversa e incentivar la
                    diversidad de ingresos.
                </p>
                <p>
                    La movilidad se articula parcialmente en
                    corredores con transporte público e
                    infraestructura verde, priorizando la
                    movilidad activa en zonas centrales,
                    aunque el automóvil sigue presente para
                    cubrir el resto de la demanda de viajes
                    intermunicipales. El desarrollo se ordena
                    bajo el criterio de factibilidad de agua y
                    energía, modernizando redes y redes de
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    suministro para garantizar la estabilidad
                    en centralidades estratégicas, mientras
                    se implementa infraestructura verde y
                    azul para la resiliencia del sistema.
                </p>
                <p>
                    Este reordenamiento es guiado por una
                    gobernanza técnica y centralizada donde
                    el IMEPLAN asume la rectoría del
                    desarrollo urbano y la regulación del suelo
                    a cambio de fondos metropolitanos y
                    asistencia técnica. La implementación del
                    modelo requiere una inversión pública
                    inicial considerable y una política fiscal
                    que transfiere responsabilidades
                    recaudatorias a los municipios; esto
                    fortalece a las centralidades productivas,
                    pero genera asimetrías fiscales en
                    municipios con menor capacidad de
                    atracción de inversión que requieren
                    mecanismos de compensación.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario1.png'
    },
    {
        title: 'La ciudad que vuelve a su centro',
        intro: 'MONTERREY CONCENTRA SU DESARROLLO EN EL NÚCLEO URBANO (9 MUNICIPIOS CENTRALES), DETENIENDO LA EXPANSIÓN PERIFERICA. LA CIUDAD APUESTA POR DENSIFICAR, RECICLAR Y MEZCLAR USOS DENTRO DE UN PERÍMETRO DEFINIDO, PRIORIZANDO EFICIENCIA, PROXIMIDAD Y SOSTENIBILIDAD. EL MODELO FORTALECE EL CENTRO METROPOLITANO, PERO GENERA TENSIONES SOCIALES, FISCALES Y TERRITORIALES CON LOS MUNICIPIOS PERIFERICOS.',
        viabilidad: 2,
        col1: (
            <div className="content-col">
                <p>
                    La ciudad adopta una forma urbana densa
                    basada en reciclaje de la ciudad existente
                    y con una mezcla de usos,
                    reorganizándose en barrios y distritos
                    compactos con vivienda vertical y
                    reconversión de áreas subutilizadas. Esta
                    transformación fortalece el dinamismo
                    económico del núcleo, pero reduce el
                    atractivo productivo y residencial de los
                    municipios periféricos. Se logra una alta
                    proximidad vivienda–empleo donde la
                    vida cotidiana se desarrolla en entornos
                    cercanos; sin embargo, la restricción del
                    suelo disponible intensifica el
                    encarecimiento de la vivienda como un
                    rasgo estructural del modelo, y el
                    aumento de densidades tensiona la
                    permanencia de grupos de menores
                    ingresos en las áreas mejor conectadas.
                </p>
                <p>
                    La movilidad se estructura en transporte
                    público y modos activos, convirtiéndose
                    en la columna vertebral de la ciudad
                    compacta y reduciendo la dependencia
                    del automóvil dentro del núcleo. A su vez,
                    el agua y energía son gestionadas para
                    sostener altas densidades, centrando la
                    gestión en la modernización a gran escala
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    de las redes, reducción de fugas y reúso.
                    Este modelo mejora la eficiencia y
                    resiliencia, pero demanda una gran
                    inversión pública para renovar una
                    extensión considerable de la red de agua
                    y drenaje en los municipios centrales.
                </p>
                <p>
                    Se ejerce una gobernanza centralizada y
                    restrictiva donde un IMEPLAN asume la
                    rectoría técnica y normativa, fijando reglas
                    estrictas e impulsando instrumentos para
                    vivienda vertical asequible en donde
                    estaba la periferia urbana de 1990. Este
                    escenario de alta eficiencia urbana
                    conlleva una fuerte presión fiscal,
                    requiriendo una inversión sostenida que
                    incrementa el déficit y endeudamiento en
                    el corto plazo. No obstante, si se logra
                    sostener el modelo, la eficiencia
                    optimizada y la ampliación de la base
                    tributaria permiten una mejora gradual en
                    la sostenibilidad fiscal y la convergencia
                    territorial a largo plazo.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario2.png'
    },
    {
        title: 'Las mil ciudades',
        intro: 'EN 2040, LA ZONA METROPOLITANA DE MONTERREY EVOLUCIONA SIN UNA VISIÓN COMPARTIDA. CADA MUNICIPIO DEFINE SU PROPIO MODELO DE DESARROLLO SEGÚN SUS CAPACIDADES Y VENTAJAS, CONFIGURANDO UNA METRÓPOLI DIVERSA Y ADAPTABLE, PERO FRAGMENTADA, DONDE LA COMPETENCIA TERRITORIAL PRODUCE RESULTADOS DESIGUALES EN SERVICIOS, INFRAESTRUCTURA Y CALIDAD URBANA.',
        viabilidad: 5,
        col1:(
            <div className="content-col">
                <p>
                    La metrópoli se construye como un
                    mosaico de decisiones locales donde la
                    estructura urbana resulta de trayectorias
                    municipales diferenciadas y la expansión
                    urbana continúa más rápido que el
                    escenario inercial. Los municipios
                    compiten por atraer inversión funcionando
                    como un juego de suma cero, lo que
                    impulsa la flexibilización de marcos
                    regulatorios y genera una metrópoli
                    heterogénea con modelos urbanos
                    contrastantes que coexisten sin una
                    lógica plenamente integradora. Mientras el
                    centro metropolitano refuerza su rol
                    concentrando vivienda vertical de alto
                    costo, la vivienda social se sigue
                    concentrando en las periferias donde hay
                    mayor disponibilidad de suelo barato. La
                    integración vivienda-empleo responde a
                    lógicas locales, convirtiendo la proximidad
                    en un atributo diferencial y competitivo
                    accesible solo para los municipios que
                    logran coordinar inversión y regulación.
                </p>
                <p>
                    La movilidad evidencia la fragmentación
                    metropolitana ante la ausencia de una
                    autoridad con fortaleza institucional,
                    resultando en un conjunto de nodos
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    desconectados que refuerzan la
                    dependencia del automóvil y amplían
                    brechas de accesibilidad. De igual forma,
                    los servicios son gestionados como
                    ventajas competitivas municipales sin
                    gestión integrada; cada municipio busca
                    garantizar su abastecimiento de agua y
                    energía, volviendo la capacidad de
                    suministro confiable un factor clave para
                    atraer inversión, lo que profundiza brechas
                    territoriales y limita la resiliencia regional.
                </p>
                <p>
                    La gobernanza es descentralizada,
                    pragmática y selectiva, resolviendo la
                    planeación desde lo local pues no existe
                    una autoridad metropolitana que articule
                    de manera permanente el uso de suelo. El
                    gobierno estatal evita asumir un rol
                    conductor, concentrando el poder
                    territorial en municipios con mayor
                    capacidad política y financiera. El sistema
                    fiscal es estable, flexible y desigual; al
                    definirse la inversión pública desde lo local
                    se otorga resiliencia de corto plazo, pero
                    se consolidan trayectorias fiscales
                    divergentes que impiden generar
                    economías de escala y limitan la
                    transformación urbana de largo plazo.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario3.png'
    },
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