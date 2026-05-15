"use client";

import GithubIcon from "@/public/github-mark.png";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalSearch } from "@/components/custom/layout/global-search";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { History } from "lucide-react";
import packageJson from "@/package.json";
import { useWebHaptics } from "web-haptics/react";

function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { trigger } = useWebHaptics();
  return (
    <header
      className={cn(
        "border-uic-navy-900/20 dark:border-foreground/15 bg-uic-navy-900 dark:bg-background flex h-fit flex-row items-center justify-between gap-2 border-b px-3 py-3 md:static md:h-15 md:px-5",
        isHomePage ? "relative" : "sticky top-0 z-50"
      )}
    >
      <Link href="/" onClick={() => trigger("nudge")} className="flex-shrink-0">
        <div className="flex flex-row items-center gap-0.75">
          <Image
            src={Logo}
            alt="A logo featuring a finger pointing toward the viewer, an eye, and a wave"
            height={20}
          />
          <div className="relative flex flex-row items-baseline gap-1">
            <h1
              className="dark:text-foreground text-base font-bold text-white opacity-100 md:text-xl"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              YouEyeSea
            </h1>
            <span className="dark:text-foreground hidden font-mono text-[10px] text-white opacity-50 md:inline">
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
                  href="/explore"
                  onClick={() => trigger("nudge")}
                  className="dark:bg-foreground/10 dark:text-foreground dark:hover:bg-foreground/20 dark:data-[active]:bg-foreground/10 flex h-9 items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 hover:text-white md:px-4"
                >
                  Explore
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="https://github.com/alexjohntomy/you-eye-sea"
                  onClick={() => trigger("nudge")}
                  className="inset-shadow-2xl shadow-primary bg-uic-red-600 hover:bg-uic-red-600 hover:text-white flex h-9 min-w-10 items-center justify-center rounded-md px-2 py-2 text-sm font-semibold text-white opacity-90 shadow-lg transition-colors hover:opacity-100 md:px-4"
                >
                  <div className="group relative flex h-full w-full flex-row items-center justify-center gap-2 md:min-w-15 md:gap-3">
                    <Image
                      src={GithubIcon}
                      alt="Github Icon"
                      height={18}
                      className="brightness-1000"
                    />
                    <h4 className="hidden text-sm md:block">Github</h4>
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/changelog"
                  onClick={() => trigger("nudge")}
                  className="dark:text-foreground/50 dark:hover:text-foreground dark:active:text-foreground flex h-9 items-center justify-center rounded-md bg-transparent! py-2 pr-0 pl-1 font-semibold text-white/70 opacity-80 transition-colors hover:bg-transparent hover:text-white hover:opacity-100 active:bg-transparent active:text-white md:pl-3"
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
