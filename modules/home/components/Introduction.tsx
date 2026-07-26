"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BiMap } from "react-icons/bi";

import Status from "@/common/components/elements/Status";
import { Link } from "@/i18n/navigation";

const Introduction = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/10 corp-mesh">
      <div className="corp-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-primary-400/15 blur-3xl" />

      <div className="relative space-y-6 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="relative inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/60 dark:text-primary-300">
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Software Engineer · Full Stack
          </p>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            <span className="text-gradient-brand">{t("intro")}</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            {["Laravel", "Next.js", "Go", "System Integration"].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary/10 bg-white/50 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-primary/20 dark:bg-neutral-900/40 dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-2xl space-y-3 text-[15px] leading-7 text-neutral-600 dark:text-neutral-300"
        >
          <p>{t("resume.paragraph_1")}</p>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t("resume.paragraph_2")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-3 pt-1"
        >
          <Link href="/projects" className="btn-brand">
            View projects
            <HiOutlineArrowSmRight size={18} />
          </Link>
          <Link href="/contact" className="btn-brand-outline">
            Contact me
          </Link>
          <div className="hidden items-center sm:flex">
            <Status />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;
