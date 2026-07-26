import { useTranslations } from "next-intl";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { TbPinnedFilled as PinIcon } from "react-icons/tb";

import Image from "@/common/components/elements/Image";
import { STACKS } from "@/common/constants/stacks";
import { ProjectItem } from "@/common/types/projects";
import { Link } from "@/i18n/navigation";

const ProjectCard = ({
  title,
  slug,
  description,
  image,
  stacks,
  is_featured,
}: ProjectItem) => {
  const t = useTranslations("ProjectsPage");

  const trimmedContent =
    description.slice(0, 100) + (description.length > 100 ? "…" : "");

  return (
    <Link href={`/projects/${slug}`} className="group block h-full">
      <article className="corp-card corp-shine flex h-full flex-col transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_40px_-16px_rgba(6,92,194,0.35)]">
        <div className="relative overflow-hidden">
          {is_featured && (
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-800 to-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
              <PinIcon size={12} />
              Featured
            </div>
          )}
          <Image
            src={image}
            alt={title}
            width={450}
            height={200}
            className="h-[180px] w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-[200px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {(stacks || []).slice(0, 4).map((stack: string) => {
              const stackData = STACKS[stack];
              if (!stackData) return null;
              return (
                <span
                  key={stack}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/95 shadow-sm dark:bg-neutral-900/90"
                  title={stack}
                >
                  <span className={stackData.color}>{stackData.icon}</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-1 flex-col space-y-2 p-5">
          <h3 className="text-base font-semibold tracking-tight text-neutral-800 transition group-hover:text-primary dark:text-neutral-100">
            {title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {trimmedContent}
          </p>
          <span className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-primary">
            {t("view_project")}
            <ViewIcon
              size={18}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProjectCard;
