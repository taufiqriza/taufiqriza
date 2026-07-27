"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BiCollection } from "react-icons/bi";
import { TbPinnedFilled } from "react-icons/tb";

import Image from "@/common/components/elements/Image";
import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { PROJECTS } from "@/common/constants/projects";
import { STACKS } from "@/common/constants/stacks";
import { Link } from "@/i18n/navigation";
import { fetcher } from "@/services/fetcher";
import type { ProjectItem } from "@/common/types/projects";

function pickProjects(data: ProjectItem[] | undefined): ProjectItem[] {
  const fromApi = (data || [])
    .filter((p) => p.is_show)
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.id - a.id;
    });

  if (fromApi.length >= 3) return fromApi.slice(0, 5);
  return PROJECTS.filter((p) => p.is_show).slice(0, 5);
}

export default function FeaturedProjects() {
  const t = useTranslations("HomePage");
  const tp = useTranslations("ProjectsPage");
  const { data, isLoading } = useSWR("/api/projects", fetcher);

  const projects = pickProjects(data);
  const [hero, ...rest] = projects;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1.5">
          <SectionHeading
            title={t("projects.title")}
            icon={<BiCollection size={20} />}
          />
          <SectionSubHeading>
            <p className="text-sm">{t("projects.sub_title")}</p>
          </SectionSubHeading>
        </div>
        <Link
          href="/projects"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
        >
          {t("projects.view_all")}
          <HiOutlineArrowSmRight size={16} />
        </Link>
      </div>

      {isLoading && !data ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-primary/5 md:first:col-span-2 md:first:h-52"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-2"
            >
              <Link href={`/projects/${hero.slug}`} className="group block">
                <article className="corp-card overflow-hidden">
                  <div className="grid md:grid-cols-[1.15fr_1fr]">
                    <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[240px]">
                      <Image
                        src={hero.image || "/images/placeholder.webp"}
                        alt={hero.title}
                        width={800}
                        height={400}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent" />
                      {hero.is_featured && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-primary dark:bg-neutral-900/90">
                          <TbPinnedFilled size={11} />
                          {t("projects.featured")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-3 p-5 sm:p-6">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {t("projects.eyebrow")}
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-neutral-900 transition group-hover:text-primary dark:text-white">
                          {hero.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {hero.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(hero.stacks || []).slice(0, 5).map((stack) => (
                          <span
                            key={stack}
                            className="rounded-md border border-primary/10 bg-primary/[0.04] px-2 py-0.5 text-[10px] font-medium text-primary dark:text-primary-300"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {tp("view_project")}
                        <HiOutlineArrowSmRight
                          size={16}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}

          {rest.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.35,
                delay: 0.05 * (index + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block h-full"
              >
                <article className="corp-card flex h-full flex-col overflow-hidden transition hover:border-primary/20">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image || "/images/placeholder.webp"}
                      alt={project.title}
                      width={480}
                      height={240}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 flex gap-1">
                      {(project.stacks || []).slice(0, 3).map((stack) => {
                        const s = STACKS[stack];
                        return s ? (
                          <span
                            key={stack}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/95 text-xs shadow-sm dark:bg-neutral-900/90"
                            title={stack}
                          >
                            <span className={s.color}>{s.icon}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <h3 className="font-semibold tracking-tight text-neutral-900 transition group-hover:text-primary dark:text-neutral-100">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {project.description}
                    </p>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <Link
        href="/projects"
        className="btn-brand-outline flex w-full sm:hidden"
      >
        {t("projects.view_all")}
        <HiOutlineArrowSmRight size={16} />
      </Link>
    </section>
  );
}
