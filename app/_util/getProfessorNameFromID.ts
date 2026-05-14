import professorList from "@/professorList";
import sampleProfessorList from "@/sampleProfessorList";

const activeProfessorList = process.env.NODE_ENV === "development"
  ? new Map([...professorList, ...sampleProfessorList])
  : professorList;

export const getProfessorNameFromID = (professorID: number): string => {
  return activeProfessorList.get(professorID) ?? String(professorID);
};

export function getProfessorNameFromList(
  professorID: string | null,
  list: { id: string; name: string }[],
  fallback = "All Professors"
): string {
  if (!professorID || professorID === "all-professors") return fallback;
  return list.find((p) => p.id === professorID)?.name ?? fallback;
}
