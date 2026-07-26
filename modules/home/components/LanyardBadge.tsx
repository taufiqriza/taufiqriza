"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useRef } from "react";
import { MdVerified } from "react-icons/md";

import Image from "@/common/components/elements/Image";
import { METADATA } from "@/common/constants/metadata";

/**
 * Lightweight lanyard + ID card (Framer Motion springs).
 * Inspired by react-bits Lanyard physics, without Three.js/Rapier weight.
 */
export default function LanyardBadge() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 140, damping: 16, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 140, damping: 16, mass: 0.7 });

  // Strap follows card with slight lag feel via rotation from drag offset
  const rotate = useTransform(springX, [-120, 120], [-14, 14]);
  const strapRotate = useTransform(springX, [-120, 120], [-8, 8]);
  const strapHeight = useTransform(springY, [-40, 160], [56, 120]);
  const clipY = useTransform(springY, (v) => v * 0.15);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // gentle settle back toward center with residual spring
    const settle = 0.35;
    x.set(info.offset.x * settle * 0.15);
    y.set(Math.max(0, info.offset.y * settle * 0.1));
    // then release to rest
    requestAnimationFrame(() => {
      x.set(0);
      y.set(0);
    });
  };

  return (
    <div
      ref={constraintsRef}
      className="relative mx-auto flex h-[340px] w-full max-w-[280px] select-none items-start justify-center sm:h-[380px]"
      aria-label="Interactive ID badge — drag the card"
    >
      {/* Ceiling mount */}
      <div className="absolute top-0 z-20 flex flex-col items-center">
        <div className="h-2 w-10 rounded-full bg-gradient-to-b from-neutral-300 to-neutral-400 shadow-sm dark:from-neutral-600 dark:to-neutral-700" />
        <div className="h-1.5 w-3 rounded-b-sm bg-neutral-400 dark:bg-neutral-600" />
      </div>

      {/* Strap */}
      <motion.div
        style={{ rotate: strapRotate, height: strapHeight }}
        className="absolute top-3 z-10 w-[10px] origin-top rounded-full bg-gradient-to-b from-primary-800 via-primary to-primary-600 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
      >
        <div className="absolute inset-x-0 top-0 h-full bg-[repeating-linear-gradient(180deg,transparent,transparent_6px,rgba(255,255,255,0.08)_6px,rgba(255,255,255,0.08)_7px)] opacity-80" />
      </motion.div>

      {/* Clip ring */}
      <motion.div
        style={{ x: springX, y: clipY }}
        className="absolute top-[52px] z-20 flex h-5 w-5 items-center justify-center rounded-full border-2 border-neutral-400 bg-gradient-to-br from-neutral-200 to-neutral-400 shadow dark:border-neutral-500 dark:from-neutral-500 dark:to-neutral-700 sm:top-[64px]"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-neutral-600 dark:bg-neutral-300" />
      </motion.div>

      {/* Card */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.18}
        dragMomentum={false}
        onDrag={(_, info) => {
          x.set(info.offset.x);
          y.set(info.offset.y);
        }}
        onDragEnd={onDragEnd}
        style={{ x: springX, y: springY, rotate }}
        whileTap={{ cursor: "grabbing", scale: 1.02 }}
        className="absolute top-[62px] z-30 w-[200px] cursor-grab touch-none sm:top-[74px] sm:w-[220px]"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-primary-900 via-primary to-primary-700 p-[1px] shadow-[0_20px_50px_-20px_rgba(6,92,194,0.55)]">
          <div className="relative overflow-hidden rounded-[15px] bg-white dark:bg-neutral-950">
            {/* Brand bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary-900 to-primary px-3 py-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/90">
                Portfolio
              </span>
              <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white">
                ID
              </span>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <Image
                    src={METADATA.profile}
                    alt={METADATA.creator}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20"
                    rounded="rounded-xl"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                      Taufiq Riza
                    </p>
                    <MdVerified className="shrink-0 text-primary" size={14} />
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Software Engineer
                  </p>
                  <p className="text-[10px] text-primary">@taufiqriza</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-primary/[0.04] p-2.5 dark:bg-primary/10">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-400">
                    Focus
                  </p>
                  <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Full Stack
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-400">
                    Stack
                  </p>
                  <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Laravel · Next
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400">Drag me</span>
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-primary-400" />
              </div>
            </div>

            {/* subtle shine */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-40 dark:from-white/5" />
          </div>
        </div>
      </motion.div>

      <p className="absolute bottom-1 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
        Pull the badge — spring physics
      </p>
    </div>
  );
}
