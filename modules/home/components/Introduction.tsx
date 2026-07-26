"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BiMap } from "react-icons/bi";

import Status from "@/common/components/elements/Status";
import { Link } from "@/i18n/navigation";

import LanyardBadge from "./LanyardBadge";

const fade = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Introduction = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/10">
      <div className="corp-mesh absolute inset-0" />
      <div className="corp-grid absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:gap-4 lg:p-8">
        <div className="space-y-5">
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/70 dark:text-primary-300">
              <span className="status-pulse relative flex h-2 w-2">
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              Available for work
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <BiMap size={14} className="text-primary" />
              {t("location")}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
              Software Engineer · Full Stack
            </p>
            <h1 className="max-w-lg text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              <span className="text-gradient-brand">{t("intro")}</span>
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {["Laravel", "Next.js", "Go", "Integration"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-primary/10 bg-white/60 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-primary/20 dark:bg-neutral-900/50 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="max-w-xl space-y-2.5 text-sm leading-7 text-neutral-600 dark:text-neutral-300 sm:text-[15px]"
          >
            <p>{t("resume.paragraph_1")}</p>
            <p className="text-neutral-500 dark:text-neutral-400">
              {t("resume.paragraph_2")}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <Link href="/projects" className="btn-brand">
              View projects
              <HiOutlineArrowSmRight size={18} />
            </Link>
            <Link href="/contact" className="btn-brand-outline">
              Contact
            </Link>
            <div className="hidden sm:block">
              <Status />
            </div>
          </motion.div>
        </div>

        {/* Lanyard — desktop side, mobile below */}
        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-[280px] lg:mx-0"
        >
          <LanyardBadge />
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;
