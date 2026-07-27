"use client";

import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import ChatButton from "../../../modules/chat/components/ChatButton";

import BottomNav from "./BottomNav";
import Sidebar from "./sidebar";

const Notif = dynamic(() => import("../elements/Notif"), { ssr: false });

interface LayoutsProps {
  children: React.ReactNode;
}

const Layouts = ({ children }: LayoutsProps) => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes("/admin");
  const isShowChatButton = !pathname?.includes("/chat") && !isAdmin;

  useEffect(() => {
    if (!isAdmin) {
      AOS.init({
        duration: 700,
        delay: 40,
        once: true,
        easing: "ease-out-cubic",
      });
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20" />
        <div className="absolute -right-16 bottom-32 h-64 w-64 rounded-full bg-primary-400/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-7xl lg:px-12">
        <div className="mx-auto flex flex-col lg:flex-row lg:gap-6 lg:py-6">
          <Sidebar />
          <main className="bottom-nav-safe w-full max-w-[854px] transition-all duration-300 lg:w-4/5">
            {children}
          </main>
        </div>
      </div>

      <BottomNav />
      <Notif />
      {isShowChatButton && (
        <div className="fixed bottom-[calc(5.5rem+var(--safe-bottom))] right-4 z-30 lg:bottom-6 lg:right-6">
          <ChatButton />
        </div>
      )}
    </div>
  );
};

export default Layouts;
