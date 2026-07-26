"use client";

import { useState } from "react";
import { RiChatSmile2Line as ChatIcon } from "react-icons/ri";
import { RiChatSmile3Line as ChatIconHover } from "react-icons/ri";
import useChatStore from "@/common/stores/chat";
import ChatWidget from "./ChatWidget";
import useIsMobile from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";

const ChatButton = () => {
  const { isOpen, toggleChat } = useChatStore();
  const [isHover, setIsHover] = useState(false);

  const router = useRouter();

  const isMobile = useIsMobile();

  const handleClick = () => {
    isMobile ? router.push("/chat") : toggleChat();
  };

  return (
    <>
      <div
        className="cursor-pointer rounded-full border border-primary/20 bg-gradient-to-br from-primary to-primary-800 p-3 text-white shadow-[0_10px_30px_-10px_rgba(6,92,194,0.7)] transition duration-300 hover:scale-105 active:scale-95"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleClick}
        data-umami-event="click_chat_button"
      >
        {isHover ? <ChatIconHover size={23} /> : <ChatIcon size={23} />}
      </div>
      {!isMobile && isOpen && <ChatWidget />}
    </>
  );
};

export default ChatButton;
