import { Badge } from "@/components/ui/badge";
import { ChangelogItem } from "@/components/custom/changelog/changelog-item";
import { Sparkles, Bug, Wrench, Zap, Rocket, Shield } from "lucide-react";

export const metadata = {
  title: "Changelog",
  description:
    "Stay up to date with the latest changes and improvements to YouEyeSea.",
};

export default function ChangelogPage() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden px-6 pt-12 pb-24 animate-in fade-in duration-700">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3">
          <h3 className="text-foreground text-2xl font-black tracking-tight md:text-3xl">
            Changelog
          </h3>
        </div>

        {/* Versions */}
        <div className="relative">
          <ChangelogItem
            version="1.5.1"
            date="March 16, 2026"
            groups={[
              {
                title: "UI/UX & Navigation",
                icon: Sparkles,
                changes: [
                  {
                    description:
                      "Introduced a new command palette (cmd+k) and made numerous UI/UX improvements. Added preset buttons on the explore page, refined the OpenGraph image, and rolled out various fixes for charts and medium-sized screens.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.5.0"
            date="March 14, 2026"
            groups={[
              {
                title: "Polish & Speed",
                icon: Zap,
                changes: [
                  {
                    description:
                      "Completed a major cleanup session. Squashed 'any' types for improved stability and upgraded core packages like Prisma and React to their latest versions. Added caching to make pages feel snappier.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.4.0"
            date="February 2026"
            groups={[
              {
                title: "New Data & RMP",
                icon: Wrench,
                changes: [
                  {
                    description:
                      "Integrated fresh Fall semester data. Added a handy button to jump straight to Rate My Professors from search results and patched several security vulnerabilities.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.3.0"
            date="January 2026"
            groups={[
              {
                title: "Mobile Love",
                icon: Zap,
                changes: [
                  {
                    description:
                      "Major overhaul for mobile devices. Replaced menus with smooth bottom drawers and fixed accidental zoom issues on mobile Safari. Added a sitemap for improved SEO indexing.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.2.0"
            date="December 2025"
            groups={[
              {
                title: "Search & Trends",
                icon: Sparkles,
                changes: [
                  {
                    description:
                      "Enhanced search functionality with advanced filtering. Enabled the 'trending' section and introduced subtle animations for a more dynamic experience.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.1.0"
            date="November 2025"
            groups={[
              {
                title: "Smooth Sailing",
                icon: Sparkles,
                changes: [
                  {
                    description:
                      "Focused on overall feel and performance. Sped up loading animations, introduced scrollable charts for large data sets, and ensured full Safari compatibility.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="1.0.0"
            date="November 7, 2025"
            groups={[
              {
                title: "The Big Launch",
                icon: Rocket,
                changes: [
                  {
                    description:
                      "Official project launch. Introduced drop rates, grade percentages, and direct links to the course catalog. Initiated code cleanup in preparation for open sourcing.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="0.5.0"
            date="October 2025"
            groups={[
              {
                title: "Pre-launch Polish",
                icon: Wrench,
                changes: [
                  {
                    description:
                      "Solidified the foundation. Implemented initial SEO enhancements, basic charting, and the first iteration of the course rating system.",
                  },
                ],
              },
            ]}
          />

          <ChangelogItem
            version="0.1.0"
            date="August 2025"
            groups={[
              {
                title: "The First Commit",
                icon: Rocket,
                changes: [
                  {
                    description:
                      "Beginning of project development. Established core architecture and launched initial functional pages.",
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* Background patterns */}
      <div className="bg-gradient-uic fixed inset-0 -z-10 pointer-events-none opacity-5 dark:opacity-[0.03]" />
      <div className="fixed inset-0 -z-10 pointer-events-none h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[30px_30px]" />
    </div>
  );
}
