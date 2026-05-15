import { titleCase } from "text-title-case";

// Parses "fall_2025" → "Fall 2025", optionally { format: "mini" } → "Fall '25"
export function cleanSemesterName(
  semester: string,
  options?: { format?: "full" | "mini" }
): string {
  const cleaned = titleCase(semester.replace(/[_-]/g, " "));
  return options?.format === "mini"
    ? cleaned.replace(/ (20)(\d{2})/g, " '$2")
    : cleaned;
}
