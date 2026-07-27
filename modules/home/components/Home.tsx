import FeaturedProjects from "./FeaturedProjects";
import Introduction from "./Introduction";
import SkillList from "./SkillList";
import ProofStrip from "./ProofStrip";

const Home = () => {
  return (
    <div className="page-enter space-y-8 sm:space-y-10">
      <Introduction />
      <ProofStrip />
      <FeaturedProjects />
      <SkillList />
    </div>
  );
};

export default Home;
