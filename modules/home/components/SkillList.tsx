"use client";

import { motion } from "framer-motion";
import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import GlassIcon from "@/common/components/elements/GlassIcon";
import { STACKS } from "@/common/constants/stacks";

const SkillList = () => {
  const t = useTranslations("HomePage");

  const stacksInArray: Array<
    [string, { icon: JSX.Element; background: string }]
  > = Object.entries(STACKS)
    .filter(([, value]) => value.isActive)
    .map(([name, value]) => [
      name,
      { icon: value.icon, background: value.background },
    ]);

  return (
    <section className="space-y-4">
      <div className="space-y-1.5">
        <SectionHeading title={t("skills.title")} icon={<SkillsIcon />} />
        <SectionSubHeading>
          <p className="text-sm">{t("skills.sub_title")}</p>
        </SectionSubHeading>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-primary/10 bg-white/50 p-4 dark:bg-neutral-950/40 sm:p-5"
      >
        <div className="grid w-full grid-cols-5 gap-x-2 gap-y-7 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10">
          {stacksInArray.map(([name, { icon, background }], index) => (
            <GlassIcon
              key={index}
              name={name}
              icon={icon}
              background={background}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SkillList;
