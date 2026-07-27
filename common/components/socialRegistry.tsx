import { BsGithub, BsInstagram, BsLinkedin, BsLink45Deg } from "react-icons/bs";
import { SiGmail } from "react-icons/si";

export const socialIcons: Record<string, (size: number) => JSX.Element> = {
  gmail: (size) => <SiGmail size={size} />,
  email: (size) => <SiGmail size={size} />,
  github: (size) => <BsGithub size={size} />,
  instagram: (size) => <BsInstagram size={size} />,
  linkedin: (size) => <BsLinkedin size={size} />,
  link: (size) => <BsLink45Deg size={size} />,
};

export const socialStyles: Record<
  string,
  {
    textColor: string;
    backgroundColor: string;
    borderColor: string;
    backgroundGradientColor: string;
  }
> = {
  gmail: {
    textColor: "text-red-100",
    backgroundColor: "bg-red-200",
    borderColor: "border-red-200",
    backgroundGradientColor: "bg-gradient-to-br from-red-700 to-red-950",
  },
  instagram: {
    textColor: "text-pink-100",
    backgroundColor: "bg-pink-200",
    borderColor: "border-pink-200",
    backgroundGradientColor:
      "bg-gradient-to-br from-purple-800 via-pink-700 to-orange-600",
  },
  linkedin: {
    textColor: "text-sky-100",
    backgroundColor: "bg-sky-200",
    borderColor: "border-sky-200",
    backgroundGradientColor: "bg-gradient-to-br from-sky-700 to-blue-950",
  },
  github: {
    textColor: "text-slate-100",
    backgroundColor: "bg-slate-200",
    borderColor: "border-slate-200",
    backgroundGradientColor: "bg-gradient-to-br from-slate-800 to-slate-950",
  },
  link: {
    textColor: "text-primary-100",
    backgroundColor: "bg-primary-200",
    borderColor: "border-primary-200",
    backgroundGradientColor:
      "bg-gradient-to-br from-primary-800 to-primary-950",
  },
};
