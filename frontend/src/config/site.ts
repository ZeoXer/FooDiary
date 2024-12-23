export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FooDiary",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Signup",
      href: "/signup",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Info Form",
      href: "/info-form",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "chatbox",
      href: "/chatbox",
    },
    {
      label: "FoodRecord",
      href: "/FoodRecord",
    },
    {
      label: "FoodContent",
      href: "/FoodContent",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Signup",
      href: "/signup",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Info Form",
      href: "/info-form",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "chatbox",
      href: "/chatbox",
    },
    {
      label: "FoodRecord",
      href: "/FoodRecord",
    },
    {
      label: "FoodContent",
      href: "/FoodContent",
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
