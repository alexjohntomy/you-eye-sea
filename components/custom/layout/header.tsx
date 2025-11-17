"use client";

import { Badge } from "@/components/ui/badge";
import GithubIcon from "@/public/github-mark.png";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function Header() {
  const isMobile = useIsMobile();
  return (
    <header className="flex px-5 flex-col gap-3 py-5 md:flex-row border-b border-foreground/15 justify-between items-center bg-background shadow-[inset_0px_-6px_10px_2px_var(--inset-color)] h-fit md:h-15">
      <Link href="/">
        <div className="flex flex-row">
          <Image
            src={Logo}
            alt="A logo featuring a finger pointing toward the viewer, an eye, and a wave"
            height={25}
            className="filter contrast-115"
          />
          <h1 className="font-black text-l opacity-100 relative top-.5 text-#001e62">
            YouEyeSea
          </h1>
        </div>
      </Link>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="w-full flex flex-wrap">
          <div className="flex flex-row gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/"
                  className="opacity-80 bg-foreground/10 hover:opacity-80 hover:bg-accent/30 hover:text-uic-navy-900 font-semibold"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/explore"
                  className="opacity-80 bg-foreground/10 hover:opacity-80 hover:bg-accent/30 hover:text-uic-navy-900 font-semibold relative"
                >
                    <motion.div className="flex flex-row justify-evenly gap-2 w-fit items-center relative left-[3.5]"
                        initial={{ opacity: 1, scale: 1.05, y: 0}}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ ease: "easeInOut", duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    >
                    Explore
                    <Badge
                      variant="default"
                      className="relative bg-secondary text-xs px-3 py-[3] rounded-sm"
                    >
                      New!
                    </Badge>
                    </motion.div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href="/github"
                  className="flex flex-row gap-2 bg-uic-red-600 opacity-90 inset-shadow-2xl hover:bg-uic-red-600 hover:text-background hover:opacity-100 font-semibold text-white shadow-lg shadow-primary"
                >
                  <div className="flex flex-row gap-3 group relative w-full h-full">
                    <Image
                      src={GithubIcon}
                      alt="Github Icon"
                      height={20}
                      className="filter brightness-1000 visible group-hover:invisible"
                    />
                    <h4 className="text-s visible group-hover:invisible">
                      Github
                    </h4>
                    <h4 className="text-xs invisible group-hover:visible absolute inset-0 m-auto w-fit h-fit">
                      Coming Soon
                    </h4>
                  </div>
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
