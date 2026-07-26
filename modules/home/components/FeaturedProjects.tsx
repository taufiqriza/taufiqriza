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
import { STACKS } from "@/common/constants/stacks";
import { Link } from "@/i18n/navigation";
import { fetcher } from "@/services/fetcher";
import type { ProjectItem } from "@/common/types/projects";

const FALLBACK: ProjectItem[] = [
  {
    id: 1,
    title: "Library UNIDA Gontor",
    slug: "library-unida",
    description:
      "Integrated library system for Universitas Darussalam Gontor—catalog, circulation, and institutional workflows.",
    image: "/images/placeholder.webp",
    stacks: ["Laravel", "MySql", "PHP"],
    is_show: true,
    is_featured: true,
    link_demo: "https://library.unida.gontor.ac.id",
  },
  {
    id: 2,
    title: "REPO UNIDA Gontor",
    slug: "repo-unida",
    description:
      "Institutional repository with 10K+ academic publications and customized repository stack.",
    image: "/images/placeholder.webp",
    stacks: ["PHP", "MySql"],
    is_show: true,
    is_featured: true,
    link_demo: "https://repo.unida.gontor.ac.id",
  },
  {
    id: 3,
    title: "TAMS Alamani",
    slug: "tams-alamani",
    description:
      "Teacher Academic Management System for Al-Amani Education Malaysia—Laravel, Filament, Vue.",
    image: "/images/placeholder.webp",
    stacks: ["Laravel", "Vue.js", "MySql"],
    is_show: true,
    is_featured: false,
  },
];

export default function FeaturedProjects() {
  const t = useTranslations("HomePage");
  const tp = useTranslations("ProjectsPage");
  const { data, isLoading } = useSWR("/api/projects", fetcher);

  const fromApi: ProjectItem[] = (data || [])
    .filter((p: ProjectItem) => p.is_show)
    .sort((a: ProjectItem, b: ProjectItem) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.id - a.id;
    })
    .slice(0, 4);

  const projects = fromApi.length ? fromApi : FALLBACK;
  const [hero, ...rest] = projects;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <SectionHeading
            title={t("projects.title")}
            icon={<BiCollection size={22} />}
          />
          <SectionSubHeading>
            <p>{t("projects.sub_title")}</p>
          </SectionSubHeading>
        </div>
        <Link href="/projects" className="btn-brand-outline hidden sm:inline-flex">
          {t("projects.view_all")}
          <HiOutlineArrowSmRight size={18} />
        </Link>
      </div>

      {isLoading && !fromApi.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="corp-card h-48 animate-pulse bg-primary/5 md:first:col-span-2 md:first:h-56"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-2"
            >
              <Link href={`/projects/${hero.slug}`} className="group block">
                <article className="corp-card corp-shine">
                  <div className="grid md:grid-cols-[1.2fr_1fr]">
                    <div className="relative min-h-[200px] overflow-hidden md:min-h-[280px]">
                      <Image
                        src={hero.image || "/images/placeholder.webp"}
                        alt={hero.title}
                        width={800}
                        height={400}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-900/20 to-transparent" />
                      {hero.is_featured && (
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm dark:bg-neutral-900/90">
                          <TbPinnedFilled size={12} />
                          Featured
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 md:hidden">
                        <h3 className="text-lg font-semibold text-white">
                          {hero.title}
                        </h3>
                      </div>
                    </div>
                    <div className="relative flex flex-col justify-center space-y-4 p-6 md:p-8">
                      <div className="hidden md:block">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          Case study
                        </p>
                        <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 transition group-hover:text-primary dark:text-white">
                          {hero.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {hero.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(hero.stacks || []).slice(0, 5).map((stack) => (
                          <span
                            key={stack}
                            className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary dark:text-primary-300"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {tp("view_project")}
                        <HiOutlineArrowSmRight
                          size={18}
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
              key={project.id || project.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.35,
                delay: 0.06 * (index + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <article className="corp-card corp-shine flex h-full flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={project.image || "/images/placeholder.webp"}
                      alt={project.title}
                      width={480}
                      height={200}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {(project.stacks || []).slice(0, 3).map((stack) => {
                        const s = STACKS[stack];
                        return s ? (
                          <span
                            key={stack}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-sm shadow-sm dark:bg-neutral-900/90"
                          >
                            <span className={s.color}>{s.icon}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-5">
                    <h3 className="font-semibold tracking-tight text-neutral-900 transition group-hover:text-primary dark:text-neutral-100">
                      {project.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {project.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-primary">
                      {tp("view_project")}
                      <HiOutlineArrowSmRight size={14} />
                    </span>
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
        <HiOutlineArrowSmRight size={18} />
      </Link>
    </section>
  );
}
