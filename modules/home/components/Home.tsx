import Breakline from "@/common/components/elements/Breakline";

import FeaturedProjects from "./FeaturedProjects";
import Introduction from "./Introduction";
import SkillList from "./SkillList";

const Home = () => {
  return (
    <div className="page-enter space-y-2">
      <Introduction />
      <Breakline className="my-8 border-primary/10" />
      <FeaturedProjects />
      <Breakline className="my-8 border-primary/10" />
      <SkillList />
    </div>
  );
};

export default Home;
