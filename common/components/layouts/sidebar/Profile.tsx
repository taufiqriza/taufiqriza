"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import ProfileHeader from "./ProfileHeader";
import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";

const Profile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageSize = isMobile ? 40 : 100;

  return (
    <div
      className={clsx(
        "fixed inset-x-0 top-0 z-30 border-b border-primary/10 bg-white/85 px-4 py-3 shadow-[0_4px_24px_-12px_rgba(6,92,194,0.2)] backdrop-blur-xl dark:border-primary/15 dark:bg-neutral-950/85 lg:relative lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:hidden" />
      <div className="flex items-center justify-between lg:flex-col lg:space-y-4">
        <ProfileHeader expandMenu={false} imageSize={imageSize} />
        {isMobile && (
          <div className="flex items-center gap-3">
            <IntlToggle />
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
