import './index.css';
import './section.css';
import Header from './views/Header';
import Intro from './views/Intro';
import ProjectWhy from './views/ProjectWhy';
import ProcessParticipation from './views/ProcessParticipation';
import ProcessThemes from './views/ProcessThemes';
import Scenarios from './views/Scenarios';
import ScenarioIntro from './views/ScenarioIntro';
import ScenarioDescription from './views/ScenarioDescription';
import Team from './views/Team';
import { scenarios_cases } from './constants/constants';
// import '../styles/global.scss'

const Section = ({ id, children }) => (
  <section id={id} className='pxe__section'>
    {children}
  </section>
);

const PXE_Landing = () => {
  return (
    <>
      <Section id="home">
        <Header />
      </Section>

      <Section id="scenario">
        <Intro />
      </Section>

      <Section id="why">
        <ProjectWhy />
      </Section>

      <Section id="participation">
        <ProcessParticipation />
      </Section>

      {/*<Section id="themes">
        <ProcessThemes />
      </Section>*/}

      <Section id="scenario">
        <Scenarios />
      </Section>


      {scenarios_cases.map((caseData, index) => (
        <>
        <Section id={`scenario-case-${index}`} key={index}>
          <ScenarioIntro {...caseData} />
        </Section>
        <Section id={`scenario-description-${index}`} key={`${index}-description`}>
          <ScenarioDescription {...caseData} />
        </Section>
        </>
      ))}

      <Section id="team">
        <Team />
      </Section> 

    </>
  );
};

export default PXE_Landing;
