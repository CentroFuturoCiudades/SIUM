
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
    icon: '/pxe_images/tools1.png',
},
{
    name: 'Modelo de Transporte',
    description: 'Simulador de impactos derivados de cambios en la localización de servicios, empleo y vivienda.',
    icon: '/pxe_images/tools2.png',
},
{
    name: 'Modelo Fiscal',
    description: 'Herramienta de simulación para optimizar la asignación de recursos y evaluación de condicionantes fiscales.',
    icon: '/pxe_images/tools3.png',
},
{
    name: '(Re) Imagina Urbano',
    description: 'Plataforma web para reestimación dinámica de impactos en la accesibilidad, debido a nuevo equipamiento.',
    icon: '/pxe_images/tools4.png',
},
]

export const scenarios_cases = [
    {
        title: 'Escenario A',
        subtitle1: 'Metrópolis Inercial',
        subtitle2: 'Expansión industrial y vivienda periférica',
        intro: 'LA ZONA METROPOLITANA DE MONTERREY CRECE DE FORMA EXPANSIVA, GUIADA POR UNA AGENDA INMEDIATA Y NO POR UNA VISIÓN INTEGRAL DE LARGO PLAZO. LA EXPANSIÓN SE DIRIGE AL NORTE Y ORIENTE, ARTICULADA EN POLOS INDUSTRIALES Y VIVIENDA DE BAJA Y MEDIA DENSIDAD, CONSOLIDANDO UN MODELO PERIFERICO, SEGMENTADO Y AMBIENTALMENTE PRESIONADO.',
        viabilidad: 4,
        col1: (
            <div className="content-col">
                <p>
                    En el 2040, la ciudad transiciona hacia una
                    mayor proximidad relativa entre vivienda y
                    empleo respecto a la situación actual porque es
                    algo que el mercado inmobiliario valora: los
                    empleadores y los compradores de vivienda
                    buscan esta proximidad. Esta transición ocurre
                    dentro de una forma urbana dispersa organizada
                    en polos productivos fragmentados. La
                    integración vivienda–empleo se da bajo una
                    lógica operativa que reduce tiempos y costos de
                    traslado, pero es desigual y limitada a áreas del
                    centro y de la periferia industrial. En torno a
                    corredores industriales y logísticos se
                    desarrollan conjuntos habitacionales de baja y
                    media densidad, predominantemente
                    unifamiliares, asociados al empleo cercano. La
                    vivienda multifamiliar se concentra en
                    segmentos específicos, generando
                    encarecimiento y exclusión sin una política
                    pública compensatoria. La vivienda de
                    INFONAVIT se sigue concentrando en zonas
                    periféricas dentro de polígonos que garantizan
                    provisión mínima de servicios y cercanía relativa
                    al empleo.
                </p>
                <p>
                    Movilidad orientada a la actividad industrial. La
                    inversión en movilidad prioriza infraestructura
                    vial de gran escala para conectar zonas
                    industriales, logísticas y nuevos desarrollos
                    habitacionales, sin atravesar áreas centrales
                    como medida para reducir congestión. El
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    automóvil se mantiene como modo dominante,
                    mientras el transporte público crece de manera
                    puntual en corredores productivos sin reducir
                    significativamente los viajes intermunicipales. La
                    movilidad activa y el espacio público
                    permanecen en segundo plano, con impactos
                    diferenciados en congestión, emisiones y calidad
                    urbana.
                </p>
                <p>
                    Agua y energía como filtros habilitadores del
                    crecimiento. La expansión se dirige hacia
                    territorios con disponibilidad inmediata de agua y
                    energía o donde pueden implementarse
                    soluciones locales, reforzando un patrón
                    extendido y de baja densidad. La gestión hídrica
                    es principalmente reactiva y no incorpora de
                    forma sistemática estrategias de resiliencia ante
                    el cambio climático, como recarga de acuíferos o
                    reducción de riesgos. El modelo urbano sostiene
                    la expansión en el corto plazo, pero genera
                    provisión desigual y presión creciente sobre
                    infraestructura y recursos naturales.
                </p>
                <p>
                    Gobernanza pragmática sin rectoría
                    metropolitana. La coordinación se basa en
                    acuerdos funcionales entre el gobierno estatal,
                    los municipios y el sector privado. No existe un
                    ente rector que articule uso de suelo, movilidad y
                    servicios a escala metropolitana, ni un Instituto
                    Metropolitano de Planeación (IMEPLAN). Los
                    municipios periféricos absorben la mayor parte
                </p>
            </div>
        ),
        col3: (
            <div className="content-col">
                <p>
                    del crecimiento en vivienda, industria e
                    infraestructura, mientras los municipios
                    centrales conservan funciones administrativas y
                    de servicios, con renovaciones puntuales
                    dependientes de inversión privada. La
                    gobernanza resulta políticamente viable y
                    suficiente para que los proyectos se lleven a
                    cabo, pero carece de visión compartida,
                    capacidades institucionales duraderas y
                    mecanismos efectivos de corresponsabilidad
                    social.
                </p>
                <p>
                    Estabilidad fiscal de corto plazo con
                    fragmentación territorial. El escenario mantiene
                    déficits controlados y endeudamiento
                    moderado al evitar inversiones metropolitanas
                    intensivas y sostener el crecimiento mediante
                    inversión privada, por lo que resulta viable en el
                    corto plazo. Sin embargo, al tratarse de una
                    ciudad expandida y de baja densidad, aumentan
                    tiempos de traslado y costos de provisión de
                    servicios. Una proporción creciente del gasto se
                    destina a operación y mantenimiento,
                    reduciendo margen para nueva inversión. La
                    recaudación depende del ciclo económico y de
                    la competitividad industrial y logística. La
                    coordinación limitada genera asignaciones
                    ineficientes y reactivas, mientras las diferencias
                    fiscales entre municipios se profundizan,
                    consolidando trayectorias divergentes de
                    capacidad financiera.
                </p>
            </div>
        ),
        ventajas: (
            <div className="content-col">
                <p>
                    El crecimiento y la inversión pública y privada se
                    concentran en zonas industriales y logísticas con
                    servicios disponibles, evitando dispersión
                    indiscriminada. La expansión continúa hacia áreas
                    específicas que, en algunos casos, mejoran la
                    proximidad entre vivienda, empleo y servicios.
                </p>
                <p>
                    La localización del desarrollo prioriza
                    infraestructura instalada y proximidad funcional,
                    facilitando atracción de inversión y fortaleciendo la
                    competitividad regional.
                </p>
                <p>
                    Los municipios más dinámicos fortalecen su
                    recaudación y reinvierten en vialidades, redes y
                    equipamientos, elevando estándares en polos
                    productivos.
                </p>
                <p>
                    El modelo se apoya en inversión privada y gasto
                    público selectivo, reduciendo presión financiera en
                    el corto plazo. La coordinación pragmática permite
                    ejecutar proyectos y responder a contingencias
                    con rapidez.
                </p>
            </div>
        ),
        tensiones: (
            <div className="content-col">
                <p>
                    La especialización municipal consolida polos
                    productivos y áreas predominantemente
                    habitacionales, profundizando desigualdades
                    intermunicipales y manteniendo una estructura
                    territorial similar a la de 2026, sin resolver la
                    fragmentación de fondo.
                </p>
                <p>
                    La ausencia de un sistema integrado incrementa
                    desplazamientos intermunicipales y tiempos de
                    traslado, ampliando brechas de accesibilidad y
                    reforzando patrones de ciudad dormitorio.
                </p>
                <p>
                    El agua y la energía se gestionan según factibilidad
                    inmediata y presiones de inversión, sin fortalecer
                    resiliencia regional ni reducir riesgos frente a
                    sequías, crisis energéticas o cambio climático.
                </p>
                <p>
                    La coordinación funciona para proyectos específicos,
                    pero no construye capacidades metropolitanas
                    duraderas. La toma de decisiones se concentra en
                    acuerdos pragmáticos con participación ciudadana
                    limitada y sin rectoría estable.
                </p>
            </div>
        ),
        image: '/pxe_images/EscenarioTendencial.png'
    }, 
    {
        title: 'Escenario B',
        subtitle1: 'Metrópolis  en Red',
        subtitle2: 'Red de centralidades y corredores',
        intro: 'LA CIUDAD SE REORDENA EN UNA RED DE CENTRALIDADES CONECTADAS POR CORREDORES. LA RED SE CONTIENE DENTRO DE LOS 16 MUNICIPIOS COORDINADOS Y ALINEADOS A PRINCIPIOS COMUNES QUE REGULAN EL DESARROLLO, EN FUNCIÓN DE LA DISPONIBILIDAD DE AGUA, ENERGÍA Y FACTIBILIDAD DE LA INFRAESTRUCTURA DE MOVILIDAD Y LOS EQUIPAMIENTOS.',
        viabilidad: 1,
        col1: (
            <div className="content-col">
                <p>
                    En este escenario al 2040, las distintas
                    centralidades se especializan según su vocación:
                    algunas concentran principalmente vivienda o
                    empleo, otras servicios; unas integran vivienda
                    INFONAVIT y otras desarrollan vivienda
                    residencial vertical, entre otras combinaciones.
                    El modelo urbano desacelera la expansión y
                    busca conciliar la ciudad planificada con la
                    construida, acercando vivienda y empleo dentro
                    de cada nodo mediante redensificación
                    alrededor de centralidades y corredores
                    estratégicos de la zona central —principalmente
                    en Monterrey, San Pedro, San Nicolás,
                    Guadalupe, Escobedo y Apodaca—. Estos
                    procesos combinan vivienda vertical, usos
                    mixtos, reconversión de áreas subutilizadas y
                    modernización de infraestructura de agua,
                    drenaje y transporte, reactivando la vida urbana y
                    optimizando suelo.
                </p>
                <p>
                    El suelo se mantiene costoso en torno a estas
                    centralidades, presionando la asequibilidad. En
                    respuesta, el IMEPLAN impulsa instrumentos
                    normativos y financieros para fomentar vivienda
                    asequible, diversidad de tipologías y mezcla de
                    ingresos dentro de cada centralidad. Sin
                    embargo, la inversión no se distribuye
                    homogéneamente: algunos corredores
                    concentran con mayor intensidad los beneficios
                    de la proximidad. En el nororiente se consolidan
                    centralidades productivas vinculadas a
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    infraestructura industrial y logística, articuladas
                    con nodos mixtos mediante corredores. En
                    contraste, en el norponiente se desacelera el
                    crecimiento por limitaciones en la factibilidad de
                    servicios, persistiendo rezagos en
                    infraestructura y conectividad.
                </p>
                <p>
                    Movilidad estructurada en corredores. La ciudad
                    se articula mediante ejes con vialidades
                    principales, algunos con transporte público e
                    infraestructura verde. En los municipios
                    centrales se prioriza la movilidad activa con
                    inversión peatonal y ciclista, mientras el
                    transporte público conecta centralidades con
                    dinámica significativa de viajes. El automóvil
                    sigue presente en desplazamientos
                    intermunicipales donde la red no cubre
                    completamente la demanda.
                </p>
                <p>
                    La factibilidad de agua y energía se convierte en
                    criterio estructurante. Las zonas a densificar se
                    definen por disponibilidad, eficiencia y
                    capacidad de gestión de recursos. Se
                    modernizan redes, se establecen estándares de
                    consumo y reuso, y se incorporan espacios con
                    vegetación y agua para facilitar infiltración y
                    resiliencia. La continuidad industrial y la
                    redensificación incrementan la demanda;
                    algunas centralidades sostienen su desarrollo
                    con mayor estabilidad, mientras en otras la
                    infraestructura rezagada impone límites.
                </p>
            </div>
        ),
        col3: (
            <div className="content-col">
                <p>
                    Hay un Instituto Metropolitano de Planeación
                    (IMEPLAN) que rige y regula el desarrollo
                    urbano. El reordenamiento es guiado por una
                    gobernanza técnica y coordinada que impulsa
                    proyectos estratégicos en movilidad, desarrollo
                    urbano e infraestructura. Los municipios
                    transfieren atribuciones en uso de suelo a
                    cambio de fondos metropolitanos y asistencia
                    técnica, alineando sus instrumentos a la
                    revitalización de centralidades y corredores
                    prioritarios. Se fortalece la coordinación
                    institucional, aunque los territorios fuera del foco
                    de inversión enfrentan menores márgenes de
                    negociación.
                </p>
                <p>
                    La implementación del modelo policéntrico
                    requiere inversión pública inicial considerable
                    para habilitar corredores, transporte e
                    infraestructura estratégica, lo que genera
                    restricciones presupuestarias y demanda una
                    política fiscal que la sostenga. Aunque focalizada,
                    esta inversión puede generar ahorros en la
                    provisión de servicios en el largo plazo. Las
                    centralidades consolidadas incrementan su
                    financiamiento mediante impuesto predial y venta
                    de derechos de edificabilidad, apoyadas en
                    esquemas público-privados. Sin embargo,
                    municipios con menor capacidad institucional
                    enfrentan dificultades recaudatorias, generando
                    asimetrías que requieren mecanismos de
                    coordinación y compensación intergubernamental.
                </p>
            </div>
        ),
        ventajas: (
            <div className="content-col">
                <p>
                    La consolidación de centralidades y corredores
                    impulsa densificación, usos mixtos y reconversión
                    de áreas subutilizadas, fortaleciendo economías
                    locales y vida comunitaria. El crecimiento se orienta
                    a nodos conectados que acercan vivienda, empleo y
                    servicios.
                </p>
                <p>
                    El modelo prioriza el uso de suelo e infraestructura
                    instalada, desacelera la expansión periférica y
                    acompaña la redensificación con modernización de
                    redes de agua, drenaje y transporte, así como
                    incorporación de infraestructura verde.
                </p>
                <p>
                    Las intervenciones en corredores y sistemas de
                    transporte reducen tiempos de traslado y congestión
                    en el largo plazo, con afectaciones asociadas a
                    procesos de reconfiguración en el corto plazo.
                </p>
                <p>
                    Una gobernanza técnica que alinea uso de suelo,
                    movilidad y servicios establece reglas comunes y
                    facilita proyectos estratégicos de largo plazo,
                    reduciendo incertidumbre para la inversión pública
                    y privada.
                </p>
            </div>
        ),
        tensiones: (
            <div className="content-col">
                <p>
                    La inversión y modernización de infraestructura se
                    concentran en centralidades y corredores
                    prioritarios, mientras otros territorios mantienen
                    rezagos en conectividad, servicios y oportunidades.
                </p>
                <p>
                    La redensificación y revalorización del suelo en
                    centralidades puede elevar costos de vivienda y
                    dificultar la permanencia de hogares de menores
                    ingresos si los instrumentos de compensación no
                    son suficientes, generando desplazamiento y
                    conflictos urbanos.
                </p>
                <p>
                    El modelo requiere inversión pública sostenida en
                    redes, transporte e infraestructura urbana,
                    incrementando presión fiscal en el corto y mediano
                    plazo y limita margen presupuestario, en especial si
                    los retornos se materializan en el largo plazo.
                </p>
                <p>
                    La coordinación metropolitana concentra
                    decisiones estratégicas y puede reducir margen
                    municipal. Además, el crecimiento condicionado
                    por factibilidad hídrica y energética impone límites
                    en ciertos territorios.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario1.png'
    },
    {
        title: 'Escenario C',
        subtitle1: 'Metrópolis Contenida',
        subtitle2: 'Redensificación del centro metropolitano',
        intro: 'MONTERREY CONCENTRA SU DESARROLLO EN EL NÚCLEO URBANO (9 MUNICIPIOS CENTRALES), FRENANDO LA EXPANSIÓN PERIFÉRICA. LA CIUDAD APUESTA POR DENSIFICAR, RECICLAR Y MEZCLAR USOS DENTRO DE UN PERÍMETRO DEFINIDO, PRIORIZANDO EFICIENCIA, PROXIMIDAD Y SOSTENIBILIDAD. EL MODELO FORTALECE EL CENTRO METROPOLITANO, PERO GENERA TENSIONES SOCIALES, FISCALES Y TERRITORIALES CON LOS MUNICIPIOS PERIFÉRICOS.',
        viabilidad: 0,
        col1: (
            <div className="content-col">
                <p>
                    En el 2040, este escenario plantea una forma
                    urbana densa basada en el reciclaje de la ciudad
                    existente y con una mezcla de usos de suelo de
                    empleo, servicios y vivienda. La ciudad se
                    reorganiza en barrios y distritos compactos, con
                    impulso a la vivienda vertical y reconversión de
                    áreas subutilizadas. La recuperación de espacios
                    públicos y vacíos urbanos redefine el paisaje y
                    fortalece la vida barrial. Sin embargo, la restricción
                    del suelo disponible —derivada del freno a la
                    expansión— intensifica el encarecimiento de la
                    vivienda, convirtiéndose en rasgo estructural del
                    modelo. Los servicios, la innovación y la tecnología
                    ganan peso frente a la industria, organizándose en
                    distritos especializados y conectados. Antiguas
                    áreas industriales se reconvierten, mientras la
                    industria pesada se relocaliza fuera de los 9
                    municipios centrales. Esta transformación
                    fortalece el dinamismo económico del núcleo,
                    pero reduce el atractivo productivo y residencial
                    de municipios periféricos.
                </p>
                <p>
                    Alta proximidad vivienda–empleo crean una
                    ciudad próxima y más caminable. La vida
                    cotidiana se desarrolla en entornos cercanos,
                    donde muchas actividades ocurren en trayectos
                    cortos. La proximidad funcional mejora la
                    eficiencia urbana, pero no garantiza integración
                    social en los barrios. El aumento de densidades y
                    la revalorización inmobiliaria tensionan la
                    permanencia de grupos de menores ingresos en
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    áreas mejor conectadas. La vivienda INFONAVIT
                    vuelve a ser viable en densidad media y alta en
                    ciertas zonas.
                </p>
                <p>
                    Movilidad estructurada en transporte público y
                    modos activos. La densificación genera
                    condiciones para un sistema de transporte
                    público robusto y sostenible, que se convierte en
                    la columna vertebral de la ciudad compacta. La
                    densidad habilita redes de micromovilidad y
                    recorridos peatonales que complementan el
                    sistema, reduciendo la dependencia del automóvil
                    dentro del núcleo, aunque las conexiones hacia
                    zonas industriales periféricas siguen requiriendo
                    vehículo privado.
                </p>
                <p>
                    Agua y energía se transformaron para sostener
                    densidades altas en la zona revitalizada. A través
                    de inversiones entre 2025 y 2035, las redes de
                    drenaje, agua, gas y electricidad se modernizaron
                    en los 9 municipios centrales donde era
                    necesario; en 2040 hay menos fugas y mayor
                    reúso de agua. Estas intervenciones sostienen
                    barrios regenerados a mayor densidad, con usos
                    mixtos y vivienda vertical, incorporando fuentes
                    regionales como respaldo ante sequías extremas.
                </p>
                <p>
                    Gobernanza centralizada y restrictiva. Un Instituto
                    Metropolitano de Planeación (IMEPLAN) asume la
                    rectoría técnica y regulatoria para normar dónde
                    ocurre el desarrollo y bajo qué condiciones,
                </p>
            </div>
        ),
        col3: (
            <div className="content-col">
                <p>
                    fijando reglas estrictas sobre uso de suelo,
                    movilidad y factibilidad de servicios. Dentro del
                    núcleo se facilita la densificación y los usos
                    mixtos; fuera de él, se endurecen restricciones.
                    La participación ciudadana en decisiones
                    estratégicas es limitada. El IMEPLAN impulsa
                    instrumentos normativos y financieros para
                    promover vivienda vertical asequible dentro del
                    núcleo urbano consolidado.
                </p>
                <p>
                    Alta eficiencia urbana con fuerte presión fiscal. El
                    modelo requirió inversión pública durante al
                    menos una década para renovar redes, rehabilitar
                    calles, peatonalizar corredores y ampliar
                    transporte público. Antes de 2040, estas
                    intervenciones concentraron el gasto en zonas
                    centrales, incrementando déficit y endeudamiento,
                    además de requerir nuevos instrumentos fiscales
                    para financiar la transformación.
                </p>
                <p>
                    Como resultado, la presión sobre las finanzas
                    públicas sigue siendo elevada hacia 2040, pero
                    responde a una estrategia territorial explícita. A
                    partir de ese punto, el modelo comienza a generar
                    retornos: una ciudad más compacta reduce costos
                    de operación y provisión de servicios, mientras el
                    aumento en el valor del suelo y la ampliación de la
                    base tributaria fortalecen la recaudación. Si el
                    modelo se mantiene, estos efectos permiten
                    mejora gradual de la sostenibilidad fiscal y mayor
                    convergencia territorial.
                </p>
            </div>
        ),
        ventajas: (
            <div className="content-col">
                <p>
                    La contención del crecimiento y el reciclaje de
                    áreas subutilizadas consolidan una ciudad más
                    eficiente, reduciendo presión sobre suelos
                    periurbanos y ecosistemas regionales, y generando
                    barrios con servicios accesibles a distancia
                    caminable.
                </p>
                <p>
                    La recuperación de espacios públicos y la
                    integración de vivienda, servicios y empleo refuerzan
                    la proximidad cotidiana y nuevas dinámicas de
                    interacción social y cuidados en el núcleo
                    metropolitano.
                </p>
                <p>
                    La alta densidad y proximidad vivienda–empleo
                    reducen distancias y hacen viable un transporte
                    público financieramente sostenible,
                    complementado por movilidad activa y eléctrica.
                </p>
                <p>
                    Una coordinación técnica centralizada alinea uso de
                    suelo, movilidad e infraestructura, reduce
                    fragmentación institucional y, en el largo plazo,
                    amplía la base tributaria y reduce costos operativos
                    del núcleo urbano.
                </p>
            </div>
        ),
        tensiones: (
            <div className="content-col">
                <p>
                    La limitación de expansión y la revalorización
                    inmobiliaria elevan costos de vivienda, tensionando
                    la permanencia de hogares de menores ingresos en
                    áreas bien conectadas.
                </p>
                <p>
                    La proximidad funcional no garantiza inclusión
                    social; la verticalización y aumento de densidades
                    pueden intensificar tensiones vecinales y procesos
                    de exclusión.
                </p>
                <p>
                    La inversión intensiva y sostenida en modernización
                    de redes, reciclaje urbano y transporte público
                    eleva el déficit y el endeudamiento en el corto y
                    mediano plazo. Antes de que se amplíe la base
                    tributaria y se reduzcan costos operativos, el
                    modelo requiere nuevos impuestos, reasignación
                    de gasto o mayores transferencias.
                </p>
                <p>
                    La rectoría técnica alinea uso de suelo, movilidad e
                    infraestructura, pero reduce autonomía municipal. El
                    fortalecimiento del núcleo puede disminuir el
                    atractivo de municipios fuera de los 9 centrales y
                    profundizar dependencias funcionales.
                </p>
            </div>
        ),
        image: '/pxe_images/Escenario2.png'
    },
    {
        title: 'Escenario D',
        subtitle1: 'Metrópolis Archipiélago',
        subtitle2: 'Autonomía y competencia municipal',
        intro: 'LA ZONA METROPOLITANA DE MONTERREY EVOLUCIONA SIN UNA VISIÓN COMPARTIDA. CADA MUNICIPIO DEFINE SU PROPIO MODELO DE DESARROLLO SEGÚN SUS CAPACIDADES Y VENTAJAS, CONFIGURANDO UNA METRÓPOLI COMPETITIVA, DIVERSA Y ADAPTABLE, PERO FRAGMENTADA, DONDE LA COMPETENCIA TERRITORIAL PRODUCE RESULTADOS DESIGUALES EN SERVICIOS, INFRAESTRUCTURA Y CALIDAD DE VIDA URBANA.',
        viabilidad: 3,
        col1:(
            <div className="content-col">
                <p>
                    En el 2040, la metrópoli se construye como un
                    mosaico de decisiones locales. La estructura
                    urbana resulta de trayectorias municipales
                    diferenciadas. Algunos municipios apuestan por
                    densificación y renovación de barrios consolidados,
                    mientras otros priorizan expansión industrial,
                    logística o turística. La expansión urbana continúa
                    y se acelera frente al escenario inercial.
                </p>
                <p>
                    Los municipios compiten entre sí por atraer
                    inversión pública y privada, albergar desarrollos
                    habitacionales y captar proyectos emblemáticos.
                    En buena medida, la inversión opera como un
                    juego de suma cero. Esta competencia flexibiliza
                    marcos regulatorios y favorece entornos
                    pro-inversión. El resultado es una especialización
                    territorial según fortalezas y recursos disponibles.
                    Los ciudadanos encuentran una ciudad dinámica
                    con zonas diferenciadas capaces de atender
                    distintos estilos de vida y niveles de ingreso. Esta
                    diversidad incrementa el atractivo para sectores
                    creativos y digitales, pero también consolida una
                    ciudad segregada, donde hogares de menor ingreso
                    son desplazados a zonas distantes o de riesgo.
                </p>
                <p>
                    El centro metropolitano refuerza su rol como nodo
                    de servicios y concentra vivienda vertical de alto
                    costo, mientras los corredores industriales del
                    norte y oriente consolidan su base productiva. En
                    el sur, municipios con alto valor ambiental se
                    orientan hacia desarrollos residenciales y turísticos
                </p>
            </div>
        ),
        col2: (
            <div className="content-col">
                <p>
                    de baja densidad. La vivienda social de INFONAVIT
                    y la más asequible continúan ubicándose donde
                    hay suelo barato, principalmente en periferias
                    alejadas de servicios y empleo. Algunos
                    municipios desarrollan oferta vertical asequible
                    mejor conectada, pero de forma puntual.
                </p>
                <p>
                    El resultado es una metrópoli heterogénea, con
                    modelos urbanos contrastantes que coexisten sin
                    lógica integradora. La integración
                    vivienda-empleo responde a una lógica localista.
                    Cada municipio utiliza sus instrumentos de uso de
                    suelo e inversión para articular vivienda, empleo y
                    servicios, mientras desarrolladores maximizan
                    utilidades. Algunos desarrollan proyectos mixtos
                    vinculados a polos productivos; otros refuerzan su
                    papel como áreas dormitorio con alta
                    dependencia externa. En varios territorios, la
                    expansión habitacional no corresponde con el
                    empleo, intensificando desplazamientos y
                    dependencia del automóvil. La proximidad se
                    vuelve atributo competitivo accesible solo para
                    municipios con mayor capacidad de coordinación.
                </p>
                <p>
                    La movilidad evidencia la fragmentación
                    metropolitana: no hay sistema integrado. La
                    posición estatal en transporte es débil y cada
                    municipio impulsa soluciones propias con
                    criterios distintos. El resultado es un conjunto
                    funcional localmente pero ineficiente
                    regionalmente. Los trayectos intermunicipales
                </p>
            </div>
        ),
        col3: (
            <div className='content-col'>
                <p>
                    se vuelven más largos y costosos, ampliando
                    brechas de accesibilidad.
                </p>
                <p>
                    Servicios gestionados como ventajas
                    competitivas municipales. Sin gestión integrada,
                    cada municipio busca garantizar abastecimiento
                    de agua mediante negociación y regulación
                    propia. Algunos invierten en reúso o eficiencia
                    energética; otros enfrentan restricciones. La
                    capacidad de garantizar suministro confiable se
                    vuelve factor para atraer inversión, profundizando
                    brechas territoriales. La gobernanza es
                    descentralizada, pragmática y selectiva. No existe
                    autoridad metropolitana que articule uso de suelo,
                    movilidad y servicios. La planeación se resuelve
                    desde lo local, con capacidades desiguales y
                    coordinación puntual. El gobierno estatal establece
                    marcos generales sin asumir rol conductor.
                </p>
                <p>
                    El sistema fiscal es estable y flexible, pero
                    desigual. La ausencia de grandes proyectos
                    metropolitanos reduce presión financiera en el
                    corto plazo. La inversión pública se define
                    localmente mediante intervenciones menores,
                    consolidando trayectorias fiscales divergentes.
                    Municipios con bases económicas sólidas
                    fortalecen su autonomía, mientras otros
                    dependen de transferencias reactivas. A largo
                    plazo, el modelo resulta costoso: la dispersión
                    urbana incrementa tiempos de traslado y costos
                    de provisión de servicios.
                </p>
            </div>
        ),
        ventajas: (
            <div className="content-col">
                <p>
                    La autonomía permite que los municipios definan
                    modelos urbanos acordes a sus vocaciones
                    económicas, ambientales y sociales, dando lugar a
                    una metrópoli diversa con soluciones adaptadas a
                    contextos locales y prioridades propias.
                </p>
                <p>
                    La competencia entre municipios incentiva la
                    especialización productiva y residencial según
                    aptitudes del territorio, promoviendo flexibilización
                    regulatoria, atracción de inversión pública y privada
                    y consolidación de nuevos polos de actividad.
                </p>
                <p>
                    La gestión municipal facilita soluciones rápidas en
                    transporte, micromovilidad o infraestructura vial, así
                    como innovaciones en reúso, eficiencia energética
                    o generación distribuida para fortalecer resiliencia
                    local.
                </p>
                <p>
                    El modelo no requiere cesión de atribuciones y
                    reduce presión sobre finanzas estatales. La
                    sostenibilidad fiscal depende de la capacidad
                    municipal de generar recursos y atraer inversión
                    pública y privada.
                </p>
            </div>
        ),
        tensiones: (
            <div className="content-col">
                <p>
                    La ausencia de una visión metropolitana compartida
                    produce una estructura urbana discontinua y
                    fragmentada, limitando la coherencia espacial y
                    funcional del conjunto metropolitano.
                </p>
                <p>
                    La competencia acentúa brechas entre municipios
                    con alta capacidad fiscal e institucional y territorios
                    rezagados, consolidando trayectorias urbanas y
                    sociales divergentes y segregación por niveles de
                    ingreso.
                </p>
                <p>
                    En municipios con menor capacidad de
                    coordinación, la expansión de vivienda ocurre sin
                    integración con actividades productivas, reforzando
                    el rol de municipios dormitorio y fomentando
                    desplazamientos largos en vehículo privado.
                </p>
                <p>
                    El agua, la energía y el suelo se gestionan como
                    ventajas competitivas locales, generando
                    decisiones unilaterales y capacidades desiguales
                    frente a crisis. En el largo plazo, la ciudad extendida
                    incrementa costos sociales y de provisión de
                    servicios.
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
        name: 'Alberto Meuchi',
        role: 'Director de la sede CCM del CFC'
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