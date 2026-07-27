import {
  BiBook,
  BiCategory,
  BiCollection,
  BiHomeCircle,
  BiUser,
} from "react-icons/bi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { PiCertificate, PiChatTeardropDotsBold } from "react-icons/pi";
import { VscHubot } from "react-icons/vsc";

const size = 20;

export const menuIcons: Record<string, JSX.Element> = {
  home: <BiHomeCircle size={size} />,
  about: <BiUser size={size} />,
  projects: <BiCollection size={size} />,
  dashboard: <BiCategory size={size} />,
  contact: <BiBook size={size} />,
  contents: <IoPhonePortraitOutline size={size} />,
  achievements: <PiCertificate size={size} />,
  chat: <PiChatTeardropDotsBold size={size} />,
  "chat-room": <PiChatTeardropDotsBold size={size} />,
  "smart-talk": <VscHubot size={size} />,
};
