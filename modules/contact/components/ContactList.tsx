"use client";

import { useTranslations } from "next-intl";

import { SOCIAL_MEDIA } from "@/common/constants/socialMedia";
import { socialIcons, socialStyles } from "@/common/components/socialRegistry";
import useSiteConfig from "@/hooks/useSiteConfig";

import ContactCard from "./ContactCard";

const ContactList = () => {
  const { data } = useSiteConfig();
  const configured = (data?.social || []).map((social) => {
    const key = (social.icon_key || social.name || "link").toLowerCase();
    const icon = socialIcons[key] || socialIcons.link;
    const style = socialStyles[key] || socialStyles.link;
    return {
      title: social.title,
      description: social.description || undefined,
      name: social.name,
      href: social.href,
      icon: icon(35),
      backgroundIcon: icon(275),
      isShow: social.is_show,
      ...style,
    };
  });
  const filteredSocialMedia = configured.length
    ? configured
    : SOCIAL_MEDIA.filter((social) => social.isShow);
  const t = useTranslations("ContactPage");

  return (
    <div className="flex flex-col space-y-4">
      <h2>{t("social_media.title")}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredSocialMedia.map((media) => (
          <ContactCard key={media.title} {...media} />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
