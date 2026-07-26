"use client";

import { useTranslations } from "next-intl";
import { HiOutlineBriefcase as CareerIcon } from "react-icons/hi";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import type { CareerProps } from "@/common/types/careers";

import CareerCard from "./CareerCard";

const CareerList = ({ careers }: { careers: CareerProps[] }) => {
  const t = useTranslations("AboutPage.career");
  const filteredCareers = careers?.filter((career) => career.isShow !== false);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<CareerIcon />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredCareers?.map((career, index) => (
          <CareerCard key={index} indexCareer={index} {...career} />
        ))}
      </div>
    </section>
  );
};

export default CareerList;
