"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { BsArrowRightShort as ExternalLinkIcon } from "react-icons/bs";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslations } from "next-intl";

import { MenuItemProps } from "@/common/types/menu";
import { useMenu } from "@/common/stores/menu";
import SpotlightCard from "../../elements/SpotlightCard";

const MenuItem = ({
  title,
  href,
  icon,
  onClick,
  className = "",
  isHover,
  children,
  isExclusive,
}: MenuItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { hideMenu } = useMenu();
  const isExternalUrl = href?.includes("http");
  const isHashLink = href === "#";

  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const isActive = pathname === href;
  const t = useTranslations("Navigation");

  const activeClasses = `${
    isExclusive
      ? "my-1 flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-primary/5 px-4 py-2 text-primary shadow-[inset_0_0_0_1px_rgba(6,92,194,0.08)] hover:from-primary/20 dark:border-primary/40 dark:text-primary-300 lg:transition-all lg:duration-300"
      : `
        flex items-center gap-2 py-2 px-4 
        text-neutral-700 dark:text-neutral-400 
        hover:text-neutral-900 hover:dark:text-neutral-300 
        rounded-lg group 
      ${
        pathname === href
          ? "bg-gradient-to-r from-primary/15 to-transparent text-primary dark:!text-primary-300 border border-primary/15"
          : "hover:dark:lg:bg-neutral-800/80 hover:dark:!text-neutral-300 hover:lg:bg-primary/5 hover:lg:rounded-lg lg:transition-all lg:duration-300"
      }`
  }`;

  const handleClick = () => {
    hideMenu();
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const elementProps = {
    className: `${activeClasses} ${className}`,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  const isActiveRoute = pathname === href;

  const itemComponent = () => {
    return (
      <div {...elementProps}>
        {!isExclusive ? (
          <>
            <div
              className={clsx(
                "transition-all duration-300 group-hover:-rotate-12",
                isActiveRoute && "animate-pulse",
              )}
            >
              {icon}
            </div>
            <div className="flex-grow">{t(title)}</div>
            {children && <>{children}</>}
            {isActiveRoute && (
              <ExternalLinkIcon
                size={22}
                className="animate-pulse text-gray-500"
              />
            )}
            {isExternalUrl && isHovered && (
              <ExternalLinkIcon
                size={22}
                className="-rotate-45 text-gray-500 lg:transition-all lg:duration-300"
              />
            )}
          </>
        ) : (
          <>
            <div
              className={clsx(
                "transition-all duration-300 group-hover:-rotate-12",
                isActiveRoute && "animate-pulse",
              )}
            >
              {icon}
            </div>
            <div className="flex-grow">{t(title)}</div>
          </>
        )}
      </div>
    );
  };

  return isHashLink ? (
    <div className="cursor-pointer">{itemComponent()}</div>
  ) : (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={href}
      target={isExternalUrl ? "_blank" : ""}
      onClick={handleClick}
    >
      {itemComponent()}
    </Link>
  );
};

export default MenuItem;
