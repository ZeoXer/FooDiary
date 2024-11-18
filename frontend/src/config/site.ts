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
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
