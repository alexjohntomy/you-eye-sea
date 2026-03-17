"use client";

import GithubIcon from "@/public/github-mark.png";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalSearch } from "@/components/custom/layout/global-search";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { History } from "lucide-react";
import packageJson from "@/package.json";

function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <header className="sticky top-0 z-50 md:static border-uic-navy-900/20 dark:border-foreground/15 bg-uic-navy-900 dark:bg-background flex h-fit flex-col items-center justify-between gap-3 border-b px-5 py-5 md:h-15 md:flex-row">
      <Link href="/">
        <div className="flex flex-row items-start">
          <Image
            src={Logo}
            alt="A logo featuring a finger pointing toward the viewer, an eye, and a wave"
            height={25}
          />
          <div className="top-.5 relative flex flex-row items-baseline gap-1">
            <h1
              className="dark:text-foreground text-xl text-white opacity-100"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
            >
              YouEyeSea
            </h1>
            <span className="dark:text-foreground font-mono text-[10px] text-white opacity-50">
              v{packageJson.version}
            </span>
          </div>
        </div>
      </Link>
      {!isHomePage && <GlobalSearch />}
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex w-full flex-wrap">
          <div className="flex flex-row items-center gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="dark:bg-foreground/10 dark:text-foreground dark:hover:bg-foreground/8 dark:data-[active]:bg-foreground/10 flex h-9 items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white opacity-80 transition-colors hover:bg-white/20 hover:text-white hover:opacity-100"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/explore"
                  className="dark:bg-foreground/10 dark:text-foreground dark:hover:bg-foreground/8 dark:data-[active]:bg-foreground/10 flex h-9 items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white opacity-80 transition-colors hover:bg-white/20 hover:text-white hover:opacity-100"
                >
                  Explore
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/github"
                  className="inset-shadow-2xl shadow-primary bg-uic-red-600 hover:bg-uic-red-600 hover:text-background flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white opacity-90 shadow-lg transition-colors hover:opacity-100"
                >
                  <div className="group relative flex h-full w-full min-w-15 flex-row items-center justify-center gap-3">
                    <Image
                      src={GithubIcon}
                      alt="Github Icon"
                      height={18}
                      className="visible brightness-1000 filter group-hover:invisible"
                    />
                    <h4 className="visible text-sm group-hover:invisible">
                      Github
                    </h4>
                    <h4 className="invisible absolute inset-0 m-auto h-fit w-fit text-center text-xs group-hover:visible md:text-nowrap">
                      Coming Soon
                    </h4>
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/changelog"
                  className="dark:text-foreground/50 dark:hover:text-foreground dark:active:text-foreground -ml-2 flex h-9 items-center justify-center rounded-md bg-transparent! pl-3 pr-0 py-2 font-semibold text-white/70 opacity-80 transition-colors hover:bg-transparent hover:text-white hover:opacity-100 active:bg-transparent active:text-white"
                  title="Changelog"
                >
                  <History size={18} />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export { Header };
