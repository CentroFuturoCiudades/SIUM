import './index.css';
import './section.css';
import Header from './views/Header';
import Intro from './views/Intro';
import ProjectWhy from './views/ProjectWhy';
import ProcessParticipation from './views/ProcessParticipation';
import ProcessThemes from './views/ProcessThemes';
import Scenarios from './views/Scenarios';
import ScenarioCase from './views/ScenarioCase';
import ScenariosGrid1 from './views/Grid1';
import ScenarioGrid2 from './views/Grid2';
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

      <Section id="themes">
        <ProcessThemes />
      </Section>

      <Section id="scenario">
        <Scenarios />
      </Section>


      {scenarios_cases.map((caseData, index) => (
        <Section id={`scenario-case-${index}`} key={index}>
          <ScenarioCase {...caseData} />
        </Section>
      ))}
      <Section id="grid1">
        <ScenariosGrid1 />
      </Section>
      
      <Section id="grid2">
        <ScenarioGrid2 />
      </Section>

      <Section id="team">
        <Team />
      </Section> 

    </>
  );
};

export default PXE_Landing;
