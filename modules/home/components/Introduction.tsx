"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BiMap } from "react-icons/bi";

import { Link } from "@/i18n/navigation";

import LanyardBadge from "./LanyardBadge";

const Introduction = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white/40 dark:bg-neutral-950/40">
      <div className="corp-mesh absolute inset-0 opacity-80" />
      <div className="corp-grid absolute inset-0 opacity-40" />

      <div className="relative grid min-h-[420px] lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)]">
        {/* Copy */}
        <div className="flex flex-col justify-center space-y-5 p-6 sm:p-8 lg:pr-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-primary dark:bg-neutral-900/80 dark:text-primary-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <BiMap size={13} className="text-primary" />
              {t("location")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/70">
              Software Engineer
            </p>
            <h1 className="text-[1.65rem] font-semibold leading-[1.2] tracking-tight text-neutral-900 dark:text-white sm:text-3xl lg:text-[2.1rem]">
              {t("intro")}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
              {t("resume.paragraph_1")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-1.5"
          >
            {["Laravel", "Next.js", "TypeScript", "Go", "MySQL"].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-neutral-200/80 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="flex flex-wrap gap-2.5 pt-1"
          >
            <Link href="/projects" className="btn-brand">
              Projects
              <HiOutlineArrowSmRight size={16} />
            </Link>
            <Link href="/contact" className="btn-brand-outline">
              Contact
            </Link>
          </motion.div>
        </div>

        {/* Full lanyard panel — no empty dead zone */}
        <div className="relative min-h-[360px] border-t border-primary/10 lg:min-h-full lg:border-l lg:border-t-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent lg:bg-gradient-to-l" />
          <div className="absolute inset-0 flex items-stretch justify-center">
            <LanyardBadge />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
