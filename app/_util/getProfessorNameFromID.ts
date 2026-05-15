import professorList from "@/cache/professor-list";

export const getProfessorNameFromID = (professorID: number): string => {
  return professorList.get(professorID) ?? String(professorID);
};

export function getProfessorNameFromList(
  professorID: string | null,
  list: { id: string; name: string }[],
  fallback = "All Professors"
): string {
  if (!professorID || professorID === "all-professors") return fallback;
  return list.find((p) => p.id === professorID)?.name ?? fallback;
}
