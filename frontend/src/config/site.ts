export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FooDiary",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "儀錶板",
      href: "/dashboard",
    },
    {
      label: "聊天室",
      href: "/chatbox",
    },
    {
      label: "個人檔案",
      href: "/profile",
    },
  ],
  navMenuItems: [
    {
      label: "儀錶板",
      href: "/dashboard",
    },
    {
      label: "聊天室",
      href: "/chatbox",
    },
    {
      label: "個人檔案",
      href: "/profile",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export const informationMap = {
  biologicalSex: {
    female: 0,
    male: 1,
  },
  exerciseFrequency: {
    never: 0,
    "1-3": 1,
    "4-5": 2,
    "6-7": 3,
    0: 0,
    1: "1-3",
    2: "4-5",
    3: "6-7",
  },
};
