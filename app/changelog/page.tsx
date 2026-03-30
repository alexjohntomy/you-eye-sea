import { ChangelogItem } from "@/components/custom/changelog/changelog-item";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent updates to YouEyeSea.com",
};

export default function ChangelogPage() {
  return (
    <div className="animate-in fade-in absolute inset-0 flex flex-col overflow-x-hidden overflow-y-auto px-6 pt-12 pb-24 duration-700">
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
            description="Added a command palette (cmd+k) for easy navigation and made lots of minor UI/UX improvements. Added preset buttons on the explore page, refined the OpenGraph image, and rolled out various fixes for charts and medium-sized screens."
          />

          <ChangelogItem
            version="1.5.0"
            date="March 14, 2026"
            description="Replaced 'any' types with proper type annotations, upgraded packages. Added caching across the board."
          />

          <ChangelogItem
            version="1.4.0"
            date="February 2026"
            description="Integrated fresh Fall semester data. Added a link to Rate My Professors and Reddit from course details page. Updated to patch React vulnerability."
          />

          <ChangelogItem
            version="1.3.0"
            date="December 2025"
            description="Improvements to responsiveness on for mobile devices. Replaced menus with smooth bottom drawers and fixed accidental zoom issues on mobile Safari. Added a sitemap for improved SEO indexing."
          />

          <ChangelogItem
            version="1.2.0"
            date="December 2025"
            description="Added an advanced search/explore page based on user feedback. Added the 'trending' section and introduced more subtle animations."
          />

          <ChangelogItem
            version="1.1.0"
            date="November 2025"
            description="Sped up loading animations, introduced scrollable charts for large data sets, and improved Safari compatibility. Added analytics."
          />

          <ChangelogItem
            version="1.0.0"
            date="November 7, 2025"
            description="Official project launch. Introduced drop rates, grade percentages, and direct links to the course catalog. Initiated code cleanup in preparation for open sourcing."
          />

          <ChangelogItem
            version="0.7.0"
            date="October 2025"
            description="Improvements to grade distribution chart, UI polish, placeholder panes replaced with actual course data."
          />

          <ChangelogItem
            version="0.5.0"
            date="September 2025"
            description="Wrote seed scripts and populated prisma database with data from CSVs. Added search and course details page."
          />

          <ChangelogItem
            version="0.1.0"
            date="August 2025"
            description="Set up Next.js project, shadcn/ui, and started work on the Prisma table schema."
          />
        </div>
      </div>

      {/* Background patterns */}
      <div className="bg-gradient-uic pointer-events-none fixed inset-0 -z-10 opacity-5 dark:opacity-[0.03]" />
      <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[30px_30px]" />
    </div>
  );
}
