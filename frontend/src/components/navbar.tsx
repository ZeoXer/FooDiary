import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
import { removeAuthToken } from "@/apis/cookie";

export const Navbar = () => {
  const { theme } = useTheme();
  const { isAuthorized } = useAuth();
  const navigate = useNavigate();

  if (!isAuthorized) return null;

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link color="foreground" href="/">
            <Image
              alt="Foodiary Logo"
              src={
                theme === "light"
                  ? "/assets/FooDiary.png"
                  : "/assets/FooDiary-white.png"
              }
              width={60}
            />
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start items-center ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <Button
            className="text-md"
            color="secondary"
            radius="full"
            size="sm"
            variant="bordered"
            onPress={handleLogout}
          >
            登出
          </Button>
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/* <ThemeSwitch /> */}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <ThemeSwitch /> */}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <Button
            className="text-md"
            color="secondary"
            radius="full"
            size="sm"
            variant="bordered"
            onPress={handleLogout}
          >
            登出
          </Button>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
