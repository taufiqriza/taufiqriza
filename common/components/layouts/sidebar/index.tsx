import React from "react";

("use client");

import { MENU_ITEMS } from "@/common/constants/menu";
import useSiteConfig from "@/hooks/useSiteConfig";
import { menuIcons } from "../menuRegistry";

import Copyright from "../../elements/Copyright";
import Breakline from "../../elements/Breakline";
import Profile from "./Profile";
import Menu from "./Menu";

export default function Sidebar() {
  const { data } = useSiteConfig();
  const filteredMenu = data?.menus?.length
    ? data.menus.map((item) => ({
        title: item.title,
        href: item.href,
        icon: menuIcons[item.icon_key || ""] || menuIcons.home,
        isShow: item.is_show,
        isExternal: item.is_external,
        eventName: `Pages: ${item.title}`,
      }))
    : MENU_ITEMS.filter((item) => item.isShow);
  return (
    <header className="lg:w-1/5">
      <div className="sticky top-0 z-10 flex flex-col transition-all duration-300 lg:py-8">
        <Profile />
        <div className="hidden md:block">
          <Breakline />
          <div className="hidden lg:block">
            <Menu list={filteredMenu} />
          </div>
          <Breakline />
          <Copyright />
        </div>
      </div>
    </header>
  );
}
