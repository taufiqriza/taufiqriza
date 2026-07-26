import Breakline from "@/common/components/elements/Breakline";
import { getCareersData } from "@/services/careers";
import { getEducationData } from "@/services/education";

import Story from "./Story";
import CareerList from "./CareerList";
import EducationList from "./EducationList";

const About = async () => {
  const [careers, education] = await Promise.all([
    getCareersData(),
    getEducationData(),
  ]);

  return (
    <>
      <Story />
      <Breakline className="my-8" />
      <CareerList careers={careers} />
      <Breakline className="my-8" />
      <EducationList education={education} />
    </>
  );
};

export default About;
