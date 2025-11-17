import professorList from "@/professorList";

export const getProfessorNameFromID = (professorID : number): string => {
  return (professorList.get(professorID)) ?? String(professorID)
}