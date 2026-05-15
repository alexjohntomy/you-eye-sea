"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const UICIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="125.3275 233.7674 206.76 206.76"
    width="1em"
    height="1em"
    className={className}
    fill="currentColor"
  >
    <path
      d="M105.72,3.55A103.38,103.38,0,1,0,209.1,106.92,103.37,103.37,0,0,0,105.72,3.55ZM47.27,126.12c1.59,1.88,4.16,2.78,7.94,2.78s6.34-.9,7.93-2.78,2.28-5,2.28-9.52V76.34H85.65V116.2c0,9.43-1,14-3.68,18.55-4.46,7.44-16.36,10.31-26.76,10.31s-22.32-2.87-26.78-10.31c-2.68-4.57-3.67-9.12-3.67-18.55V76.34H45V116.6C45,121.16,45.59,124.14,47.27,126.12Zm50.67,17.65V76.34h20.22v67.43ZM161.5,145C140.18,145,128,130.68,128,110.05s12.89-34.89,33.92-34.89c16.06,0,25.57,9.21,28.94,18l-17.54,8.43c-1.69-6.55-5.36-10.41-11.71-10.41-8.62,0-13,7.14-13,18.83s4.37,18.55,13,18.55c6,0,9.43-3.17,11.31-8.43l18.34,6.54C186.49,137.52,176.86,145,161.5,145Z"
      transform="matrix(1, 0, 0, 1, 122.98745369911194, 230.21739506721497)"
    />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    className={className}
    viewBox="0 0 16 16"
  >
    <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z" />
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165" />
  </svg>
);

const RMPIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="90.199 512.21 224 128.3"
    width="1.74em"
    height="1em"
    className={className}
  >
    <path
      d="M 147.999 586.01 L 160.009 586.01 L 148.509 568.19 C 154.449 566.25 157.449 561.94 157.449 556.89 C 157.449 550.2 152.519 545.05 142.319 545.05 L 126.039 545.05 L 126.039 586.01 L 136.089 586.01 L 136.089 569.51 L 138.409 569.51 L 147.999 586.01 Z M 141.449 552.05 C 145.759 552.05 147.649 554.36 147.649 557.24 C 147.649 560.13 146.119 562.6 141.239 562.6 L 136.089 562.6 L 136.089 552.05 L 141.449 552.05 Z M 314.199 512.21 L 314.199 619.61 L 143.999 619.61 L 106.149 640.51 L 109.619 619.61 L 90.199 619.61 L 90.199 512.21 L 314.199 512.21 Z M 180.029 586.01 L 188.249 586.01 L 188.249 556.78 L 188.409 556.78 L 199.229 586.01 L 205.759 586.01 L 216.469 556.89 L 216.629 556.89 L 216.629 586.01 L 226.009 586.01 L 226.009 545.05 L 211.989 545.05 L 202.929 571.5 L 202.819 571.5 L 193.699 545.05 L 180.029 545.05 L 180.029 586.01 Z M 252.829 584.58 L 263.189 584.58 L 263.189 568.83 L 267.499 568.83 C 277.699 568.83 283.539 563.78 283.539 556.12 C 283.539 548.67 277.809 544.26 268.689 544.26 L 252.829 544.26 L 252.829 584.58 Z M 267.289 550.58 C 271.599 550.58 273.439 553.49 273.439 556.32 C 273.439 558.74 272.069 561.88 267.289 561.88 L 263.189 561.88 L 263.189 550.58 L 267.289 550.58 Z"
      fill="currentColor"
      style={{ strokeWidth: 1 }}
      transform="matrix(1, 0, 0, 1, 0, -2.842170943040401e-14)"
    />
  </svg>
);

interface CourseActionButtonsProps {
  courseName: string;
  courseNumber: string;
  selectedProfessorName: string;
}

export function CourseActionButtons({
  courseName,
  courseNumber,
  selectedProfessorName,
}: CourseActionButtonsProps) {
  // Build URLs
  const catalogURL =
    "https://catalog.uic.edu/ucat/course-descriptions/" +
    courseName.toLowerCase() +
    "/#:~:text=" +
    encodeURIComponent(`${courseName} ${courseNumber}`);

  const rmpURL =
    "https://www.ratemyprofessors.com/search/professors/1111?q=" +
    encodeURIComponent(selectedProfessorName);

  const redditSearchQuery = selectedProfessorName
    ? (selectedProfessorName.split(" ").pop() ?? "")
    : `${courseName} ${courseNumber}`;
  const redditURL =
    "https://www.reddit.com/r/uichicago/search/?q=" +
    encodeURIComponent(redditSearchQuery);

  return (
    <LayoutGroup key={`${courseName}-${courseNumber}`}>
      <div className="flex min-w-full flex-col gap-2 xl:flex-row">
        <motion.div
          layout
          className="flex-1"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          <Link href={catalogURL}>
            <Badge
              variant="outline"
              className="bg-uic-red-500/10 border-uic-red-500/15 hover:bg-uic-red-500/20 text-uic-red-500 relative h-8.5 w-full flex-row justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
            >
              View in Course Catalog
              <UICIcon className="relative size-3.75! opacity-90" />
            </Badge>
          </Link>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {selectedProfessorName && (
            <motion.div
              key="rmp-button"
              layout
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="flex-1"
            >
              <Link href={rmpURL}>
                <Badge
                  variant="outline"
                  className="bg-badge-bg/10 dark:bg-blue-400/10 text-badge-bg dark:text-blue-400 border-badge-bg/15 dark:border-blue-400/15 hover:bg-badge-bg/20 dark:hover:bg-blue-400/20 relative h-8.5 w-full flex-row justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  Search RateMyProfessor
                  <RMPIcon className="mt-.25 relative size-5.5! opacity-90" />
                </Badge>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="flex-1"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          <Link href={redditURL}>
            <Badge
              variant="outline"
              className="relative h-8.5 w-full flex-row justify-center gap-2 rounded-lg border-[#eb511c]/15 bg-[#eb511c]/10 px-3 py-2 text-xs font-semibold text-[#eb511c] hover:bg-[#eb511c]/20 dark:border-[#d65531]/20 dark:bg-[#d65531]/10 dark:text-[#d65531] dark:hover:bg-[#d65531]/20"
            >
              Search Reddit
              <RedditIcon className="relative size-4! opacity-90" />
            </Badge>
          </Link>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}
