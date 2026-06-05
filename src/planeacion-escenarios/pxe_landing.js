import './index.css';
import './section.css';
import Header from './views/Header';
import Intro from './views/Intro';
import ProjectWhy from './views/ProjectWhy';
import ProcessParticipation from './views/ProcessParticipation';
//import ProcessThemes from './views/ProcessThemes';
//import Scenarios from './views/Scenarios';
import ScenarioIntro from './views/ScenarioIntro';
import ScenarioDescription from './views/ScenarioDescription';
import ImplicacionesGlobales from './views/ImplicacionesGlobales';
import ImplicacionesTerritoriales from './views/ImplicacionesTerritoriales';
import ScenariosGrid from './views/ScenariosGrid';
import GroupIndicators from './views/GroupIndicators';
import Team from './views/Team';
import { scenarios_cases } from './utils/constants';

const Section = ({ id, children }) => (
  <section id={id} className={`${id === 'escenario0' ? 'pxe__section04' : 'pxe__section'}`}>
    {children}
  </section>
);

const PXE_Landing = () => {
  return (
    <>
      <Section>
        <Header id="home"/>
      </Section>

      <Section id="intro">
        <Intro />
      </Section>

      <Section id="objetivo">
        <ProjectWhy />
      </Section>

      <Section id="proceso">
        <ProcessParticipation />
      </Section>

      {/*<Section id="themes">
        <ProcessThemes />
      </Section>*/}

      {/* <Section id="scenario">
        <Scenarios />
      </Section> */}

      {scenarios_cases.map((caseData, index) => (
        <div key={index}>
          <Section id={`escenario${index}`} key={index}>
            <ScenarioIntro {...caseData} />
          </Section>
          <Section id={`info-escenario${index}`} key={`${index}-info`}>
            <ScenarioDescription {...caseData} />
          </Section>
        </div>
      ))}

      <Section id="implicaciones">
        <ImplicacionesGlobales />
      </Section>

      <Section id="implicaciones-territoriales">
        <ImplicacionesTerritoriales />
      </Section>

      <Section id="group-indicators">
        <GroupIndicators />
      </Section>

      <Section id="scenarios-grid">
        <ScenariosGrid />
      </Section>

      <Section id="team">
        <Team />
      </Section> 

    </>
  );
};

export default PXE_Landing;
