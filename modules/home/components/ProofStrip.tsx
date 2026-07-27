"use client";

import { motion, useReducedMotion } from "framer-motion";

const proof = [
  { value: "5+", label: "Years shipping software" },
  { value: "12+", label: "Products & systems" },
  { value: "10K+", label: "Academic records served" },
  { value: "15+", label: "System integrations" },
];

export default function ProofStrip() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-2 overflow-hidden rounded-2xl border border-primary/10 bg-white/55 dark:bg-neutral-950/45 md:grid-cols-4"
      aria-label="Professional highlights"
    >
      {proof.map((item, index) => (
        <div
          key={item.label}
          className={`px-4 py-4 ${
            index % 2 ? "border-l" : ""
          } border-primary/10 md:border-l md:first:border-l-0`}
        >
          <p className="text-xl font-semibold tracking-tight text-primary">
            {item.value}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {item.label}
          </p>
        </div>
      ))}
    </motion.section>
  );
}
