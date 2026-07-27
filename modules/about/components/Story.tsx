"use client";

import Image from "@/common/components/elements/Image";
import { useLocale, useTranslations } from "next-intl";
import useSiteConfig from "@/hooks/useSiteConfig";

const Story = () => {
  const t = useTranslations("AboutPage");
  const locale = useLocale() as "en" | "id";
  const { data } = useSiteConfig();

  const paragraphData = [
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
  ];

  return (
    <section className="space-y-4 leading-7 text-neutral-800 dark:text-neutral-300">
      {(data?.about?.[locale]?.length
        ? data.about[locale]
        : paragraphData.map((paragraph) =>
            t(`resume.paragraph_${paragraph.index}`),
          )
      ).map((paragraph, index) => (
        <div key={index}>{paragraph}</div>
      ))}
      <Image
        src="/images/signature.png"
        alt="signature"
        width={100}
        height={100}
      />
    </section>
  );
};

export default Story;
