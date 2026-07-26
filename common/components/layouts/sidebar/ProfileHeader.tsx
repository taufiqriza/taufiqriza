import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";

import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";
import Tooltip from "../../elements/Tooltip";
import Image from "../../elements/Image";

import cn from "@/common/libs/clsxm";

interface ProfileHeaderProps {
  expandMenu: boolean;
  imageSize: number;
}

const ProfileHeader = ({ expandMenu, imageSize }: ProfileHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-grow items-center gap-4 lg:flex-col  lg:gap-0.5",
        expandMenu && "flex-col !items-start",
      )}
    >
      <Image
        src={"/images/taufiq.jpg"}
        width={expandMenu ? 80 : imageSize * 1}
        height={expandMenu ? 80 : imageSize * 1}
        alt="Muhamad Taufiq Riza"
        className="border-2 border-primary/25 ring-2 ring-primary/10 dark:border-primary/30 lg:hover:scale-105"
        rounded="rounded-full"
      />

      <div className="mt-1 flex items-center gap-2 lg:mt-4">
        <Link href="/" passHref>
          <h2 className="flex-grow text-base font-semibold tracking-tight lg:text-xl">
            <span className="lg:hidden">Taufiq Riza</span>
            <span className="hidden lg:inline">Muhamad Taufiq Riza</span>
          </h2>
        </Link>

        <Tooltip title="Verified">
          <VerifiedIcon size={18} className="text-blue-400" />
        </Tooltip>
      </div>

      <div className="hidden text-sm text-neutral-600 transition-all duration-300 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-400 lg:flex">
        @taufiqriza
      </div>

      <div className="hidden justify-between gap-6 lg:mt-4 lg:flex">
        <IntlToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ProfileHeader;
